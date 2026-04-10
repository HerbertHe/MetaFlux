import "dotenv/config";
import type { Request, Response } from "express";
import express from "express";
import { createHash, scryptSync, timingSafeEqual } from "node:crypto";
import { getPool } from "./_lib/db/pool";
import { migrate } from "./_lib/db/migrate";
import { getBearerToken } from "./_lib/auth/bearer";
import { signJwt, verifyJwt } from "./_lib/auth/jwt";

const app = express();
app.use(express.json({ limit: "1mb" }));

function getPasswordSalt() {
  const s = process.env.PASSWORD_SALT;
  if (!s) throw new Error("Missing env PASSWORD_SALT");
  return s;
}

function normalizeEmail(email: unknown) {
  if (typeof email !== "string") return null;
  const v = email.trim().toLowerCase();
  return v || null;
}
function normalizeText(v: unknown) {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s || null;
}
function normalizeAccount(v: unknown) {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s || null;
}
function normalizePhone(countryCode?: unknown, phoneNumber?: unknown) {
  const cc = typeof countryCode === "string" ? countryCode.trim() : "";
  const pn = typeof phoneNumber === "string" ? phoneNumber.trim() : "";
  if (!cc || !pn) return { phone_country_code: null, phone_number: null, phone_e164: null };
  const e164 = `+${cc.replace(/^\+/, "")}${pn.replace(/[^\d]/g, "")}`;
  return { phone_country_code: cc.replace(/^\+/, ""), phone_number: pn, phone_e164: e164 };
}

function hashPassword(password: string) {
  const digest = createHash("sha256")
    .update(password, "utf8")
    .update(getPasswordSalt(), "utf8")
    .digest("hex");
  return `sha256:${digest}`;
}
function isValidSha256Hash(v: unknown): boolean {
  return (
    typeof v === "string" &&
    v.startsWith("sha256:") &&
    v.split(":").length === 2 &&
    v.slice("sha256:".length).length === 64
  );
}
function isValidScryptHash(v: unknown): boolean {
  return typeof v === "string" && v.startsWith("scrypt:") && v.split(":").length === 3;
}
function verifyPassword(password: string, storedHash: string) {
  if (isValidSha256Hash(storedHash)) {
    const expectedHex = storedHash.slice("sha256:".length);
    const expected = Buffer.from(expectedHex, "hex");
    const actual = createHash("sha256")
      .update(password, "utf8")
      .update(getPasswordSalt(), "utf8")
      .digest();
    return timingSafeEqual(expected, actual);
  }
  if (isValidScryptHash(storedHash)) {
    const [, saltHex, hashHex] = storedHash.split(":");
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const actual = scryptSync(password, salt, expected.length);
    return timingSafeEqual(expected, actual);
  }
  return false;
}

function requireAuth(req: Request) {
  const token = getBearerToken(req);
  if (!token) return null;
  return verifyJwt(token);
}

app.get("/api", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    name: "MetaFlux API (Express on Vercel Functions)",
    endpoints: {
      health: "/api/health",
      login: "/api/auth/login",
      users: "/api/users",
    },
  });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, ts: Date.now() });
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  await migrate();
  const pool = getPool();

  const email = normalizeEmail(req.body?.email);
  const password = typeof req.body?.password === "string" ? req.body.password.trim() : "";
  if (!email) return res.status(400).json({ ok: false, error: "EMAIL_REQUIRED" });
  if (!password) return res.status(400).json({ ok: false, error: "PASSWORD_REQUIRED" });

  const r = await pool.query(
    `SELECT id, account, email, password_hash
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email],
  );
  if (r.rowCount === 0) return res.status(401).json({ ok: false, error: "INVALID_CREDENTIALS" });
  const user = r.rows[0] as { id: string | number; account: string; email: string; password_hash: string };
  if (!verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ ok: false, error: "INVALID_CREDENTIALS" });
  }

  const expiresIn = Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 60 * 60 * 24 * 7);
  const now = Math.floor(Date.now() / 1000);
  const token = signJwt({
    sub: String(user.id),
    account: user.account,
    iat: now,
    exp: now + expiresIn,
  });
  return res.json({ ok: true, token, token_type: "Bearer", expires_in: expiresIn, user: { id: user.id, email: user.email, account: user.account } });
});

app.get("/api/users", async (req: Request, res: Response) => {
  await migrate();
  const pool = getPool();

  const id = typeof req.query.id === "string" ? req.query.id : null;
  const account = typeof req.query.account === "string" ? req.query.account : null;

  if (id) {
    const r = await pool.query(
      `SELECT id, nickname, email, phone_country_code, phone_number, phone_e164, account, avatar_url, created_at, updated_at
       FROM users WHERE id = $1 LIMIT 1`,
      [Number(id)],
    );
    if (r.rowCount === 0) return res.status(404).json({ ok: false, error: "NOT_FOUND" });
    return res.json({ ok: true, user: r.rows[0] });
  }
  if (account) {
    const r = await pool.query(
      `SELECT id, nickname, email, phone_country_code, phone_number, phone_e164, account, avatar_url, created_at, updated_at
       FROM users WHERE account = $1 LIMIT 1`,
      [account],
    );
    if (r.rowCount === 0) return res.status(404).json({ ok: false, error: "NOT_FOUND" });
    return res.json({ ok: true, user: r.rows[0] });
  }

  const r = await pool.query(
    `SELECT id, nickname, email, phone_country_code, phone_number, phone_e164, account, avatar_url, created_at, updated_at
     FROM users ORDER BY id DESC LIMIT 100`,
  );
  return res.json({ ok: true, users: r.rows });
});

app.post("/api/users", async (req: Request, res: Response) => {
  await migrate();
  const pool = getPool();

  const account = normalizeAccount(req.body?.account);
  const email = normalizeEmail(req.body?.email);
  const nickname = normalizeText(req.body?.nickname);
  const avatar_url = normalizeText(req.body?.avatar_url);
  const phone = normalizePhone(req.body?.phone_country_code, req.body?.phone_number);
  const password = typeof req.body?.password === "string" ? req.body.password.trim() : "";

  if (!account) return res.status(400).json({ ok: false, error: "ACCOUNT_REQUIRED" });
  if (!password) return res.status(400).json({ ok: false, error: "PASSWORD_REQUIRED" });

  const password_hash = hashPassword(password);
  const r = await pool.query(
    `
    INSERT INTO users (account, password_hash, nickname, email, phone_country_code, phone_number, phone_e164, avatar_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (account)
    DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      nickname = EXCLUDED.nickname,
      email = EXCLUDED.email,
      phone_country_code = EXCLUDED.phone_country_code,
      phone_number = EXCLUDED.phone_number,
      phone_e164 = EXCLUDED.phone_e164,
      avatar_url = EXCLUDED.avatar_url
    RETURNING id, nickname, email, phone_country_code, phone_number, phone_e164, account, avatar_url, created_at, updated_at
    `,
    [
      account,
      password_hash,
      nickname,
      email,
      phone.phone_country_code,
      phone.phone_number,
      phone.phone_e164,
      avatar_url,
    ],
  );
  return res.status(201).json({ ok: true, user: r.rows[0] });
});

app.patch("/api/users", async (req: Request, res: Response) => {
  const auth = requireAuth(req);
  if (!auth) return res.status(401).json({ ok: false, error: "UNAUTHORIZED" });

  await migrate();
  const pool = getPool();

  const nickname = normalizeText(req.body?.nickname);
  const email = normalizeEmail(req.body?.email);
  const avatar_url = normalizeText(req.body?.avatar_url);
  const phone = normalizePhone(req.body?.phone_country_code, req.body?.phone_number);
  const password = typeof req.body?.password === "string" ? req.body.password.trim() : "";
  const password_hash = password ? hashPassword(password) : null;

  const r = await pool.query(
    `
    UPDATE users
    SET
      nickname = COALESCE($1, nickname),
      email = $2,
      phone_country_code = $3,
      phone_number = $4,
      phone_e164 = $5,
      avatar_url = COALESCE($6, avatar_url),
      password_hash = COALESCE($7, password_hash)
    WHERE id = $8
    RETURNING id, nickname, email, phone_country_code, phone_number, phone_e164, account, avatar_url, created_at, updated_at
    `,
    [
      nickname,
      email,
      phone.phone_country_code,
      phone.phone_number,
      phone.phone_e164,
      avatar_url,
      password_hash,
      Number(auth.sub),
    ],
  );
  if (r.rowCount === 0) return res.status(404).json({ ok: false, error: "NOT_FOUND" });
  return res.json({ ok: true, user: r.rows[0] });
});

app.delete("/api/users", async (req: Request, res: Response) => {
  const auth = requireAuth(req);
  if (!auth) return res.status(401).json({ ok: false, error: "UNAUTHORIZED" });

  await migrate();
  const pool = getPool();
  await pool.query("DELETE FROM users WHERE id = $1", [Number(auth.sub)]);
  return res.json({ ok: true });
});

app.use((err: unknown, _req: Request, res: Response, _next: unknown) => {
  const message = err instanceof Error ? err.message : "UNKNOWN_ERROR";
  res.status(500).json({ ok: false, error: "INTERNAL_ERROR", message });
});

export default app;
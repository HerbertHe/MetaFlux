import "dotenv/config";
import { createHmac, timingSafeEqual } from "node:crypto";

export type JwtPayload = {
  sub: string;
  account: string;
  iat: number;
  exp: number;
};

function base64UrlEncode(input: Buffer | string) {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf.toString("base64").replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
}

function base64UrlDecodeToBuffer(input: string) {
  const b64 = input.replaceAll("-", "+").replaceAll("_", "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  return Buffer.from(b64 + pad, "base64");
}

function getJwtSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("Missing env JWT_SECRET");
  return s;
}

export function signJwt(payload: JwtPayload) {
  const header = { alg: "HS256", typ: "JWT" } as const;
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const sig = createHmac("sha256", getJwtSecret()).update(data).digest();
  const encodedSig = base64UrlEncode(sig);
  return `${data}.${encodedSig}`;
}

export function verifyJwt(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [encodedHeader, encodedPayload, encodedSig] = parts;

  const data = `${encodedHeader}.${encodedPayload}`;
  const expectedSig = createHmac("sha256", getJwtSecret()).update(data).digest();
  const actualSig = base64UrlDecodeToBuffer(encodedSig);
  if (expectedSig.length !== actualSig.length) return null;
  if (!timingSafeEqual(expectedSig, actualSig)) return null;

  const payloadRaw = base64UrlDecodeToBuffer(encodedPayload).toString("utf8");
  const payload = JSON.parse(payloadRaw) as JwtPayload;
  if (!payload?.sub || !payload?.exp) return null;
  if (Date.now() / 1000 >= payload.exp) return null;
  return payload;
}


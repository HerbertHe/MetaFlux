import "dotenv/config";
import { Pool } from "pg";
import type { Pool as PgPool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __metafluxPgPool: PgPool | undefined;
}

function shouldUseSsl(connectionString: string | undefined) {
  if (!connectionString) return false;
  if (process.env.PGSSLMODE?.toLowerCase() === "require") return true;
  if (/\bsslmode=require\b/i.test(connectionString)) return true;
  return process.env.NODE_ENV === "production";
}

export function getPool() {
  if (globalThis.__metafluxPgPool) return globalThis.__metafluxPgPool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing env DATABASE_URL");
  }

  const pool = new Pool({
    connectionString,
    ssl: shouldUseSsl(connectionString) ? { rejectUnauthorized: false } : undefined,
    max: Number(process.env.PG_POOL_MAX ?? 5),
  });

  globalThis.__metafluxPgPool = pool;
  return pool;
}


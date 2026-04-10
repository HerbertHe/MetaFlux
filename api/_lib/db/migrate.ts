import type { Pool } from "pg";
import { getPool } from "./pool";
import fs from "node:fs/promises";
import path from "node:path";

declare global {
  // eslint-disable-next-line no-var
  var __metafluxMigratePromise: Promise<void> | undefined;
}

async function ensureMigrationsTable(pool: Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

function migrationsDir() {
  // Compiled as CommonJS (__dirname is provided by Node); paths are relative to this file.
  return path.resolve(__dirname, "..", "..", "migrations");
}

export async function migrate() {
  if (globalThis.__metafluxMigratePromise) return globalThis.__metafluxMigratePromise;

  globalThis.__metafluxMigratePromise = (async () => {
    const pool = getPool();
    await ensureMigrationsTable(pool);

    const dir = migrationsDir();
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && e.name.endsWith(".sql"))
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b));

    if (files.length === 0) return;

    const applied = await pool.query<{ version: string }>("SELECT version FROM schema_migrations");
    const appliedSet = new Set(applied.rows.map((r) => r.version));

    for (const file of files) {
      if (appliedSet.has(file)) continue;

      const fullPath = path.join(dir, file);
      const sql = await fs.readFile(fullPath, "utf8");

      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations(version) VALUES ($1)", [file]);
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
    }
  })();

  return globalThis.__metafluxMigratePromise;
}


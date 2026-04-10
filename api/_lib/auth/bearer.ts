import type { IncomingMessage } from "node:http";

export function getBearerToken(req: IncomingMessage) {
  const h = req.headers.authorization || req.headers.Authorization;
  if (!h || typeof h !== "string") return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}


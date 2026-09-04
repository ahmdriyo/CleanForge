import * as crypto from "crypto";
import { getSecret } from "@/server/infra/secret-manager";
import type { McpTokenPayload } from "@/types/mcp.type";

let cachedSecret: string | null = null;

const getJwtSecret = async (): Promise<string> => {
  if (cachedSecret) return cachedSecret;
  const secret = await getSecret("MCP_JWT_SECRET");
  if (secret) {
    cachedSecret = secret;
    return secret;
  }
  // fallback for dev
  return process.env.MCP_JWT_SECRET || "dev-mcp-secret-change-me";
};

const base64UrlEncode = (str: string) =>
  Buffer.from(str).toString("base64url");

const base64UrlDecode = (str: string) =>
  Buffer.from(str, "base64url").toString("utf8");

export const signMcpJwt = async (payload: Omit<McpTokenPayload, "iat" | "exp"> & { expiresInDays?: number }): Promise<string> => {
  const secret = await getJwtSecret();
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (payload.expiresInDays ?? 30) * 24 * 60 * 60;
  const body = base64UrlEncode(JSON.stringify({ uid: payload.uid, standardId: payload.standardId, iat: now, exp }));
  const signature = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
};

export const verifyMcpJwt = async (token: string): Promise<McpTokenPayload | null> => {
  try {
    const secret = await getJwtSecret();
    const [header, body, signature] = token.split(".");
    if (!header || !body || !signature) return null;
    const expected = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
    if (signature !== expected) return null;
    const payload = JSON.parse(base64UrlDecode(body)) as McpTokenPayload;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
};

export const hashToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

export const getMcpTokenFromHeader = (req: Request): string | null => {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
};

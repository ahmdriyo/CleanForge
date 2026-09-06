import { signMcpJwt, verifyMcpJwt, hashToken } from "@/server/auth/verify-mcp-token";
import { updateMcpToken } from "@/server/repository/standard-repository";
import { createOrUpdateMcp } from "@/server/repository/mcp-repository";
import type { GenerateMcpResponse } from "@/types/mcp.type";

/**
 * Token Service — Bearer JWT for MCP SSE
 */

export const generateMcpToken = async (args: {
  uid: string;
  standardId: string;
  standardName: string;
  endpointPath: string;
  endpointFull: string;
  expiresInDays?: number | null;
  requireToken?: boolean;
}): Promise<GenerateMcpResponse> => {
  const expiresInDays = args.expiresInDays ?? 1;
  const requireToken = args.requireToken ?? false;

  let token: string | null = null;
  let hash: string | null = null;
  let expiresAt: string | null = null;

  if (requireToken) {
    token = await signMcpJwt({
      uid: args.uid,
      standardId: args.standardId,
      expiresInDays,
    });
    hash = hashToken(token);
    if (expiresInDays !== null && expiresInDays !== undefined) {
      expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString();
    }
  } else {
    // No token — still respect expiry for endpoint availability
    if (expiresInDays !== null && expiresInDays !== undefined) {
      expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString();
    }
  }

  // Save to standard (hash null if no token)
  await updateMcpToken(args.uid, args.standardId, hash, args.endpointPath, expiresAt, requireToken);

  // Denormalize to mcps collection
  await createOrUpdateMcp(args.uid, {
    standardId: args.standardId,
    standardName: args.standardName,
    name: `${args.standardName} MCP`,
    endpoint: args.endpointFull,
    token: hash,
    status: "active",
    usageCount: 0,
    expiresAt,
    requireToken,
  });

  return {
    endpoint: args.endpointPath,
    endpointFull: args.endpointFull,
    token,
    expiresAt,
    requireToken,
  };
};

export const verifyMcpTokenForStandard = async (token: string, expectedUid: string, expectedStandardId: string): Promise<boolean> => {
  const payload = await verifyMcpJwt(token);
  if (!payload) return false;
  if (payload.uid !== expectedUid) return false;
  if (payload.standardId !== expectedStandardId) return false;
  return true;
};

export { verifyMcpJwt, hashToken };

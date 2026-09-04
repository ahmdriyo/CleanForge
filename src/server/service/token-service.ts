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
}): Promise<GenerateMcpResponse> => {
  const token = await signMcpJwt({ uid: args.uid, standardId: args.standardId, expiresInDays: 30 });
  const hash = hashToken(token);

  // Save hash to standard
  await updateMcpToken(args.uid, args.standardId, hash, args.endpointPath);

  // Denormalize to mcps collection
  await createOrUpdateMcp(args.uid, {
    standardId: args.standardId,
    standardName: args.standardName,
    name: `${args.standardName} MCP`,
    endpoint: args.endpointFull,
    token: hash,
    status: "active",
    usageCount: 0,
  });

  return {
    endpoint: args.endpointPath,
    endpointFull: args.endpointFull,
    token,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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

import { baseApiToken } from "@/const/base-api";
import { RestEndpoint } from "@/const/rest-endpoint";
import type { McpEndpoint } from "@/types/standard";
import type { ApiResponse } from "@/types/api.type";

export const McpService = {
  getMcps: async (): Promise<ApiResponse<McpEndpoint[]>> => {
    const res = await baseApiToken.get(RestEndpoint.GetMcps);
    return res.data;
  },
  testMcp: async (mcpId: string): Promise<ApiResponse<{ tools: unknown[]; endpoint: string }>> => {
    const res = await baseApiToken.post(`/api/mcps/${mcpId}/test`);
    return res.data;
  },
  regenerateMcp: async (
    mcpId: string,
    options?: { expiresInDays?: number | null; requireToken?: boolean },
  ): Promise<ApiResponse<{ endpoint: string; endpointFull: string; token: string | null; expiresAt: string | null; requireToken: boolean }>> => {
    const res = await baseApiToken.post(`/api/mcps/${mcpId}/regenerate`, options || {});
    return res.data;
  },
};

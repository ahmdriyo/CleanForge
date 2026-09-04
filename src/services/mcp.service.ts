import { baseApiToken } from "@/const/base-api";
import { RestEndpoint } from "@/const/rest-endpoint";
import type { McpEndpoint } from "@/types/standard";
import type { ApiResponse } from "@/types/api.type";

export const McpService = {
  getMcps: async (): Promise<ApiResponse<McpEndpoint[]>> => {
    const res = await baseApiToken.get(RestEndpoint.GetMcps);
    return res.data;
  },
};

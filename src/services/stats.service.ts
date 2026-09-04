import { baseApiToken } from "@/const/base-api";
import { RestEndpoint } from "@/const/rest-endpoint";
import type { StatsResponse, ApiResponse } from "@/types/api.type";

export const StatsService = {
  getStats: async (): Promise<ApiResponse<StatsResponse>> => {
    const res = await baseApiToken.get(RestEndpoint.GetStats);
    return res.data;
  },
};

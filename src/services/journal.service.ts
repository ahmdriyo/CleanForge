import { baseApiToken } from "@/const/base-api";
import { RestEndpoint } from "@/const/rest-endpoint";
import type { Journal } from "@/types/journal.type";
import type { ApiResponse } from "@/types/api.type";

export const JournalService = {
  getJournals: async (standardId?: string): Promise<ApiResponse<Journal[]>> => {
    const params = standardId ? { standardId } : undefined;
    const res = await baseApiToken.get(RestEndpoint.GetJournals, { params });
    return res.data;
  },

  getJournalByStandardId: async (standardId: string): Promise<ApiResponse<Journal[]>> => {
    const res = await baseApiToken.get(RestEndpoint.GetJournals, { params: { standardId } });
    return res.data;
  },
};

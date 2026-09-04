import { baseApi } from "@/const/base-api";
import { RestEndpoint } from "@/const/rest-endpoint";
import type { Template } from "@/types/standard";
import type { ApiResponse } from "@/types/api.type";

export const TemplateService = {
  getTemplates: async (): Promise<ApiResponse<Template[]>> => {
    const res = await baseApi.get(RestEndpoint.GetTemplates);
    return res.data;
  },
};

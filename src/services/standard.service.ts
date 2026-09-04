import { baseApiToken } from "@/const/base-api";
import { RestEndpoint } from "@/const/rest-endpoint";
import type { Standard } from "@/types/standard";
import type { ApiResponse } from "@/types/api.type";

export const StandardService = {
  getStandards: async (): Promise<ApiResponse<Standard[]>> => {
    const res = await baseApiToken.get(RestEndpoint.GetStandards);
    return res.data;
  },

  getStandardById: async (id: string): Promise<ApiResponse<Standard>> => {
    const res = await baseApiToken.get(`${RestEndpoint.GetStandardById}/${id}`);
    return res.data;
  },

  postStandard: async (
    payload: Partial<Standard>,
  ): Promise<ApiResponse<Standard>> => {
    const res = await baseApiToken.post(RestEndpoint.PostStandard, payload);
    return res.data;
  },

  patchStandardById: async (
    id: string,
    payload: Partial<Standard>,
  ): Promise<ApiResponse<Standard>> => {
    const res = await baseApiToken.patch(
      `${RestEndpoint.PatchStandardById}/${id}`,
      payload,
    );
    return res.data;
  },

  putStandardById: async (
    id: string,
    payload: Partial<Standard>,
  ): Promise<ApiResponse<Standard>> => {
    const res = await baseApiToken.put(
      `${RestEndpoint.PutStandardById}/${id}`,
      payload,
    );
    return res.data;
  },

  deleteStandardById: async (id: string): Promise<ApiResponse<null>> => {
    const res = await baseApiToken.delete(
      `${RestEndpoint.DeleteStandardById}/${id}`,
    );
    return res.data;
  },

  generateMcp: async (
    id: string,
  ): Promise<
    ApiResponse<{
      endpoint: string;
      endpointFull: string;
      token: string;
      expiresAt: string;
    }>
  > => {
    const res = await baseApiToken.post(
      `${RestEndpoint.PostGenerateMcp}/${id}/generate-mcp`,
    );
    return res.data;
  },

  generateExample: async (payload: {
    folderPath: string;
    rules: string;
    naming: string;
  }): Promise<ApiResponse<{ code: string }>> => {
    const res = await baseApiToken.post(
      RestEndpoint.PostGenerateExample,
      payload,
    );
    return res.data;
  },
};

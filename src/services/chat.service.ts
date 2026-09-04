import { baseApiToken } from "@/const/base-api";
import { RestEndpoint } from "@/const/rest-endpoint";
import type { ChatResponse } from "@/types/journal.type";
import type { ApiResponse } from "@/types/api.type";

export const ChatService = {
  postChat: async (payload: { standardId: string; message: string }): Promise<ApiResponse<ChatResponse>> => {
    const res = await baseApiToken.post(RestEndpoint.PostChat, payload);
    return res.data;
  },
};

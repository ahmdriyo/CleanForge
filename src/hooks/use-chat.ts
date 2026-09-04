import { ChatService } from "@/services/chat.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { JOURNAL_QUERY_KEYS } from "./use-journals";

export const useChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { standardId: string; message: string }) => ChatService.postChat(payload),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.byStandard(variables.standardId) });
      queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.all });
    },
  });
};

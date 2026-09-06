import { StandardService } from "@/services/standard.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Standard } from "@/types/standard";
import type { ApiResponse } from "@/types/api.type";

export const STANDARD_QUERY_KEYS = {
  all: ["standards"] as const,
  details: () => [...STANDARD_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...STANDARD_QUERY_KEYS.details(), id] as const,
};

export const useStandards = () => {
  return useQuery({
    queryKey: STANDARD_QUERY_KEYS.all,
    queryFn: () => StandardService.getStandards(),
    select: (res: ApiResponse<Standard[]>) => (res.success ? res.data : []),
  });
};

export const useStandardById = (id: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: STANDARD_QUERY_KEYS.detail(id),
    queryFn: () => StandardService.getStandardById(id),
    enabled: Boolean(id),
    initialData: (): ApiResponse<Standard> | undefined => {
      // Check if standard already exists in standards list cache
      const cached = queryClient.getQueryData<
        ApiResponse<Standard[]> | Standard[]
      >(["standards"]);
      const list = Array.isArray(cached)
        ? cached
        : cached && cached.success
          ? cached.data
          : undefined;
      const found = list?.find((s: Standard) => s.id === id);
      if (found) {
        return { success: true, data: found };
      }
      return undefined;
    },
    select: (res: ApiResponse<Standard>) => (res.success ? res.data : null),
    staleTime: 0,
    refetchOnMount: "always",
  });
};

export const useCreateStandard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Standard>) => StandardService.postStandard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STANDARD_QUERY_KEYS.all });
    },
  });
};

export const useUpdateStandard = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Standard>) =>
      StandardService.patchStandardById(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: STANDARD_QUERY_KEYS.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: STANDARD_QUERY_KEYS.all });
    },
  });
};

export const useDeleteStandard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => StandardService.deleteStandardById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STANDARD_QUERY_KEYS.all });
    },
  });
};

export const useGenerateMcp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => StandardService.generateMcp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mcps"] });
      queryClient.invalidateQueries({ queryKey: STANDARD_QUERY_KEYS.all });
    },
  });
};

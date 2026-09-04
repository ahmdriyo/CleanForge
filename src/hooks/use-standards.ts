import { StandardService } from "@/services/standard.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Standard } from "@/types/standard";

export const STANDARD_QUERY_KEYS = {
  all: ["standards"] as const,
  details: () => [...STANDARD_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...STANDARD_QUERY_KEYS.details(), id] as const,
};

export const useStandards = () => {
  return useQuery({
    queryKey: STANDARD_QUERY_KEYS.all,
    queryFn: () => StandardService.getStandards(),
    select: (res: any) => res.data,
  });
};

export const useStandardById = (id: string) => {
  return useQuery({
    queryKey: STANDARD_QUERY_KEYS.detail(id),
    queryFn: () => StandardService.getStandardById(id),
    enabled: Boolean(id),
    select: (res: any) => res.data,
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
    mutationFn: (data: Partial<Standard>) => StandardService.patchStandardById(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STANDARD_QUERY_KEYS.detail(id) });
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

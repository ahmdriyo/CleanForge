import { StatsService } from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";
import type { StatsResponse, ApiResponse } from "@/types/api.type";

export const STATS_QUERY_KEYS = {
  all: ["stats"] as const,
};

export const useStats = () => {
  return useQuery({
    queryKey: STATS_QUERY_KEYS.all,
    queryFn: () => StatsService.getStats(),
    select: (res: ApiResponse<StatsResponse>) => (res.success ? res.data : null),
  });
};

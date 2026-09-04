import { StatsService } from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";

export const STATS_QUERY_KEYS = {
  all: ["stats"] as const,
};

export const useStats = () => {
  return useQuery({
    queryKey: STATS_QUERY_KEYS.all,
    queryFn: () => StatsService.getStats(),
    select: (res: any) => res.data,
  });
};

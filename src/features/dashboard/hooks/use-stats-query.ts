"use client";

import { StatsService } from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";
import { dummyStats } from "@/data-dummy/stats-dummy";

export const useStatsQuery = () =>
  useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      try {
        const res = await StatsService.getStats();
        if (res.success) return res.data as unknown as typeof dummyStats;
        return dummyStats;
      } catch {
        return dummyStats;
      }
    },
  });

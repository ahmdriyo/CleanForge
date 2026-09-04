"use client";

import { StatsService } from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";

export const useStatsQuery = () =>
  useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await StatsService.getStats();
      if (!res.success) throw new Error(res.message || "Failed to fetch stats");
      return res.data;
    },
  });

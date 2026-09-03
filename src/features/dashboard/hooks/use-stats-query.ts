"use client";

import { useQuery } from "@tanstack/react-query";
import { dummyStats } from "@/data-dummy/stats-dummy";

export const useStatsQuery = () =>
  useQuery({
    queryKey: ["stats"],
    queryFn: async () => dummyStats,
  });

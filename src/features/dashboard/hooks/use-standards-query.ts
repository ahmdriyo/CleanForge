"use client";

import { StandardService } from "@/services/standard.service";
import { useQuery } from "@tanstack/react-query";

export const useStandardsQuery = () =>
  useQuery({
    queryKey: ["standards"],
    queryFn: async () => {
      const res = await StandardService.getStandards();
      if (!res.success) throw new Error(res.message || "Failed to fetch standards");
      return res.data;
    },
  });

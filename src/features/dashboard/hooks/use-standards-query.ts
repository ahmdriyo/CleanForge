"use client";

import { StandardService } from "@/services/standard.service";
import { useQuery } from "@tanstack/react-query";
import { dummyStandards } from "@/data-dummy/standards-dummy";

export const useStandardsQuery = () =>
  useQuery({
    queryKey: ["standards"],
    queryFn: async () => {
      try {
        const res = await StandardService.getStandards();
        // unwrap ApiResponse
        if (res.success) return res.data as unknown as typeof dummyStandards;
        return dummyStandards;
      } catch {
        return dummyStandards;
      }
    },
  });

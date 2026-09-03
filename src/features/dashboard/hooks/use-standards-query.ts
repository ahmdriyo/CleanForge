"use client";

import { useQuery } from "@tanstack/react-query";
import { dummyStandards } from "@/data-dummy/standards-dummy";

export const useStandardsQuery = () =>
  useQuery({
    queryKey: ["standards"],
    queryFn: async () => dummyStandards,
  });

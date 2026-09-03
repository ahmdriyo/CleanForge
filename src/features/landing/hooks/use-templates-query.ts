"use client";

import { useQuery } from "@tanstack/react-query";
import { dummyTemplates } from "@/data-dummy/templates-dummy";

export const useTemplatesQuery = () =>
  useQuery({
    queryKey: ["landing-templates"],
    queryFn: async () => dummyTemplates,
    staleTime: 1000 * 60 * 5,
  });

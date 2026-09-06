"use client";

import { TemplateService } from "@/services/template.service";
import { useQuery } from "@tanstack/react-query";

export const useTemplatesQuery = () =>
  useQuery({
    queryKey: ["landing-templates"],
    queryFn: async () => {
      const res = await TemplateService.getTemplates();
      if (!res.success) throw new Error(res.message || "Failed to fetch templates");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

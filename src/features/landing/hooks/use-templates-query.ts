"use client";

import { TemplateService } from "@/services/template.service";
import { useQuery } from "@tanstack/react-query";
import { dummyTemplates } from "@/data-dummy/templates-dummy";

export const useTemplatesQuery = () =>
  useQuery({
    queryKey: ["landing-templates"],
    queryFn: async () => {
      try {
        const res = await TemplateService.getTemplates();
        if (res.success) return res.data as unknown as typeof dummyTemplates;
        return dummyTemplates;
      } catch {
        return dummyTemplates;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

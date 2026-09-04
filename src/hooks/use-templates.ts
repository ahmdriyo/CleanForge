import { TemplateService } from "@/services/template.service";
import { useQuery } from "@tanstack/react-query";
import type { Template } from "@/types/standard";
import type { ApiResponse } from "@/types/api.type";

export const TEMPLATE_QUERY_KEYS = {
  all: ["templates"] as const,
};

export const useTemplates = () => {
  return useQuery({
    queryKey: TEMPLATE_QUERY_KEYS.all,
    queryFn: () => TemplateService.getTemplates(),
    select: (res: ApiResponse<Template[]>) => (res.success ? res.data : []),
  });
};

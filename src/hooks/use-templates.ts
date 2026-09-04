import { TemplateService } from "@/services/template.service";
import { useQuery } from "@tanstack/react-query";

export const TEMPLATE_QUERY_KEYS = {
  all: ["templates"] as const,
};

export const useTemplates = () => {
  return useQuery({
    queryKey: TEMPLATE_QUERY_KEYS.all,
    queryFn: () => TemplateService.getTemplates(),
    select: (res: any) => res.data,
  });
};

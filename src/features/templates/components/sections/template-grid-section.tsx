"use client";

import { TemplateService } from "@/services/template.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, Loader2 } from "lucide-react";
import {
  SiNextdotjs,
  SiNestjs,
  SiGo,
  SiFlutter,
  SiExpress,
  SiLaravel,
  SiNuxt,
  SiReact,
  SiDjango,
  SiFastapi,
} from "react-icons/si";
import { FaGolang } from "react-icons/fa6";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StandardService } from "@/services/standard.service";
import { getFrameworkTemplate } from "@/const/framework-templates";
import { STANDARD_QUERY_KEYS } from "@/hooks/use-standards";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  nextjs: SiNextdotjs,
  nestjs: SiNestjs,
  go: SiGo,
  flutter: SiFlutter,
  express: SiExpress,
  laravel: SiLaravel,
  nuxt: SiNuxt,
  vite: SiReact,
  react: SiReact,
  django: SiDjango,
  golang: FaGolang,
  fastapi: SiFastapi,
};

export const TemplateGridSection = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const res = await TemplateService.getTemplates();
      if (!res.success)
        throw new Error(res.message || "Failed to fetch templates");
      return res.data;
    },
  });
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleUse = async (id: string) => {
    const tpl = data?.find((t) => t.id === id);
    if (!tpl) {
      toast.error("Template not found");
      return;
    }
    setLoadingId(id);
    try {
      const frameworkOpt = getFrameworkTemplate(tpl.icon);
      const payload = {
        name: tpl.name,
        framework: frameworkOpt.id,
        description: tpl.description,
        folderStructure: tpl.folderStructure,
        globalRules: frameworkOpt.defaultRules,
      };
      const res = await StandardService.postStandard(payload as unknown as Partial<import("@/types/standard").Standard>);
      if (!res.success || !res.data?.id) {
        throw new Error(res.message || "Failed to clone template");
      }
      toast.success(`Template "${tpl.name}" cloned — opening Forge`);
      queryClient.invalidateQueries({ queryKey: STANDARD_QUERY_KEYS.all });
      router.push(`/forge/${res.data.id}`);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === "object" && e !== null && "response" in e
            ? ((e as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Failed to clone template")
            : "Failed to clone template";
      toast.error(msg);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {data?.map((tpl) => {
        const Icon = iconMap[tpl.icon] || Layers;
        return (
          <div
            key={tpl.id}
            className="bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-xl border border-white/60 rounded-[20px] p-5 hover:bg-white/70 hover:shadow-lg transition flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-white/70 flex items-center justify-center">
                <Icon className="w-5 h-5 text-slate-900" />
              </div>
              <Badge className="bg-slate-900 text-white rounded-full text-xs">
                {tpl.framework}
              </Badge>
            </div>
            <h3 className="font-semibold text-slate-900">{tpl.name}</h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
              {tpl.description}
            </p>
            <div className="mt-3 bg-white/80 rounded-xl border border-white/70 p-3">
              <div className="text-[11px] uppercase tracking-widest text-slate-400 font-medium mb-1">
                Structure Preview
              </div>
              <div className="font-mono text-xs text-slate-600">
                {tpl.structurePreview}
              </div>
              <div className="text-xs text-slate-400 mt-2">{tpl.rules}</div>
            </div>
            <Button
              className="mt-4 w-full rounded-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60"
              onClick={() => handleUse(tpl.id)}
              disabled={loadingId === tpl.id}
            >
              {loadingId === tpl.id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Cloning...
                </>
              ) : (
                "Use Template"
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
};

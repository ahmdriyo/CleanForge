"use client";

import { useQuery } from "@tanstack/react-query";
import { dummyTemplates } from "@/data-dummy/templates-dummy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";
import { SiNextdotjs, SiNestjs, SiGo } from "react-icons/si";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  nextjs: SiNextdotjs,
  nestjs: SiNestjs,
  go: SiGo,
};

export const TemplateGridSection = () => {
  const { data } = useQuery({ queryKey: ["templates"], queryFn: async () => dummyTemplates });
  const router = useRouter();

  const handleUse = (id: string) => {
    toast.success(`Cloned template ${id} (dummy) — Redirecting to Forge`);
    router.push(`/forge/${id}`);
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {data?.map((tpl) => {
        const Icon = iconMap[tpl.icon] || Layers;
        return (
          <div key={tpl.id} className="bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-xl border border-white/40 rounded-[20px] p-5 hover:bg-white/70 hover:shadow-lg transition flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-white/50 flex items-center justify-center">
                <Icon className="w-5 h-5 text-slate-900" />
              </div>
              <Badge className="bg-slate-900 text-white rounded-full text-xs">{tpl.framework}</Badge>
            </div>
            <h3 className="font-semibold text-slate-900">{tpl.name}</h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{tpl.description}</p>
            <div className="mt-3 bg-white/60 rounded-xl border border-white/50 p-3">
              <div className="text-[11px] uppercase tracking-widest text-slate-400 font-medium mb-1">Structure Preview</div>
              <div className="font-mono text-xs text-slate-600">{tpl.structurePreview}</div>
              <div className="text-xs text-slate-400 mt-2">{tpl.rules}</div>
            </div>
            <Button className="mt-4 w-full rounded-full bg-violet-600 hover:bg-violet-700" onClick={() => handleUse(tpl.id)}>
              Use Template
            </Button>
          </div>
        );
      })}
    </div>
  );
};

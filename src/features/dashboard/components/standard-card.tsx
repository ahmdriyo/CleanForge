"use client";

import type { Standard } from "@/types/standard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Layers } from "lucide-react";
import Link from "next/link";
import { POPULAR_FRAMEWORKS } from "@/const/framework-templates";

export const StandardCard = ({ standard }: { standard: Standard }) => {
  const statusColor =
    standard.mcpStatus === "active"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : standard.mcpStatus === "draft"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-slate-100 text-slate-600 border-slate-200";

  const frameworkInfo = POPULAR_FRAMEWORKS.find(
    (f) => f.id === standard.framework || f.name.toLowerCase() === standard.framework?.toLowerCase()
  );
  const displayName = frameworkInfo ? frameworkInfo.name : standard.framework;

  return (
    <div className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-[20px] p-5 hover:bg-white/85 hover:border-white/70 hover:shadow-[0_12px_40px_rgba(59,130,246,0.15)] transition-all duration-300 flex flex-col shadow-[0_8px_32px_rgba(59,130,246,0.08)]">
      <div className="flex items-center gap-2 mb-3">
        <Badge className="bg-slate-900 text-white rounded-full text-[11px] px-2.5 py-0.5 font-medium border-0">
          {displayName}
        </Badge>
        <Badge variant="outline" className={`${statusColor} rounded-full text-[11px] capitalize`}>
          {standard.mcpStatus}
        </Badge>
        <span className="ml-auto flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className={`w-2 h-2 rounded-full ${standard.mcpStatus === "active" ? "bg-emerald-400 animate-pulse" : "bg-slate-300"}`} />
          MCP: {standard.mcpStatus}
        </span>
      </div>

      <h3 className="font-semibold tracking-tight text-slate-900 text-[15px] leading-tight mb-1">{standard.name}</h3>
      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3">{standard.description}</p>

      <div className="bg-white/70 backdrop-blur border border-white/60 rounded-xl p-3 mb-4">
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">
          <Layers className="w-3 h-3" /> Project Structure
        </div>
        <div className="space-y-1 font-mono text-xs text-slate-600">
          <div>src/features/auth</div>
          <div>src/features/forge</div>
          <div>src/components/ui</div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" /> Updated 2h ago
        </span>
        <Link href={`/forge/${standard.id}`}>
          <Button size="sm" className="rounded-full bg-violet-600 hover:bg-violet-700 text-white text-xs px-4 h-8">
            Open in Forge
          </Button>
        </Link>
      </div>
    </div>
  );
};

"use client";

import { useStatsQuery } from "@/features/dashboard/hooks/use-stats-query";
import { Layers, Plug, LayoutTemplate, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const StatsSection = () => {
  const { data, isLoading } = useStatsQuery();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[110px] rounded-[20px] bg-white/30" />
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Total Standards", value: data.totalStandards, sub: data.trends.standards, icon: Layers, color: "text-violet-600 bg-violet-50" },
    { label: "Active MCPs", value: data.activeMcps, sub: data.trends.mcps, icon: Plug, color: "text-emerald-600 bg-emerald-50" },
    { label: "Templates Used", value: data.templatesUsed, sub: data.trends.templates, icon: LayoutTemplate, color: "text-indigo-600 bg-indigo-50" },
    { label: "Avg. Features", value: data.avgFeatures, sub: "Per standard", icon: BarChart3, color: "text-cyan-600 bg-cyan-50" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div key={card.label} className="bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-xl border border-white/40 rounded-[20px] p-5 shadow-[0_8px_32px_rgba(31,38,135,0.07)]">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-1">
              {card.sub}
            </span>
          </div>
          <div className="text-3xl font-bold tracking-tight text-slate-900">{card.value}</div>
          <div className="text-xs font-medium uppercase tracking-widest text-slate-400 mt-1">{card.label}</div>
        </div>
      ))}
    </div>
  );
};

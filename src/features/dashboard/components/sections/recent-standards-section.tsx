"use client";

import Link from "next/link";
import { useStandardsQuery } from "@/features/dashboard/hooks/use-standards-query";
import { StandardCard } from "@/features/dashboard/components/standard-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";

export const RecentStandardsSection = () => {
  const { data, isLoading } = useStandardsQuery();

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[280px] rounded-[20px] bg-white/30" />
        ))}
      </div>
    );
  }

  const recent = data?.slice(0, 3) ?? [];

  if (recent.length === 0) {
    return (
      <div className="bg-white/30 backdrop-blur-xl border border-dashed border-white/50 rounded-[24px] p-12 text-center">
        <div className="w-16 h-16 bg-white/60 rounded-3xl border border-white/50 flex items-center justify-center mx-auto mb-4">
          <FolderOpen className="w-8 h-8 text-violet-600" />
        </div>
        <h3 className="font-semibold text-slate-900">No standards yet</h3>
        <p className="text-sm text-slate-500 mt-1 mb-6">Create your first clean standard</p>
        <div className="flex justify-center gap-3">
          <Link href="/forge/new">
            <Button className="rounded-full bg-violet-600 hover:bg-violet-700 text-white">Start from Scratch</Button>
          </Link>
          <Link href="/templates">
            <Button variant="outline" className="rounded-full bg-white/50 border-white/50">
              Browse Templates
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">Recent Standards</h2>
        <Link href="/standards" className="text-sm font-medium text-violet-600 hover:text-violet-700">
          View All
        </Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recent.map((std) => (
          <StandardCard key={std.id} standard={std} />
        ))}
      </div>
    </div>
  );
};

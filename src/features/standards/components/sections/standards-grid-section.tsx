"use client";

import { useState, useMemo } from "react";
import { useStandardsQuery } from "@/features/dashboard/hooks/use-standards-query";
import { StandardCard } from "@/features/dashboard/components/standard-card";
import { Skeleton } from "@/components/ui/skeleton";
import { StandardsHeaderSection } from "./standards-header-section";

export const StandardsGridSection = () => {
  const { data, isLoading } = useStandardsQuery();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || s.framework === filter;
      return matchesSearch && matchesFilter;
    });
  }, [data, search, filter]);

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[280px] rounded-[20px] bg-white/55" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <StandardsHeaderSection onSearch={setSearch} onFilter={setFilter} />
      {filtered.length === 0 ? (
        <div className="bg-white/55 backdrop-blur-xl border border-dashed border-white/70 rounded-[24px] p-12 text-center">
          <p className="font-medium text-slate-900">No standards found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filter</p>
          <button onClick={() => { setSearch(""); setFilter("all"); }} className="mt-4 text-sm text-violet-600 hover:text-violet-700 font-medium">
            Clear search
          </button>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((std) => (
              <StandardCard key={std.id} standard={std} />
            ))}
          </div>
          <div className="mt-6 text-center text-xs text-slate-400">Showing {filtered.length} of {data?.length} standards</div>
        </>
      )}
    </div>
  );
};

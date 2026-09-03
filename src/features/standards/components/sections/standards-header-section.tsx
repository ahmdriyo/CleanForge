"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

export const StandardsHeaderSection = ({
  onSearch,
  onFilter,
}: {
  onSearch: (v: string) => void;
  onFilter: (v: string) => void;
}) => {
  const [search, setSearch] = useState("");
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Standards</h1>
        <p className="text-sm text-slate-500">Manage all your clean standards</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search standards..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onSearch(e.target.value);
            }}
            className="pl-9 bg-white/60 backdrop-blur border-white/40 rounded-full w-[220px] focus-visible:ring-violet-500"
          />
        </div>
        <Select onValueChange={(v) => onFilter(v ?? "all")} defaultValue="all">
          <SelectTrigger className="w-[160px] bg-white/60 backdrop-blur border-white/40 rounded-full">
            <SelectValue placeholder="Filter by Framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Frameworks</SelectItem>
            <SelectItem value="nextjs">Next.js</SelectItem>
            <SelectItem value="nestjs">NestJS</SelectItem>
            <SelectItem value="go">Go</SelectItem>
          </SelectContent>
        </Select>
        <Link href="/forge/new">
          <Button className="rounded-full bg-violet-600 hover:bg-violet-700 text-white">
            <Plus className="w-4 h-4" /> New Standard
          </Button>
        </Link>
      </div>
    </div>
  );
};

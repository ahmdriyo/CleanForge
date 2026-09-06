"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const DashboardHeaderSection = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
          Good morning
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your clean standards and enforce them to every AI Agent.
        </p>
      </div>
      <Link href="/forge/new">
        <Button className="rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/20 px-6">
          <Plus className="w-4 h-4" /> New Standard
        </Button>
      </Link>
    </div>
  );
};

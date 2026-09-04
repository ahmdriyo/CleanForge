"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GenerateMcpSection } from "./generate-mcp-section";

export const ForgeHeaderSection = ({ standardName, standardId }: { standardName: string; standardId: string }) => {
  const [name, setName] = useState(standardName);
  return (
    <div className="bg-white/65 backdrop-blur-xl border border-white/60 rounded-full px-4 py-2 flex flex-col md:flex-row gap-3 md:items-center justify-between mb-4">
      <div className="flex items-center gap-3 flex-1">
        <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-white/80 border-white/70 rounded-full font-medium max-w-[280px] h-8" placeholder="e.g., My Next.js Clean Standard" />
        <Badge className="bg-slate-900 text-white rounded-full hidden md:inline-flex">Next.js 15</Badge>
        <span className="text-xs text-slate-400 hidden lg:inline">Last saved 5m ago</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="rounded-full bg-white/75 border-white/70">
          Save
        </Button>
        <GenerateMcpSection standardName={name} standardId={standardId} />
      </div>
    </div>
  );
};

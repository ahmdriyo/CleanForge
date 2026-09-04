"use client";

import { McpService } from "@/services/mcp.service";
import { useQuery } from "@tanstack/react-query";
import { dummyMcps } from "@/data-dummy/mcps-dummy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Plug, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const McpsListSection = () => {
  const { data } = useQuery({
    queryKey: ["mcps"],
    queryFn: async () => {
      try {
        const res = await McpService.getMcps();
        if (res.success) return res.data as unknown as typeof dummyMcps;
        return dummyMcps;
      } catch {
        return dummyMcps;
      }
    },
  });
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (endpoint: string, token: string, id: string) => {
    navigator.clipboard.writeText(`${endpoint}?token=${token}`);
    setCopied(id);
    toast.success("Copied endpoint to clipboard");
    setTimeout(() => setCopied(null), 2000);
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white/55 backdrop-blur-xl border border-dashed border-white/70 rounded-[24px] p-12 text-center">
        <p className="font-medium text-slate-900">No MCPs yet — Generate from Forge Studio</p>
        <a href="/forge/new" className="inline-flex mt-4 rounded-full bg-violet-600 text-white px-6 py-2.5 text-sm font-medium">Go to Forge</a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((mcp) => (
        <div key={mcp.id} className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-[20px] p-5 hover:bg-white/80 transition flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Plug className="w-4 h-4 text-violet-600" />
              <h3 className="font-semibold text-slate-900 text-sm">{mcp.name}</h3>
              <Badge className={`${mcp.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600"} rounded-full text-[11px]`} variant="outline">
                {mcp.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mb-2">Standard: {mcp.standardName}</p>
            <code className="block font-mono text-xs bg-slate-900 text-emerald-300 rounded-lg px-3 py-2 truncate">{mcp.endpoint}?token={mcp.token}</code>
            <div className="mt-2 text-xs text-slate-400">Usage: {mcp.usageCount} calls • Created {new Date(mcp.createdAt).toLocaleDateString()}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="rounded-full bg-white/75 border-white/70" onClick={() => handleCopy(mcp.endpoint, mcp.token, mcp.id)}>
              {copied === mcp.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied === mcp.id ? "Copied" : "Copy Link"}
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full" onClick={() => toast("Regenerated token (dummy)")}>
              <RefreshCw className="w-4 h-4" /> Regenerate
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full" onClick={() => toast.success("Connection OK (dummy)")}>
              Test
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

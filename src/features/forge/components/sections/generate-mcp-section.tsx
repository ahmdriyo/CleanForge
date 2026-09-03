"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Copy, Check, Plug } from "lucide-react";
import { toast } from "sonner";

export const GenerateMcpSection = ({ standardName }: { standardName: string }) => {
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);
  const endpoint = `https://cleanforge.run.app/mcp/user-1/${standardName.toLowerCase().replace(/\s+/g, "-")}/sse`;
  const previewJson = `{\n  "name": "${standardName}",\n  "tools": ["get_my_project_standard", "get_folder_rules", "scaffold_feature", "validate_structure"],\n  "framework": "nextjs",\n  "naming": "kebab-case"\n}`;

  const handleGenerate = () => {
    setGenerated(true);
    toast.success("MCP generated successfully!");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${endpoint}?token=mcp_tok_abc123`);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size="sm" className="rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md">
            <Plug className="w-4 h-4" /> Generate MCP
          </Button>
        }
      />
      <DialogContent className="bg-white/80 backdrop-blur-2xl border-white/70 rounded-[24px] max-w-[560px] max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Generate Private MCP Endpoint</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-widest text-slate-400">Preview JSON</Label>
            <pre className="mt-1 bg-slate-900 rounded-xl p-4 font-mono text-xs text-emerald-300 overflow-auto max-h-40">{previewJson}</pre>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-slate-400">API Key (Optional)</Label>
            <Input type="password" placeholder="sk-..." className="bg-white/80 rounded-xl mt-1" />
            <p className="text-xs text-slate-400 mt-1">Stored securely via Secret Manager. Leave empty if not needed.</p>
          </div>
          {!generated ? (
            <Button onClick={handleGenerate} className="w-full rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
              Generate
            </Button>
          ) : (
            <>
              <div className="bg-gradient-to-br from-violet-50 to-white border border-violet-200 rounded-xl p-3">
                <div className="text-xs font-medium text-slate-700 mb-1">Your Private Endpoint</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 font-mono text-xs bg-slate-900 text-emerald-300 rounded-lg px-2 py-2 truncate">{endpoint}?token=mcp_tok_abc123</code>
                  <Button size="sm" variant="outline" className="rounded-full shrink-0" onClick={handleCopy}>
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <div className="mt-2 flex gap-2">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs px-2.5 py-1">Private</span>
                  <span className="bg-violet-50 text-violet-700 border border-violet-200 rounded-full text-xs px-2.5 py-1">Active</span>
                </div>
              </div>
              <div className="bg-white/80 border border-white/70 rounded-xl p-3">
                <div className="text-sm font-medium text-slate-900 mb-2">How to Connect</div>
                <p className="text-xs text-slate-500 mb-2">Cursor: Settings → MCP → Add server → Paste URL</p>
                <pre className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-slate-300 overflow-auto">{`{\n  "mcpServers": {\n    "cleanforge": {\n      "url": "${endpoint}?token=YOUR_TOKEN"\n    }\n  }\n}`}</pre>
                <Button variant="outline" size="sm" className="mt-3 rounded-full w-full" onClick={() => toast.success("Connection tested (dummy): tools/list OK")}>
                  Test Connection
                </Button>
              </div>
              <Button variant="link" size="sm" className="w-full text-violet-600" onClick={() => toast("Regenerated token (dummy)")}>
                Regenerate Token
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

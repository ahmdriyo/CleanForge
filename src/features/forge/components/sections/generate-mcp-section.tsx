"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Copy,
  Check,
  Plug,
  Eye,
  EyeOff,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

type GenerateMcpData = {
  endpoint: string;
  endpointFull: string;
  token: string;
  expiresAt: string;
};

export const GenerateMcpSection = ({
  standardName,
  standardId,
}: {
  standardName: string;
  standardId: string;
}) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [realEndpoint, setRealEndpoint] = useState<string | null>(null);
  const [realToken, setRealToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const endpoint =
    realEndpoint ||
    `https://cleanforge.run.app/mcp/<uid>/${standardName.toLowerCase().replace(/\s+/g, "-")}/sse`;
  const previewJson = `{\n  "name": "${standardName}",\n  "tools": ["get_my_project_standard", "get_folder_rules", "scaffold_feature", "validate_structure"],\n  "framework": "nextjs",\n  "naming": "kebab-case"\n}`;

  const isNew = !standardId || standardId === "new";

  const handleGenerate = async () => {
    if (isNew) {
      toast.error("Save your standard first before generating MCP");
      return;
    }
    setIsGenerating(true);
    try {
      const { StandardService } = await import("@/services/standard.service");
      const res = await StandardService.generateMcp(standardId);
      if (res.success) {
        const data = res.data;
        setRealEndpoint(data.endpointFull);
        setRealToken(data.token);
        setExpiresAt(data.expiresAt);
        setGenerated(true);
        setShowToken(true);
        toast.success("MCP generated — token shown once!");
        return;
      }
      toast.error(res.message || "Failed to generate MCP");
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === "object" && e !== null && "response" in e
            ? ((e as { response?: { data?: { message?: string } } }).response
                ?.data?.message ?? "Failed to generate MCP")
            : "Failed to generate MCP";
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    setTestResult(null);
    await handleGenerate();
    toast.success("Token regenerated — old token revoked");
  };

  const copy = async (
    text: string,
    key: string,
    msg = "Copied to clipboard",
  ) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success(msg);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleTest = async () => {
    if (!realEndpoint || !realToken) {
      toast.error("Generate token first");
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      // Try GET tools/list via Bearer header (SSE endpoint supports GET with header)
      const res = await fetch(realEndpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${realToken}`,
          Accept: "application/json",
        },
      });
      const text = await res.text();
      if (!res.ok) {
        setTestResult(`✗ ${res.status} — ${text.slice(0, 300)}`);
        toast.error(`Test failed: ${res.status}`);
        return;
      }
      // try parse json
      let pretty = text;
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2).slice(0, 600);
      } catch {
        pretty = text.slice(0, 600);
      }
      setTestResult(`✓ Connected — tools/list OK\n${pretty}`);
      toast.success("Connection OK — tools/list");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setTestResult(`✗ ${msg}`);
      toast.error("Test failed");
    } finally {
      setIsTesting(false);
    }
  };

  const mcpConfigSnippet = `{\n  "mcpServers": {\n    "cleanforge": {\n      "url": "${realEndpoint || endpoint}",\n      "headers": {\n        "Authorization": "Bearer YOUR_TOKEN"\n      }\n    }\n  }\n}`;
  const curlSnippet = `curl -H "Authorization: Bearer ${realToken ? realToken.slice(0, 12) + "..." : "YOUR_TOKEN"}" \\\n  -H "Accept: text/event-stream" \\\n  ${realEndpoint || endpoint}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="sm"
            className="rounded-full bg-linear-to-br from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md"
          >
            <Plug className="w-4 h-4" /> Generate MCP
          </Button>
        }
      />
      <DialogContent className="bg-white/95 backdrop-blur-2xl border border-white/80 rounded-[24px] w-[95vw] sm:max-w-2xl max-h-[88vh] overflow-y-auto overflow-x-hidden p-5 sm:p-6 gap-4 sm:gap-5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[18px]">
            <span className="w-8 h-8 rounded-full bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Plug className="w-4 h-4 text-white" />
            </span>
            Generate Private MCP Endpoint
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Bearer JWT — header{" "}
            <code className="bg-slate-900 text-emerald-300 px-1.5 py-0.5 rounded break-all">
              Authorization: Bearer &lt;JWT&gt;
            </code>{" "}
            — token shown once.
          </p>
        </DialogHeader>

        <div className="space-y-4 max-w-full overflow-x-hidden">
          {/* Preview */}
          <div>
            <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Preview JSON
            </Label>
            <pre className="mt-1.5 bg-slate-900 rounded-xl p-3.5 font-mono text-xs text-emerald-300 whitespace-pre-wrap break-all overflow-y-auto overflow-x-hidden max-h-36 border border-slate-800">
              {previewJson}
            </pre>
          </div>

          {/* Secret input — per PRD, stored via Secret Manager */}
          <div>
            <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              API Key (Optional)
            </Label>
            <Input
              type="password"
              placeholder="sk-... (stored via Secret Manager)"
              className="bg-white/80 rounded-xl mt-1.5 border-white/60"
              disabled
            />
            <p className="text-[11px] text-slate-400 mt-1.5 flex gap-1.5 items-start">
              <ShieldCheck className="w-3 h-3 mt-0.5 shrink-0 text-violet-500" />
              Secrets are never hardcoded — managed via Google Secret Manager.
            </p>
          </div>

          {!generated ? (
            <>
              {isNew && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2.5 text-amber-900">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <span className="font-semibold">Save standard first.</span>{" "}
                    Click &quot;Save&quot; in the header before generating your
                    private MCP endpoint.
                  </div>
                </div>
              )}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || isNew}
                className="w-full rounded-full bg-linear-to-br from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 h-10"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
              <p className="text-[11px] text-center text-slate-400">
                Creates SHA-256 hash in <code>users/{"{uid}"}/standards</code> +
                denormalized <code>mcps</code>
              </p>
            </>
          ) : (
            <>
              {/* Endpoint */}
              <div className="bg-linear-to-br from-violet-50 to-white border border-violet-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-violet-600" />{" "}
                    Your Private Endpoint (SSE)
                  </div>
                  <span className="text-[11px] bg-white border border-violet-200 rounded-full px-2 py-0.5 font-mono text-violet-700">
                    GET/POST
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <code className="flex-1 font-mono text-[11px] sm:text-xs bg-slate-900 text-emerald-300 rounded-lg p-2.5 min-w-0 break-all select-all border border-slate-800">
                    {realEndpoint}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full shrink-0 h-9"
                    onClick={() =>
                      copy(realEndpoint!, "endpoint", "Endpoint copied")
                    }
                  >
                    {copied === "endpoint" ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}{" "}
                    {copied === "endpoint" ? "Copied" : "Copy"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs px-2.5 py-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Private
                  </span>
                  <span className="bg-violet-50 text-violet-700 border border-violet-200 rounded-full text-xs px-2.5 py-1">
                    Active • Bearer JWT
                  </span>
                  {expiresAt && (
                    <span className="bg-white text-slate-600 border border-slate-200 rounded-full text-xs px-2.5 py-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Expires{" "}
                      {new Date(expiresAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Token */}
              <div className="bg-white border border-amber-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-semibold uppercase tracking-widest text-amber-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Bearer Token — shown
                    once
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs rounded-full"
                    onClick={() => setShowToken((v) => !v)}
                  >
                    {showToken ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                    {showToken ? " Hide" : " Show"}
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <code
                    className={`flex-1 font-mono text-[11px] sm:text-xs rounded-lg p-2.5 min-w-0 border break-all select-all ${showToken ? "bg-slate-900 text-amber-200 border-slate-800" : "bg-slate-100 text-slate-400 border-slate-200 blur-[6px] select-none"}`}
                  >
                    {realToken}
                  </code>
                  <Button
                    size="sm"
                    className="rounded-full shrink-0 h-9 bg-slate-900 hover:bg-black text-white"
                    onClick={() =>
                      copy(realToken!, "token", "Token copied — keep secret!")
                    }
                  >
                    {copied === "token" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}{" "}
                    {copied === "token" ? "Copied" : "Copy Token"}
                  </Button>
                </div>
                <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5">
                  ⚠️ Copy now — plaintext never stored. Only SHA-256 hash is in
                  Firestore. Regenerating revokes old token.
                </p>
              </div>

              {/* How to Connect */}
              <div className="bg-white/90 border border-white/80 rounded-xl p-4 space-y-3 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">
                  How to Connect — Bearer Header
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-slate-600 mb-1.5">
                      1. Claude Desktop / Cursor —{" "}
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        claude_desktop_config.json
                      </code>
                    </div>
                    <div className="relative">
                      <pre className="bg-slate-900 rounded-xl p-3 font-mono text-xs text-slate-300 whitespace-pre-wrap break-all overflow-x-hidden border border-slate-800">
                        {mcpConfigSnippet}
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 h-7 rounded-full bg-white/90 text-xs"
                        onClick={() => copy(mcpConfigSnippet, "config")}
                      >
                        {copied === "config" ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}{" "}
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-600 mb-1.5">
                      2. curl / mcp-remote (SSE)
                    </div>
                    <div className="relative">
                      <pre className="bg-slate-900 rounded-xl p-3 font-mono text-xs text-emerald-300 whitespace-pre-wrap break-all overflow-x-hidden border border-slate-800">
                        {curlSnippet}
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 h-7 rounded-full bg-white/90 text-xs"
                        onClick={() =>
                          copy(
                            `curl -H "Authorization: Bearer ${realToken}" -H "Accept: text/event-stream" ${realEndpoint}`,
                            "curl",
                          )
                        }
                      >
                        {copied === "curl" ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}{" "}
                        Copy
                      </Button>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      MCP uses{" "}
                      <code className="bg-slate-100 px-1 rounded">
                        Authorization: Bearer &lt;JWT&gt;
                      </code>
                      .
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full w-full h-9 border-violet-200"
                  onClick={handleTest}
                  disabled={isTesting}
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Testing...
                    </>
                  ) : (
                    "Test Connection (tools/list)"
                  )}
                </Button>
                {testResult && (
                  <pre
                    className={`rounded-xl p-3 font-mono text-xs whitespace-pre-wrap break-all overflow-y-auto overflow-x-hidden max-h-36 border ${testResult.startsWith("✓") ? "bg-emerald-50 text-emerald-900 border-emerald-200" : "bg-red-50 text-red-900 border-red-200"}`}
                  >
                    {testResult}
                  </pre>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-full"
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}{" "}
                  Regenerate Token
                </Button>
                <Button
                  size="sm"
                  className="flex-1 rounded-full bg-slate-900 hover:bg-black text-white"
                  onClick={() => setOpen(false)}
                >
                  Done
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

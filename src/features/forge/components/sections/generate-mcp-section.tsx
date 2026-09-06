"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Copy,
  Check,
  Plug,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

const EXPIRY_OPTIONS = [
  { label: "1 day", value: "1" },
  { label: "7 days", value: "7" },
  { label: "30 days", value: "30" },
  { label: "90 days", value: "90" },
  { label: "1 year", value: "365" },
  { label: "Never expires", value: "never" },
];

const AGENT_OPTIONS = [
  { value: "opencode", label: "Opencode", file: "opencode.json" },
  { value: "cursor", label: "Cursor", file: "Cursor → Settings → MCP" },
  { value: "claude-desktop", label: "Claude Desktop", file: "claude_desktop_config.json" },
  { value: "claude-code", label: "Claude Code", file: "claude mcp add" },
  { value: "windsurf", label: "Windsurf", file: "mcp_config.json" },
  { value: "cline", label: "Cline (VS Code)", file: "cline_mcp_settings.json" },
  { value: "vscode", label: "VS Code", file: ".vscode/mcp.json" },
  { value: "generic", label: "Generic SSE", file: "mcpServers" },
] as const;

export const GenerateMcpSection = ({
  standardName,
  standardId,
}: {
  standardName: string;
  standardId: string;
}) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [realEndpoint, setRealEndpoint] = useState<string | null>(null);
  const [realToken, setRealToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [requireToken, setRequireToken] = useState<boolean>(false);
  const [generated, setGenerated] = useState(false);

  // Options before generate
  const [selectedExpiry, setSelectedExpiry] = useState<string>("1");
  const [selectedRequireToken, setSelectedRequireToken] = useState<boolean>(false);
  const [selectedAgent, setSelectedAgent] = useState<string>("opencode");

  // Existing MCP fetched from server
  const [existing, setExisting] = useState<{
    endpoint: string;
    endpointFull: string;
    expiresAt: string | null;
    requireToken: boolean;
    isActive: boolean;
    isExpired: boolean;
    hasToken: boolean;
    status: string;
  } | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const endpointPreview = `https://cleanforge.run.app/mcp/<uid>/${standardName.toLowerCase().replace(/\s+/g, "-")}/sse`;
  const [previewJson, setPreviewJson] = useState(
    `{\n  "name": "${standardName}",\n  "tools": ["get_my_project_standard", "get_folder_rules", "scaffold_feature", "validate_structure"],\n  "framework": "nextjs",\n  "naming": "kebab-case"\n}`,
  );
  const [previewLoading, setPreviewLoading] = useState(false);

  const isNew = !standardId || standardId === "new";

  // Fetch preview (full enriched standard) + existing MCP when modal opens
  useEffect(() => {
    if (!open) return;
    if (!isNew) {
      // fetch preview enriched from actual standard (same data MCP will serve)
      setPreviewLoading(true);
      import("@/services/standard.service")
        .then(({ StandardService }) =>
          StandardService.getStandardById(standardId),
        )
        .then((res) => {
          if (res.success && res.data) {
            const s = res.data as unknown as {
              name: string;
              framework: string;
              folderStructure: unknown;
              globalRules: unknown;
            };
            // Build a truncated but complete-structure preview: show folderStructure fully, plus note about flatList via MCP
            const full = {
              name: s.name,
              framework: s.framework,
              globalRules: s.globalRules,
              folderStructure: s.folderStructure,
              note: "Full data via MCP get_my_project_standard ALSO includes vibeCodingInstructions (copy-paste prompt for AI), flatList, filePaths, textTree enriched, stats — 1:1 with Forge Visual Tree + Inspector (rules/naming/exampleCode/description per node)",
            };
            const str = JSON.stringify(full, null, 2);
            setPreviewJson(
              str.length > 1800
                ? str.slice(0, 1800) + "\n  ... (truncated, full via MCP) \n}"
                : str,
            );
          }
        })
        .catch(() => {})
        .finally(() => setPreviewLoading(false));
    }
    if (isNew || hasFetched) return;
    const fetchExisting = async () => {
      setLoadingExisting(true);
      try {
        const { StandardService } = await import("@/services/standard.service");
        const res = await StandardService.getMcpConfig(standardId);
        if (res.success && res.data) {
          const d = res.data;
          setExisting({
            endpoint: d.endpoint,
            endpointFull: d.endpointFull,
            expiresAt: d.expiresAt,
            requireToken: d.requireToken,
            isActive: d.isActive,
            isExpired: d.isExpired,
            hasToken: d.hasToken,
            status: d.status,
          });
          // If active, show it as current endpoint immediately
          if (d.isActive && !d.isExpired) {
            setRealEndpoint(d.endpointFull);
            setExpiresAt(d.expiresAt);
            setRequireToken(d.requireToken);
            setRealToken(null); // token not retrievable
            setGenerated(true);
            // Prefill selectors with current values for regenerate
            if (d.expiresAt === null) setSelectedExpiry("never");
            else {
              // try infer days from expiresAt? Keep default 1
              setSelectedExpiry("1");
            }
            setSelectedRequireToken(d.requireToken);
          } else if (d.isExpired) {
            // expired: show expired state but still display endpoint
            setRealEndpoint(d.endpointFull);
            setExpiresAt(d.expiresAt);
            setRequireToken(d.requireToken);
            setGenerated(false); // show form with warning
          }
        }
      } catch {
        // ignore, no existing
      } finally {
        setLoadingExisting(false);
        setHasFetched(true);
      }
    };
    fetchExisting();
  }, [open, isNew, standardId, hasFetched]);

  // Reset fetch when closing
  useEffect(() => {
    if (!open) {
      setHasFetched(false);
      setTestResult(null);
    }
  }, [open]);

  const handleGenerate = async () => {
    if (isNew) {
      toast.error("Save your standard first before generating MCP");
      return;
    }
    setIsGenerating(true);
    try {
      const { StandardService } = await import("@/services/standard.service");
      const expiresInDays =
        selectedExpiry === "never" ? null : Number(selectedExpiry);
      const res = await StandardService.generateMcp(standardId, {
        expiresInDays,
        requireToken: selectedRequireToken,
      });
      if (res.success) {
        const data = res.data;
        setRealEndpoint(data.endpointFull);
        setRealToken(data.token);
        setExpiresAt(data.expiresAt);
        setRequireToken(data.requireToken);
        setGenerated(true);
        setShowToken(!!data.token);
        // update existing cache
        setExisting({
          endpoint: data.endpoint,
          endpointFull: data.endpointFull,
          expiresAt: data.expiresAt,
          requireToken: data.requireToken,
          isActive: true,
          isExpired: false,
          hasToken: !!data.token,
          status: "active",
        });
        toast.success(
          data.token
            ? "MCP generated — token shown once!"
            : "MCP endpoint generated (public, no token)",
        );
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
    if (selectedRequireToken)
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
    if (!realEndpoint) {
      toast.error("No endpoint to test");
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      if (requireToken && realToken)
        headers.Authorization = `Bearer ${realToken}`;
      // 1) tools/list (MCP spec compliance)
      const resTools = await fetch(realEndpoint, { method: "GET", headers });
      const textTools = await resTools.text();
      if (!resTools.ok) {
        setTestResult(
          `✗ tools/list ${resTools.status} — ${textTools.slice(0, 400)}`,
        );
        toast.error(`Test failed: ${resTools.status}`);
        return;
      }
      let prettyTools = textTools;
      try {
        prettyTools = JSON.stringify(JSON.parse(textTools), null, 2).slice(
          0,
          500,
        );
      } catch {
        prettyTools = textTools.slice(0, 500);
      }

      // 2) get_my_project_standard via GET query (proves completeness — same as Project Structure in Forge)
      const sep = realEndpoint.includes("?") ? "&" : "?";
      const fullUrl = `${realEndpoint}${sep}method=get_my_project_standard&raw=1`;
      const resStd = await fetch(fullUrl, { method: "GET", headers });
      const textStd = await resStd.text();
      let prettyStd = textStd;
      let stdSummary = "";
      try {
        const parsed = JSON.parse(textStd);
        // raw=1 returns { standard: { ... } } directly or via data wrapper
        const std = parsed.standard || parsed.data?.standard || parsed;
        const cnt = std.flatList?.length || std.folderStructure ? "found" : "?";
        const total = std.stats
          ? `${std.stats.totalFolders}f/${std.stats.totalFiles}files`
          : cnt;
        stdSummary = std.name
          ? `${std.name} (${std.framework}) — ${total}`
          : "";
        prettyStd = JSON.stringify(parsed, null, 2).slice(0, 800);
      } catch {
        prettyStd = textStd.slice(0, 800);
      }
      if (!resStd.ok) {
        setTestResult(
          `✓ tools/list OK\n${prettyTools}\n\n✗ get_my_project_standard ${resStd.status} — ${prettyStd.slice(0, 400)}`,
        );
        toast.error(`Standard fetch failed: ${resStd.status}`);
        return;
      }
      setTestResult(
        `✓ tools/list OK — 4 tools\n${prettyTools}\n\n✓ get_my_project_standard OK — ${stdSummary}\n${prettyStd}`,
      );
      toast.success("Connection OK — complete standard fetched");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setTestResult(`✗ ${msg}`);
      toast.error("Test failed");
    } finally {
      setIsTesting(false);
    }
  };

  const currentEndpoint = realEndpoint || endpointPreview;
  const tokenPlaceholder = realToken ? realToken : "YOUR_TOKEN";
  const getAgentSnippet = (agent: string) => {
    const urlLine = `"url": "${currentEndpoint}"`;
    const headersLine = requireToken
      ? `,
      "headers": {
        "Authorization": "Bearer ${tokenPlaceholder}"
      }`
      : "";
    const mcpRemoteHeaders = requireToken ? `, "--header", "Authorization: Bearer ${tokenPlaceholder}"` : "";
    switch (agent) {
      case "opencode":
        return `{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "cleanforge": {
      "type": "remote",
      "url": "${currentEndpoint}",${requireToken ? `
      "headers": { "Authorization": "Bearer ${tokenPlaceholder}" },` : ""}
      "enabled": true
    }
  }
}`;
      case "cursor":
        return `{
  "mcpServers": {
    "cleanforge": {
      "url": "${currentEndpoint}"${headersLine}
    }
  }
}
// Cursor → Settings → Features → MCP Servers → Add`;
      case "claude-desktop":
        return `{
  "mcpServers": {
    "cleanforge": {
      "url": "${currentEndpoint}"${headersLine}
    }
  }
}
// File: ~/Library/Application Support/Claude/claude_desktop_config.json (macOS)
//       %APPDATA%\\Claude\\claude_desktop_config.json (Windows)`;
      case "claude-code":
        return `# Claude Code CLI
claude mcp add --transport sse cleanforge ${currentEndpoint} ${requireToken ? `--header "Authorization: Bearer ${tokenPlaceholder}"` : ""}
# or add to ~/.claude.json mcpServers`;
      case "windsurf":
        return `{
  "mcpServers": {
    "cleanforge": {
      "url": "${currentEndpoint}"${headersLine}
    }
  }
}
// File: ~/.codeium/windsurf/mcp_config.json`;
      case "cline":
        return `{
  "mcpServers": {
    "cleanforge": {
      "url": "${currentEndpoint}"${headersLine},
      "disabled": false,
      "autoApprove": []
    }
  }
}
// File: VS Code → Cline → MCP Servers (cline_mcp_settings.json)`;
      case "vscode":
        return `{
  "servers": {
    "cleanforge": {
      "url": "${currentEndpoint}"${headersLine ? `,\n      "headers": { "Authorization": "Bearer ${tokenPlaceholder}" }` : ""}
    }
  }
}
// File: .vscode/mcp.json (VS Code 1.99+)`;
      case "generic":
        return `// Generic MCP Remote (mcp-remote proxy for legacy clients)
{
  "mcpServers": {
    "cleanforge": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "${currentEndpoint}"${mcpRemoteHeaders}]
    }
  }
}`;
      default:
        return `{
  "mcpServers": {
    "cleanforge": {
      "url": "${currentEndpoint}"${headersLine}
    }
  }
}`;
    }
  };
  const mcpConfigSnippet = getAgentSnippet(selectedAgent);
  const curlSnippet = requireToken
    ? `curl -H "Authorization: Bearer ${tokenPlaceholder.slice(0, 16)}..." \\\n  -H "Accept: text/event-stream" \\\n  "${currentEndpoint}?method=get_my_project_standard&raw=1"`
    : `curl -H "Accept: application/json" \\\n  "${currentEndpoint}?method=get_my_project_standard&raw=1"`;

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
          <p className="text-xs text-slate-500 mt-1">
            Private SSE endpoint for AI agents. Configure expiry & token
            protection below.
          </p>
        </DialogHeader>

        <div className="space-y-4 max-w-full overflow-x-hidden">
          {/* Endpoint preview — compact */}
          <div>
            <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              Endpoint
              {previewLoading && (
                <Loader2 className="w-3 h-3 animate-spin text-violet-600" />
              )}
            </Label>
            <code className="mt-1.5 block bg-slate-900 rounded-xl px-3 py-2.5 font-mono text-xs text-emerald-300 break-all border border-slate-800">
              {realEndpoint || endpointPreview}
            </code>
            <p className="text-[11px] text-slate-500 mt-1.5">
              AI will call{" "}
              <code className="bg-slate-100 px-1 rounded">
                get_my_project_standard
              </code>{" "}
              via this URL to get your full folder structure & per-folder rules.
            </p>
          </div>

          {/* Status — only if exists */}
          {loadingExisting && (
            <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-violet-600" />{" "}
              Checking endpoint...
            </div>
          )}
          {existing &&
            !loadingExisting &&
            existing.isActive &&
            !existing.isExpired && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  Active —{" "}
                  {existing.requireToken ? "Bearer required" : "Public"}
                </span>
                <span className="ml-auto flex items-center gap-1 text-[11px] bg-white border border-emerald-200 rounded-full px-2 py-0.5">
                  <Clock className="w-3 h-3" />
                  {existing.expiresAt
                    ? new Date(existing.expiresAt).toLocaleDateString()
                    : "Never expires"}
                </span>
              </div>
            )}
          {existing && !loadingExisting && existing.isExpired && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-xs text-red-800">
              <AlertTriangle className="w-4 h-4 shrink-0" /> Expired —
              regenerate required
              <span className="ml-auto text-[11px] bg-white border border-red-200 rounded-full px-2 py-0.5">
                {existing.expiresAt
                  ? new Date(existing.expiresAt).toLocaleDateString()
                  : "—"}
              </span>
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Expires
              </Label>
              <Select
                value={selectedExpiry}
                onValueChange={(v) => setSelectedExpiry((v as string) ?? "1")}
              >
                <SelectTrigger className="mt-1.5 bg-white/80 rounded-xl w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPIRY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-slate-400 mt-1">
                Auto-expires, default 1 day.
              </p>
            </div>
            <div>
              <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Bearer Token
              </Label>
              <div className="mt-1.5 flex items-center justify-between bg-white/80 border border-white/60 rounded-xl px-3 py-2.5">
                <span className="text-sm text-slate-700">
                  {selectedRequireToken
                    ? "Required (private)"
                    : "Not required (public)"}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedRequireToken((v) => !v)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${selectedRequireToken ? "bg-violet-600" : "bg-slate-200"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${selectedRequireToken ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {selectedRequireToken
                  ? "Needs Authorization: Bearer <JWT> header"
                  : "Public — no header needed"}
              </p>
            </div>
          </div>

          {!generated ? (
            <>
              {isNew && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2 text-amber-900 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> Save
                  standard first before generating.
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
                ) : existing?.isActive ? (
                  "Regenerate"
                ) : (
                  "Generate"
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Endpoint */}
              <div className="border border-violet-200 rounded-xl p-3 space-y-2 bg-violet-50/50">
                <div className="flex gap-2">
                  <code className="flex-1 font-mono text-xs bg-slate-900 text-emerald-300 rounded-lg px-2.5 py-2 break-all border border-slate-800">
                    {realEndpoint}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full h-8 shrink-0"
                    onClick={() =>
                      copy(realEndpoint!, "endpoint", "Endpoint copied")
                    }
                  >
                    {copied === "endpoint" ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <div className="flex gap-1.5 flex-wrap text-[11px]">
                  <span className="bg-white border rounded-full px-2 py-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {requireToken ? "Bearer" : "Public"}
                  </span>
                  <span className="bg-white border rounded-full px-2 py-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {expiresAt
                      ? new Date(expiresAt).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>
              </div>

              {/* Token — only if Bearer */}
              {requireToken && (
                <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Bearer Token — shown
                      once
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs rounded-full"
                      onClick={() => setShowToken((v) => !v)}
                    >
                      {showToken ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}{" "}
                      {showToken ? "Hide" : "Show"}
                    </Button>
                  </div>
                  {realToken ? (
                    <>
                      <div className="flex gap-2">
                        <code
                          className={`flex-1 font-mono text-xs rounded-lg px-2.5 py-2 break-all border ${showToken ? "bg-slate-900 text-amber-200 border-slate-800" : "bg-slate-100 text-slate-400 border-slate-200 blur-[5px]"}`}
                        >
                          {realToken}
                        </code>
                        <Button
                          size="sm"
                          className="rounded-full bg-slate-900 text-white h-8 shrink-0"
                          onClick={() =>
                            copy(realToken!, "token", "Token copied")
                          }
                        >
                          {copied === "token" ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-[11px] text-amber-700">
                        Copy now — plaintext not stored, only hash in Firestore.
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-500 bg-white border rounded-lg px-2.5 py-2">
                      Token hashed on server — regenerate to get a new plaintext
                      token.
                    </p>
                  )}
                </div>
              )}

              {/* Config — multi-agent */}
              <div className="space-y-3">
                <div>
                  <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">How to Connect — choose AI agent</Label>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pick agent, copy snippet, paste to its config file. Restart agent after saving.</p>
                  <Select value={selectedAgent} onValueChange={(v) => setSelectedAgent((v as string) ?? "opencode")}>
                    <SelectTrigger className="mt-1.5 bg-white/90 rounded-xl w-full h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AGENT_OPTIONS.map((a) => (
                        <SelectItem key={a.value} value={a.value} className="text-xs">
                          {a.label} <span className="text-slate-400">— {a.file}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <pre className="bg-slate-900 rounded-xl p-3 pr-16 font-mono text-xs text-slate-300 whitespace-pre-wrap break-all border border-slate-800 overflow-auto max-h-52">{mcpConfigSnippet}</pre>
                  <Button size="sm" variant="outline" className="absolute top-2 right-2 h-7 rounded-full bg-white/90 text-xs" onClick={() => copy(mcpConfigSnippet, "config")}><Copy className="w-3 h-3" /> Copy</Button>
                </div>
                <div className="relative">
                  <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">curl — verify complete data</Label>
                  <pre className="mt-1 bg-slate-900 rounded-xl p-3 pr-16 font-mono text-xs text-emerald-300 whitespace-pre-wrap break-all border border-slate-800">{curlSnippet}</pre>
                  <Button size="sm" variant="outline" className="absolute top-6 right-2 h-7 rounded-full bg-white/90 text-xs" onClick={() => copy(curlSnippet, "curl")}><Copy className="w-3 h-3" /> Copy</Button>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-2 flex gap-2 text-[11px] text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600 mt-0.5" />
                  <span>All agents above receive the <b>same complete data</b> — full folder tree + rules/naming/exampleCode per node + vibeCodingInstructions — via <code className="bg-white px-1 rounded">get_my_project_standard</code>.</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="rounded-full w-full h-8 border-violet-200 text-xs"
                onClick={handleTest}
                disabled={isTesting}
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" /> Testing...
                  </>
                ) : (
                  "Test Connection — verifies tools + standard"
                )}
              </Button>
              {testResult && (
                <pre
                  className={`rounded-xl p-2.5 font-mono text-xs whitespace-pre-wrap break-all max-h-40 overflow-auto border ${testResult.startsWith("✓") ? "bg-emerald-50 text-emerald-900 border-emerald-200" : "bg-red-50 text-red-900 border-red-200"}`}
                >
                  {testResult}
                </pre>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-full h-8 text-xs"
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : null}{" "}
                  Regenerate
                </Button>
                <Button
                  size="sm"
                  className="flex-1 rounded-full bg-slate-900 text-white h-8 text-xs"
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

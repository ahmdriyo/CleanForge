"use client";

import { useState, useEffect } from "react";
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
  ExternalLink,
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
  const [selectedRequireToken, setSelectedRequireToken] =
    useState<boolean>(false);

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
  const previewJson = `{\n  "name": "${standardName}",\n  "tools": ["get_my_project_standard", "get_folder_rules", "scaffold_feature", "validate_structure"],\n  "framework": "nextjs",\n  "naming": "kebab-case"\n}`;

  const isNew = !standardId || standardId === "new";

  // Fetch existing MCP when modal opens
  useEffect(() => {
    if (!open || isNew) return;
    if (hasFetched) return;
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
    if (requireToken && !realToken && !existing?.hasToken) {
      // No token available but required — inform user
      // For public existing after reload, token is hidden; we can try without token and it will fail, but we should try backend via test? Instead do direct fetch with no token and show warning
      // We'll attempt fetch without token; server will return 401
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      if (requireToken && realToken)
        headers.Authorization = `Bearer ${realToken}`;
      // If requireToken true but realToken null (existing after reload), try without header — server will reject, which is expected
      const res = await fetch(realEndpoint, {
        method: "GET",
        headers,
      });
      const text = await res.text();
      if (!res.ok) {
        setTestResult(`✗ ${res.status} — ${text.slice(0, 400)}`);
        toast.error(`Test failed: ${res.status}`);
        return;
      }
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

  const currentEndpoint = realEndpoint || endpointPreview;
  const mcpConfigSnippet = requireToken
    ? `{\n  "mcpServers": {\n    "cleanforge": {\n      "url": "${currentEndpoint}",\n      "headers": {\n        "Authorization": "Bearer YOUR_TOKEN"\n      }\n    }\n  }\n}`
    : `{\n  "mcpServers": {\n    "cleanforge": {\n      "url": "${currentEndpoint}"\n    }\n  }\n}`;
  const curlSnippet = requireToken
    ? `curl -H "Authorization: Bearer ${realToken ? realToken.slice(0, 12) + "..." : "YOUR_TOKEN"}" \\\n  -H "Accept: text/event-stream" \\\n  ${currentEndpoint}`
    : `curl -H "Accept: text/event-stream" \\\n  ${currentEndpoint}`;

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
            Choose expiry & token protection.{" "}
            {requireToken ? (
              <>
                Bearer JWT — header{" "}
                <code className="bg-slate-900 text-emerald-300 px-1.5 py-0.5 rounded break-all">
                  Authorization: Bearer &lt;JWT&gt;
                </code>{" "}
                — token shown once.
              </>
            ) : (
              <>Public endpoint — no Authorization header required.</>
            )}
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

          {/* Active MCP banner if exists */}
          {loadingExisting && (
            <div className="bg-white/70 border border-white/60 rounded-xl p-3 flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-violet-600" />{" "}
              Checking existing MCP endpoint...
            </div>
          )}
          {existing && !loadingExisting && (
            <div
              className={`rounded-xl p-3 border flex gap-2.5 ${existing.isExpired ? "bg-red-50 border-red-200 text-red-800" : existing.isActive ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-slate-50 border-slate-200"}`}
            >
              {existing.isExpired ? (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              ) : (
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              )}
              <div className="text-xs leading-relaxed">
                {existing.isExpired ? (
                  <>
                    <span className="font-semibold">Endpoint expired</span> —
                    expires{" "}
                    {existing.expiresAt
                      ? new Date(existing.expiresAt).toLocaleDateString()
                      : "—"}
                    . Regenerate with new expiry.
                    <div className="mt-1.5 font-mono text-[11px] break-all bg-white/70 rounded px-2 py-1 border border-red-200">
                      {existing.endpointFull}
                    </div>
                  </>
                ) : existing.isActive ? (
                  <>
                    <span className="font-semibold">
                      Active MCP endpoint found
                    </span>{" "}
                    for this project.
                    <div className="mt-1.5 font-mono text-[11px] break-all bg-white/70 rounded px-2 py-1 border border-emerald-200">
                      {existing.endpointFull}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <span className="bg-white border border-emerald-200 rounded-full px-2 py-0.5 text-[11px]">
                        {existing.requireToken
                          ? "Bearer required"
                          : "Public (no token)"}
                      </span>
                      <span className="bg-white border border-slate-200 rounded-full px-2 py-0.5 text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {existing.expiresAt
                          ? `Expires ${new Date(existing.expiresAt).toLocaleDateString()}`
                          : "Never expires"}
                      </span>
                      <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5 text-[11px]">
                        Active
                      </span>
                    </div>
                    {!existing.hasToken && existing.requireToken && (
                      <p className="text-[11px] text-amber-700 mt-1">
                        Token is hashed on server — regenerate to get a new
                        plaintext token.
                      </p>
                    )}
                  </>
                ) : null}
              </div>
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
            </div>
            <div>
              <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Bearer Token
              </Label>
              <div className="mt-1.5 flex items-center justify-between bg-white/80 border border-white/60 rounded-xl px-3 py-2.5">
                <span className="text-sm text-slate-700">
                  {selectedRequireToken ? "Required" : "Not required"}
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
                  ? "Header Authorization required"
                  : "Public — anyone with link can call MCP"}
              </p>
            </div>
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
              {existing?.isActive && !existing.isExpired && (
                <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 text-xs text-violet-900">
                  Active endpoint is shown above. You can generate a new one
                  below — this will rotate expiry/token.
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
                  "Regenerate with new settings"
                ) : (
                  "Generate"
                )}
              </Button>
              <p className="text-[11px] text-center text-slate-400">
                Creates SHA-256 hash in <code>users/{"{uid}"}/standards</code> +
                denormalized <code>mcps</code> — default 1 day, no token.
              </p>
            </>
          ) : (
            <>
              {/* Endpoint */}
              <div className="bg-linear-to-br from-violet-50 to-white border border-violet-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-violet-600" />{" "}
                    Your MCP Endpoint (SSE)
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
                  <span
                    className={`${requireToken ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"} border rounded-full text-xs px-2.5 py-1 flex items-center gap-1`}
                  >
                    <ShieldCheck className="w-3 h-3" />{" "}
                    {requireToken ? "Bearer required" : "Public — no token"}
                  </span>
                  <span
                    className={`${existing?.isExpired ? "bg-red-50 text-red-700 border-red-200" : "bg-white text-slate-600 border-slate-200"} border rounded-full text-xs px-2.5 py-1 flex items-center gap-1`}
                  >
                    <Clock className="w-3 h-3" />{" "}
                    {expiresAt
                      ? `Expires ${new Date(expiresAt).toLocaleDateString()}`
                      : "Never expires"}
                  </span>
                  {existing?.isExpired ? (
                    <span className="bg-red-100 text-red-700 border border-red-200 rounded-full text-xs px-2.5 py-1">
                      Expired
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs px-2.5 py-1">
                      Active
                    </span>
                  )}
                </div>
              </div>

              {/* Token */}
              {requireToken ? (
                <div className="bg-white border border-amber-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-semibold uppercase tracking-widest text-amber-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Bearer Token —
                      shown once
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
                      )}{" "}
                      {showToken ? " Hide" : " Show"}
                    </Button>
                  </div>
                  {realToken ? (
                    <>
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
                            copy(
                              realToken!,
                              "token",
                              "Token copied — keep secret!",
                            )
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
                        ⚠️ Copy now — plaintext never stored. Only SHA-256 hash
                        is in Firestore. Regenerating revokes old token.
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                      Token hidden — this endpoint requires Bearer token but
                      plaintext is not retrievable. Regenerate to get a new
                      token.
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                  <div>
                    <span className="font-semibold">
                      Public endpoint — no token required.
                    </span>{" "}
                    Anyone with the URL can call tools/list & tools/call
                    (subject to expiry). Enable Bearer token for private access.
                  </div>
                </div>
              )}

              {/* How to Connect */}
              <div className="bg-white/90 border border-white/80 rounded-xl p-4 space-y-3 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">
                  How to Connect {requireToken ? "— Bearer Header" : "— Public"}
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
                            requireToken && realToken
                              ? `curl -H "Authorization: Bearer ${realToken}" -H "Accept: text/event-stream" ${realEndpoint}`
                              : `curl -H "Accept: text/event-stream" ${realEndpoint}`,
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
                      {requireToken ? (
                        <>
                          MCP uses{" "}
                          <code className="bg-slate-100 px-1 rounded">
                            Authorization: Bearer &lt;JWT&gt;
                          </code>
                          .
                        </>
                      ) : (
                        <>Public — no Authorization header needed.</>
                      )}
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

              {/* Options to regenerate with new settings */}
              <div className="bg-white/70 border border-white/60 rounded-xl p-3 space-y-3">
                <div className="text-xs font-semibold text-slate-700">
                  Regenerate with new settings
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                      Expires
                    </Label>
                    <Select
                      value={selectedExpiry}
                      onValueChange={(v) =>
                        setSelectedExpiry((v as string) ?? "1")
                      }
                    >
                      <SelectTrigger className="mt-1.5 bg-white/80 rounded-xl w-full h-9">
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
                  </div>
                  <div>
                    <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                      Bearer Token
                    </Label>
                    <div className="mt-1.5 flex items-center justify-between bg-white/80 border border-white/60 rounded-xl px-3 py-2 h-9">
                      <span className="text-xs text-slate-700">
                        {selectedRequireToken ? "Required" : "Not required"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedRequireToken((v) => !v)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${selectedRequireToken ? "bg-violet-600" : "bg-slate-200"}`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${selectedRequireToken ? "translate-x-5" : "translate-x-1"}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
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

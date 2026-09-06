"use client";

import { McpService } from "@/services/mcp.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  Plug,
  RefreshCw,
  ShieldCheck,
  Clock,
  FlaskConical,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const EXPIRY_OPTIONS = [
  { label: "1 day", value: "1" },
  { label: "7 days", value: "7" },
  { label: "30 days", value: "30" },
  { label: "90 days", value: "90" },
  { label: "1 year (365 days)", value: "365" },
  { label: "Never expires", value: "never" },
];

export const McpsListSection = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["mcps"],
    queryFn: async () => {
      const res = await McpService.getMcps();
      if (!res.success) throw new Error(res.message || "Failed to fetch MCPs");
      return res.data;
    },
  });
  const [copied, setCopied] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, string>>({});
  const [regenOpenId, setRegenOpenId] = useState<string | null>(null);
  const [regenExpiry, setRegenExpiry] = useState<string>("1");
  const [regenRequireToken, setRegenRequireToken] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [regenTokens, setRegenTokens] = useState<
    Record<
      string,
      {
        token: string | null;
        endpointFull: string;
        expiresAt: string | null;
        requireToken: boolean;
      }
    >
  >({});
  const [showRegenToken, setShowRegenToken] = useState<string | null>(null);

  const handleCopy = async (
    text: string,
    id: string,
    msg = "Copied endpoint to clipboard",
  ) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success(msg);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleTest = async (mcpId: string) => {
    setTestingId(mcpId);
    setTestResults((prev) => ({ ...prev, [mcpId]: "" }));
    try {
      const res = await McpService.testMcp(mcpId);
      if (!res.success) throw new Error(res.message || "Test failed");
      const pretty = JSON.stringify(res.data, null, 2).slice(0, 800);
      setTestResults((prev) => ({
        ...prev,
        [mcpId]: `✓ ${res.message || "Connection OK"}\n${pretty}`,
      }));
      toast.success("MCP test OK — tools verified");
      queryClient.invalidateQueries({ queryKey: ["mcps"] });
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === "object" && e !== null && "response" in e
            ? ((e as { response?: { data?: { message?: string } } }).response
                ?.data?.message ?? "Test failed")
            : "Test failed";
      // try to extract axios error msg
      const axiosMsg = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      const finalMsg = axiosMsg || msg;
      setTestResults((prev) => ({ ...prev, [mcpId]: `✗ ${finalMsg}` }));
      toast.error(finalMsg);
    } finally {
      setTestingId(null);
    }
  };

  const openRegen = (
    mcpId: string,
    current: { expiresAt?: string | null; requireToken?: boolean },
  ) => {
    // Infer expiry option from current expiresAt if possible; default 1
    let expiryVal = "1";
    if (current.expiresAt === null) expiryVal = "never";
    // else keep 1 as default; user can change
    setRegenExpiry(expiryVal);
    setRegenRequireToken(current.requireToken ?? false);
    setRegenOpenId(mcpId);
  };

  const handleRegenerate = async (mcpId: string) => {
    setRegenLoading(true);
    try {
      const expiresInDays =
        regenExpiry === "never" ? null : Number(regenExpiry);
      const res = await McpService.regenerateMcp(mcpId, {
        expiresInDays,
        requireToken: regenRequireToken,
      });
      if (!res.success) throw new Error(res.message || "Failed to regenerate");
      const data = res.data;
      setRegenTokens((prev) => ({
        ...prev,
        [mcpId]: {
          token: data.token,
          endpointFull: data.endpointFull,
          expiresAt: data.expiresAt,
          requireToken: data.requireToken,
        },
      }));
      setShowRegenToken(mcpId);
      toast.success(
        regenRequireToken
          ? "Token regenerated — old revoked"
          : "MCP regenerated (no token)",
      );
      queryClient.invalidateQueries({ queryKey: ["mcps"] });
    } catch (e: unknown) {
      const axiosMsg = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      const msg =
        axiosMsg || (e instanceof Error ? e.message : "Failed to regenerate");
      toast.error(msg);
    } finally {
      setRegenLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-[20px] p-8 text-center text-sm text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-violet-600" />{" "}
        Loading MCPs...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white/55 backdrop-blur-xl border border-dashed border-white/70 rounded-[24px] p-12 text-center">
        <p className="font-medium text-slate-900">
          No MCPs yet — Generate from Forge Studio
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Open a standard in Forge and click Generate MCP.
        </p>
        <Link
          href="/forge/new"
          className="inline-flex mt-4 rounded-full bg-violet-600 text-white px-6 py-2.5 text-sm font-medium"
        >
          Go to Forge
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((mcp) => {
        const isExpired = mcp.status === "expired";
        const isActive = mcp.status === "active" && !isExpired;
        return (
          <div
            key={mcp.id}
            className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-[20px] p-5 hover:bg-white/80 transition flex flex-col gap-3"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Plug className="w-4 h-4 text-violet-600" />
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {mcp.name}
                  </h3>
                  <Badge
                    className={`${isExpired ? "bg-red-50 text-red-700 border-red-200" : isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600"} rounded-full text-[11px]`}
                    variant="outline"
                  >
                    {mcp.status}
                  </Badge>
                  {mcp.requireToken ? (
                    <span className="text-[11px] bg-violet-50 text-violet-700 border border-violet-200 rounded-full px-2 py-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Bearer required
                    </span>
                  ) : (
                    <span className="text-[11px] bg-slate-50 text-slate-600 border border-slate-200 rounded-full px-2 py-0.5">
                      No token (public)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-2">
                  Standard: {mcp.standardName}
                </p>
                <code className="block font-mono text-xs bg-slate-900 text-emerald-300 rounded-lg px-3 py-2 break-all select-all border border-slate-800">
                  {mcp.endpoint}
                </code>
                {mcp.requireToken && (
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Use header{" "}
                    <code className="bg-slate-100 px-1 rounded">
                      Authorization: Bearer &lt;JWT&gt;
                    </code>
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500 items-center">
                  <span>Usage: {mcp.usageCount} calls</span>
                  <span className="text-slate-300">•</span>
                  <span>
                    Created {new Date(mcp.createdAt).toLocaleDateString()}
                  </span>
                  {mcp.expiresAt ? (
                    <>
                      <span className="text-slate-300">•</span>
                      <span
                        className={`flex items-center gap-1 ${isExpired ? "text-red-600 font-medium" : ""}`}
                      >
                        <Clock className="w-3 h-3" /> Expires{" "}
                        {new Date(mcp.expiresAt).toLocaleDateString()}
                        {isExpired && " (expired)"}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" /> Never expires
                      </span>
                    </>
                  )}
                  {mcp.lastUsedAt && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span>
                        Last used{" "}
                        {new Date(mcp.lastUsedAt).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
                {/* Show newly regenerated token if available */}
                {regenTokens[mcp.id] && (
                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-700 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> New Bearer Token
                        — shown once
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs rounded-full"
                        onClick={() =>
                          setShowRegenToken((v) =>
                            v === mcp.id ? null : mcp.id,
                          )
                        }
                      >
                        {showRegenToken === mcp.id ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                        {showRegenToken === mcp.id ? " Hide" : " Show"}
                      </Button>
                    </div>
                    {regenTokens[mcp.id].token ? (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <code
                          className={`flex-1 font-mono text-[11px] rounded-lg p-2.5 border break-all select-all ${showRegenToken === mcp.id ? "bg-slate-900 text-amber-200 border-slate-800" : "bg-slate-100 text-slate-400 border-slate-200 blur-[6px] select-none"}`}
                        >
                          {regenTokens[mcp.id].token}
                        </code>
                        <Button
                          size="sm"
                          className="rounded-full bg-slate-900 hover:bg-black text-white shrink-0"
                          onClick={() =>
                            handleCopy(
                              regenTokens[mcp.id].token!,
                              `${mcp.id}-token`,
                              "Token copied — keep secret!",
                            )
                          }
                        >
                          {copied === `${mcp.id}-token` ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}{" "}
                          Copy Token
                        </Button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-600">
                        No token — endpoint is public. Expires:{" "}
                        {regenTokens[mcp.id].expiresAt
                          ? new Date(
                              regenTokens[mcp.id].expiresAt!,
                            ).toLocaleDateString()
                          : "never"}
                      </p>
                    )}
                    <p className="text-[11px] text-amber-700">
                      New endpoint:{" "}
                      <code className="break-all">
                        {regenTokens[mcp.id].endpointFull}
                      </code>
                    </p>
                  </div>
                )}
                {testResults[mcp.id] && (
                  <pre
                    className={`mt-3 rounded-xl p-3 font-mono text-xs whitespace-pre-wrap break-all border max-h-40 overflow-y-auto ${testResults[mcp.id].startsWith("✓") ? "bg-emerald-50 text-emerald-900 border-emerald-200" : "bg-red-50 text-red-900 border-red-200"}`}
                  >
                    {testResults[mcp.id]}
                  </pre>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0 self-start">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-white/75 border-white/70"
                  onClick={() =>
                    handleCopy(mcp.endpoint, `${mcp.id}-ep`, "Endpoint copied")
                  }
                >
                  {copied === `${mcp.id}-ep` ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied === `${mcp.id}-ep` ? "Copied" : "Copy Link"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() =>
                    openRegen(mcp.id, {
                      expiresAt: mcp.expiresAt,
                      requireToken: mcp.requireToken,
                    })
                  }
                >
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-violet-600 hover:bg-violet-700 text-white border-violet-600"
                  onClick={() => handleTest(mcp.id)}
                  disabled={testingId === mcp.id}
                >
                  {testingId === mcp.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FlaskConical className="w-4 h-4" />
                  )}
                  {testingId === mcp.id ? "Testing..." : "Test"}
                </Button>
              </div>
            </div>

            {/* Regenerate Dialog */}
            <Dialog
              open={regenOpenId === mcp.id}
              onOpenChange={(o) => !o && setRegenOpenId(null)}
            >
              <DialogContent className="bg-white/95 backdrop-blur-2xl border border-white/80 rounded-[24px] w-[95vw] sm:max-w-lg p-5 sm:p-6 gap-4">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-[16px]">
                    <RefreshCw className="w-4 h-4 text-violet-600" /> Regenerate
                    MCP — {mcp.name}
                  </DialogTitle>
                  <p className="text-xs text-slate-500">
                    Regenerating revokes previous token. Current endpoint:{" "}
                    <code className="break-all bg-slate-100 px-1 rounded">
                      {mcp.endpoint}
                    </code>
                  </p>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                      Expires
                    </Label>
                    <Select
                      value={regenExpiry}
                      onValueChange={(v) =>
                        setRegenExpiry((v as string) ?? "1")
                      }
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
                      Default for new MCPs is 1 day. Choose expiry per your
                      security needs.
                    </p>
                  </div>

                  <div className="flex items-center justify-between bg-white/80 border border-white/60 rounded-xl p-3">
                    <div>
                      <div className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-violet-600" />{" "}
                        Require Bearer Token
                      </div>
                      <p className="text-[11px] text-slate-500">
                        If off, endpoint is public (no Authorization header).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRegenRequireToken((v) => !v)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${regenRequireToken ? "bg-violet-600" : "bg-slate-200"}`}
                      aria-pressed={regenRequireToken}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${regenRequireToken ? "translate-x-6" : "translate-x-1"}`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setRegenOpenId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-full bg-violet-600 hover:bg-violet-700 text-white"
                    onClick={() => handleRegenerate(mcp.id)}
                    disabled={regenLoading}
                  >
                    {regenLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    {regenLoading ? "Regenerating..." : "Regenerate"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      })}
    </div>
  );
};

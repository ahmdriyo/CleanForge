"use client";

import { useState } from "react";
import type { Standard, FolderNode } from "@/types/standard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Layers, Folder, FileCode, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { STANDARD_QUERY_KEYS } from "@/hooks/use-standards";
import { POPULAR_FRAMEWORKS } from "@/const/framework-templates";

const getStructurePreviewPaths = (
  rootNode?: FolderNode,
  maxPaths = 3,
): string[] => {
  if (!rootNode) return [];

  const paths: string[] = [];

  const traverse = (node: FolderNode, currentPath: string) => {
    if (paths.length >= maxPaths) return;
    const path = currentPath ? `${currentPath}/${node.name}` : node.name;

    if (!node.children || node.children.length === 0) {
      if (currentPath) {
        paths.push(path);
      }
      return;
    }

    for (const child of node.children) {
      if (paths.length >= maxPaths) break;
      if (!child.children || child.children.length === 0) {
        paths.push(`${path}/${child.name}`);
      } else {
        const grandChild = child.children[0];
        paths.push(`${path}/${child.name}/${grandChild.name}`);
      }
    }
  };

  traverse(rootNode, "");

  if (paths.length === 0 && rootNode.name) {
    paths.push(rootNode.name);
  }

  return Array.from(new Set(paths)).slice(0, maxPaths);
};

const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  if (!Number.isFinite(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDays = Math.floor(diffHour / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const StandardCard = ({ standard }: { standard: Standard }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const statusColor =
    standard.mcpStatus === "active"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : standard.mcpStatus === "draft"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-slate-100 text-slate-600 border-slate-200";

  const frameworkInfo = POPULAR_FRAMEWORKS.find(
    (f) =>
      f.id === standard.framework ||
      f.name.toLowerCase() === standard.framework?.toLowerCase(),
  );
  const displayName = frameworkInfo ? frameworkInfo.name : standard.framework;
  const structurePaths = getStructurePreviewPaths(standard.folderStructure);

  const handleOpenForge = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Preload current standard data into detail cache so Forge opens instantly with real name
      queryClient.setQueryData(STANDARD_QUERY_KEYS.detail(standard.id), {
        success: true,
        data: standard,
      });
      // Invalidate to guarantee TanStack Query hits the API for the latest server state
      queryClient.invalidateQueries({
        queryKey: STANDARD_QUERY_KEYS.detail(standard.id),
      });
      router.push(`/forge/${standard.id}`);
    } catch {
      router.push(`/forge/${standard.id}`);
    }
  };

  return (
    <div className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-[20px] p-5 hover:bg-white/85 hover:border-white/70 hover:shadow-[0_12px_40px_rgba(59,130,246,0.15)] transition-all duration-300 flex flex-col shadow-[0_8px_32px_rgba(59,130,246,0.08)]">
      <div className="flex items-center gap-2 mb-3">
        <Badge className="bg-slate-900 text-white rounded-full text-[11px] px-2.5 py-0.5 font-medium border-0">
          {displayName}
        </Badge>
        <Badge
          variant="outline"
          className={`${statusColor} rounded-full text-[11px] capitalize`}
        >
          {standard.mcpStatus}
        </Badge>
        <span className="ml-auto flex items-center gap-1.5 text-[11px] text-slate-400">
          <span
            className={`w-2 h-2 rounded-full ${standard.mcpStatus === "active" ? "bg-emerald-400 animate-pulse" : "bg-slate-300"}`}
          />
          MCP: {standard.mcpStatus}
        </span>
      </div>

      <h3 className="font-semibold tracking-tight text-slate-900 text-[15px] leading-tight mb-1">
        {standard.name}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3">
        {standard.description}
      </p>

      <div className="bg-white/70 backdrop-blur border border-white/60 rounded-xl p-3 mb-4">
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">
          <Layers className="w-3 h-3" /> Project Structure
        </div>
        <div className="space-y-1.5 font-mono text-xs text-slate-600">
          {structurePaths.length > 0 ? (
            structurePaths.map((p, idx) => (
              <div
                key={idx}
                className="truncate flex items-center gap-1.5"
                title={p}
              >
                {p.includes(".") ? (
                  <FileCode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : (
                  <Folder className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                )}
                <span className="truncate">{p}</span>
              </div>
            ))
          ) : (
            <div className="text-slate-400 italic text-[11px]">
              No folders defined yet
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" /> Updated{" "}
          {formatRelativeTime(standard.updatedAt)}
        </span>
        <Link href={`/forge/${standard.id}`} onClick={handleOpenForge}>
          <Button
            size="sm"
            disabled={isLoading}
            className="rounded-full bg-violet-600 hover:bg-violet-700 text-white text-xs px-4 h-8 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
            ) : null}
            {isLoading ? "Opening..." : "Open in Forge"}
          </Button>
        </Link>
      </div>
    </div>
  );
};

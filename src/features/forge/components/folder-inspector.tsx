"use client";

import { useEffect, useState } from "react";
import type { FolderNode } from "@/types/standard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Copy,
  Sparkles,
  Loader2,
  Trash2,
  RotateCcw,
  Check,
} from "lucide-react";

export const FolderInspector = ({
  node,
  onUpdateNode,
  onDeleteNode,
  isSaving = false,
}: {
  node: FolderNode | null;
  onUpdateNode?: (node: FolderNode) => void;
  onDeleteNode?: (nodeId: string) => void;
  isSaving?: boolean;
}) => {
  const [name, setName] = useState(node?.name || "");
  const [rules, setRules] = useState(node?.rules || "");
  const [naming, setNaming] = useState<string>(node?.naming || "kebab-case");
  const [exampleCode, setExampleCode] = useState(node?.exampleCode || "");
  const [description, setDescription] = useState(node?.description || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (node) {
      setName(node.name || "");
      setRules(node.rules || "");
      setNaming(node.naming || "kebab-case");
      setExampleCode(node.exampleCode || "");
      setDescription(node.description || "");
    }
  }, [node]);

  if (!node) {
    return (
      <div className="bg-white/65 backdrop-blur-xl border border-white/60 rounded-[20px] p-4 h-full flex flex-col items-center justify-center text-center">
        <p className="text-sm font-medium text-slate-600">No folder selected</p>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Select a folder or file from the Project Structure panel to inspect
          and customize its architecture rules.
        </p>
      </div>
    );
  }

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!/^[a-z0-9-.]+$/.test(name.trim())) {
      toast.error(
        "Use kebab-case for folder or file name (e.g., auth-form.tsx)",
      );
      return;
    }
    const updated: FolderNode = {
      ...node,
      name: name.trim(),
      rules,
      naming:
        (naming as "kebab-case" | "PascalCase" | "camelCase") || "kebab-case",
      exampleCode,
      description,
    };
    onUpdateNode?.(updated);
    toast.success(`Saved rules for ${name.trim()}`);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { StandardService } = await import("@/services/standard.service");
      const res = await StandardService.generateExample({
        folderPath: name || node.name,
        rules,
        naming,
      });
      if (res.success && res.data?.code) {
        setExampleCode(res.data.code);
        toast.success("Example code generated with Gemini!");
        return;
      }
      throw new Error(res.message || "Failed to generate code");
    } catch {
      // Local clean fallback template
      const cleanName = (name || node.name).replace(/\.[^/.]+$/, "");
      const cleanIdentifier = cleanName.replace(/[^a-zA-Z0-9]/g, "");
      const pascal =
        cleanIdentifier.charAt(0).toUpperCase() + cleanIdentifier.slice(1);

      let fallback = `// ${name || node.name}\n`;
      if (
        (name || node.name).includes("hook") ||
        (name || node.name).startsWith("use-")
      ) {
        fallback += `import { useQuery } from "@tanstack/react-query";\n\nexport const use${pascal} = () => {\n  return useQuery({\n    queryKey: ["${cleanName}"],\n    queryFn: async () => {\n      // Rule: ${rules || "Keep logic clean and decoupled"}\n      return { status: "ready" };\n    },\n  });\n};`;
      } else if ((name || node.name).includes("schema")) {
        fallback += `import { z } from "zod";\n\nexport const ${cleanName.replace(/-/g, "_")}Schema = z.object({\n  id: z.string().min(1),\n  name: z.string().min(1),\n});\n\nexport type ${pascal} = z.infer<typeof ${cleanName.replace(/-/g, "_")}Schema>;`;
      } else {
        fallback += `import React from "react";\n\ninterface ${pascal}Props {\n  className?: string;\n}\n\nexport const ${pascal} = ({ className }: ${pascal}Props) => {\n  // Naming: ${naming}\n  // Rules: ${rules || "Feature-based clean UI"}\n  return (\n    <div className="p-4 rounded-xl border border-slate-200 bg-white/80 backdrop-blur">\n      <h4 className="text-sm font-semibold text-slate-800">${name || node.name}</h4>\n      <p className="text-xs text-slate-500 mt-1">Clean architecture standard component</p>\n    </div>\n  );\n};`;
      }
      setExampleCode(fallback);
      toast.success("Generated template code!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!exampleCode) return;
    navigator.clipboard.writeText(exampleCode);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setName(node.name || "");
    setRules(node.rules || "");
    setNaming(node.naming || "kebab-case");
    setExampleCode(node.exampleCode || "");
    setDescription(node.description || "");
    toast.info("Reset to original values");
  };

  const handleDelete = () => {
    if (node.id === "root") {
      toast.error("Cannot delete root folder");
      return;
    }
    if (confirm(`Are you sure you want to delete ${node.name}?`)) {
      onDeleteNode?.(node.id);
      toast.success(`Deleted ${node.name}`);
    }
  };

  return (
    <div className="bg-white/65 backdrop-blur-xl border border-white/60 rounded-[20px] p-4 h-full overflow-y-auto overflow-x-hidden space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/70">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Inspector</h3>
          <p className="text-[11px] text-slate-400">
            Configure rules for this {node.type}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono text-slate-600 bg-white/75 rounded-full px-2.5 py-0.5 border border-white/70 truncate max-w-[140px]">
            {node.name}
          </span>
          {node.id !== "root" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
              title="Delete node"
              onClick={handleDelete}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Name (kebab-case)
        </Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. auth-form or use-user"
          disabled={node.id === "root"}
          className="bg-white/80 rounded-xl text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Rules
        </Label>
        <Textarea
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          placeholder="e.g., Each feature in its own folder. No cross-feature imports."
          className="bg-white/80 backdrop-blur border-white/70 rounded-xl min-h-[70px] text-xs focus-visible:ring-violet-500"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Naming Convention
        </Label>
        <div className="flex gap-2">
          <Input
            value={naming}
            onChange={(e) => setNaming(e.target.value)}
            className="bg-white/80 rounded-xl text-xs"
            placeholder="kebab-case"
          />
          <span className="bg-violet-100 text-violet-700 rounded-full text-xs px-3 py-1.5 border border-violet-200 shrink-0 self-center">
            {naming || "kebab-case"}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Example Code
          </Label>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs px-2 rounded-full"
              onClick={handleCopy}
              disabled={!exampleCode}
            >
              {copied ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              size="sm"
              className="h-6 text-xs px-2.5 rounded-full bg-violet-100 text-violet-700 hover:bg-violet-200 border border-violet-200"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              {isGenerating ? "Generating..." : "Generate with Gemini"}
            </Button>
          </div>
        </div>
        <pre className="bg-slate-900 rounded-xl p-3 text-xs font-mono text-violet-100 overflow-y-auto overflow-x-hidden max-h-44 whitespace-pre-wrap break-all border border-slate-800 select-all">
          {exampleCode ||
            "// No example yet. Click 'Generate with Gemini' to create boilerplate."}
        </pre>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Description
        </Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description of this directory or file"
          className="bg-white/80 rounded-xl text-xs"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-xs h-9"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          Save Inspector
        </Button>
        <Button
          variant="outline"
          className="rounded-full bg-white/75 border-white/70 text-xs h-9 px-3"
          onClick={handleReset}
        >
          <RotateCcw className="w-3 h-3 mr-1" /> Reset
        </Button>
      </div>
    </div>
  );
};

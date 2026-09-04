"use client";

import { useState } from "react";
import type { FolderNode } from "@/types/standard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Sync state during render when node prop changes without effect cascade
  const [prevNode, setPrevNode] = useState(node);
  if (node !== prevNode) {
    setPrevNode(node);
    if (node) {
      setName(node.name || "");
      setRules(node.rules || "");
      setNaming(node.naming || "kebab-case");
      setExampleCode(node.exampleCode || "");
      setDescription(node.description || "");
    }
  }

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

  const handleDeleteClick = () => {
    if (node.id === "root") {
      toast.error("Cannot delete root folder");
      return;
    }
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setDeleteConfirmOpen(false);
    onDeleteNode?.(node.id);
    toast.success(`Deleted ${node.name}`);
  };

  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      setExampleCode(newValue);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
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
          <span className="text-xs font-mono text-slate-600 bg-white/75 rounded-full px-2.5 py-0.5 border border-white/70 truncate max-w-35">
            {node.name}
          </span>
          {node.id !== "root" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full cursor-pointer"
              title="Delete node"
              onClick={handleDeleteClick}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Custom Confirmation Modal for Deleting Node */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-2xl border-white/80 rounded-2xl w-[92vw] sm:max-w-md p-5">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-slate-900">
              Delete {node.type === "folder" ? "Folder" : "File"}?
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-slate-500 leading-relaxed mt-1">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-800">
              &quot;{node.name}&quot;
            </span>
            ? This will remove it and any nested contents from your project
            structure.
          </p>
          <div className="flex gap-2 justify-end mt-4">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs h-8"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="rounded-full bg-red-600 hover:bg-red-700 text-white text-xs h-8"
              onClick={handleConfirmDelete}
            >
              Confirm Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
          className="bg-white/80 backdrop-blur border-white/70 rounded-xl min-h-17.5 text-xs focus-visible:ring-violet-500"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Example Code
            </Label>
            <span className="text-[10px] text-slate-400 font-mono bg-white/70 px-1.5 py-0.5 rounded border border-white/60">
              editable
            </span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs px-2 rounded-full cursor-pointer"
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
              className="h-6 text-xs px-2.5 rounded-full bg-violet-100 text-violet-700 hover:bg-violet-200 border border-violet-200 cursor-pointer"
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
        <Textarea
          value={exampleCode}
          onChange={(e) => setExampleCode(e.target.value)}
          onKeyDown={handleCodeKeyDown}
          placeholder="// Type your code here manually or click 'Generate with Gemini' to create boilerplate..."
          rows={7}
          spellCheck={false}
          className="bg-slate-900 rounded-xl p-3 text-xs font-mono text-violet-100 border border-slate-800 placeholder:text-slate-500 min-h-36 max-h-60 custom-scrollbar resize-y focus-visible:ring-1 focus-visible:ring-violet-400 leading-relaxed"
        />
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

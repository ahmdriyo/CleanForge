"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GenerateMcpSection } from "./generate-mcp-section";
import { Loader2, Save, Trash2, ChevronDown, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { POPULAR_FRAMEWORKS, type FrameworkOption } from "@/const/framework-templates";

export const ForgeHeaderSection = ({
  standardName,
  standardId,
  framework = "nextjs",
  onSave,
  onDelete,
  onSelectFramework,
  isSaving = false,
  isDeleting = false,
  lastSaved,
}: {
  standardName: string;
  standardId: string;
  framework?: string;
  onSave?: (name: string, framework: string) => void;
  onDelete?: () => void;
  onSelectFramework?: (option: FrameworkOption, customName?: string) => void;
  isSaving?: boolean;
  isDeleting?: boolean;
  lastSaved?: string | null;
}) => {
  const [name, setName] = useState(standardName);
  const [currentFramework, setCurrentFramework] = useState(framework);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customNameInput, setCustomNameInput] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    setName(standardName);
  }, [standardName]);

  useEffect(() => {
    setCurrentFramework(framework);
  }, [framework]);

  const isNew = !standardId || standardId === "new";

  const handleFrameworkChange = (val: string | null) => {
    if (!val) return;
    if (val === "custom") {
      setCustomModalOpen(true);
      return;
    }
    const target = POPULAR_FRAMEWORKS.find((f) => f.id === val);
    if (target) {
      setCurrentFramework(target.id);
      onSelectFramework?.(target);
    }
  };

  const handleCustomSubmit = () => {
    const trimmed = customNameInput.trim();
    if (!trimmed) return;
    const customOption = POPULAR_FRAMEWORKS.find((f) => f.id === "custom")!;
    setCurrentFramework(trimmed);
    onSelectFramework?.(customOption, trimmed);
    setCustomModalOpen(false);
    setCustomNameInput("");
  };

  const activeFrameworkName =
    POPULAR_FRAMEWORKS.find((f) => f.id === currentFramework)?.name || currentFramework;

  return (
    <div className="bg-white/65 backdrop-blur-xl border border-white/60 rounded-2xl px-4 py-2.5 flex flex-col lg:flex-row gap-3 lg:items-center justify-between mb-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white/80 border-white/70 rounded-full font-medium w-full sm:max-w-70 h-8 text-sm focus-visible:ring-violet-500"
          placeholder="Standard Name..."
        />

        {/* Framework Selector Dropdown */}
        <div className="flex items-center gap-1.5">
          <Select
            value={
              POPULAR_FRAMEWORKS.some((f) => f.id === currentFramework)
                ? currentFramework
                : "custom"
            }
            onValueChange={handleFrameworkChange}
          >
            <SelectTrigger className="h-8 bg-white/85 border-white/70 rounded-full text-xs font-medium px-3 gap-1.5 text-slate-800 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-violet-600 inline-block mr-1" />
              <SelectValue>{activeFrameworkName}</SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-72 w-56 bg-white/95 backdrop-blur-xl border-white/70 rounded-2xl shadow-xl">
              <div className="px-2 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Popular Frameworks (10)
              </div>
              {POPULAR_FRAMEWORKS.filter((f) => f.id !== "custom").map((f) => (
                <SelectItem key={f.id} value={f.id} className="text-xs rounded-lg py-2">
                  <div className="flex flex-col text-left">
                    <span className="font-medium text-slate-800">{f.name}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{f.category}</span>
                  </div>
                </SelectItem>
              ))}
              <div className="border-t border-slate-100 my-1" />
              <SelectItem value="custom" className="text-xs rounded-lg py-2 text-violet-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Start from 0 (Custom Tool)
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {lastSaved ? (
          <span className="text-xs text-slate-400 hidden xl:inline">Saved {lastSaved}</span>
        ) : (
          <span className="text-xs text-amber-600 hidden xl:inline font-medium">Draft</span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        {/* Delete Forge Button (only when standard already exists, not for 'new') */}
        {!isNew && (
          <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isDeleting}
                  className="rounded-full bg-white/75 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs h-8 px-3"
                >
                  {isDeleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                  )}
                  Delete Forge
                </Button>
              }
            />
            <DialogContent className="bg-white/95 backdrop-blur-2xl border-white/80 rounded-2xl w-[92vw] sm:max-w-md p-5">
              <DialogHeader>
                <DialogTitle className="text-base font-semibold text-slate-900">
                  Delete Standard Forge?
                </DialogTitle>
              </DialogHeader>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-slate-800">&quot;{name}&quot;</span>? This will permanently delete its architecture tree, journal history, and revoke any generated MCP tokens.
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
                  disabled={isDeleting}
                  className="rounded-full bg-red-600 hover:bg-red-700 text-white text-xs h-8"
                  onClick={() => {
                    setDeleteConfirmOpen(false);
                    onDelete?.();
                  }}
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Save Button */}
        <Button
          variant="outline"
          size="sm"
          disabled={isSaving}
          onClick={() => onSave?.(name, currentFramework)}
          className="rounded-full bg-white/75 border-white/70 text-xs h-8 px-3.5 hover:bg-violet-50 hover:text-violet-700"
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
          ) : (
            <Save className="w-3.5 h-3.5 mr-1.5" />
          )}
          {isSaving ? "Saving..." : "Save Standard"}
        </Button>

        {/* Generate MCP dialog */}
        <GenerateMcpSection standardName={name} standardId={standardId} />
      </div>

      {/* Modal for Custom Framework (from zero) */}
      <Dialog open={customModalOpen} onOpenChange={setCustomModalOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-2xl border-white/80 rounded-2xl w-[92vw] sm:max-w-md p-5">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-slate-900">
              Start from Zero (Custom Framework/Tool)
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3.5 mt-2">
            <div>
              <Label className="text-xs font-semibold text-slate-600">
                Framework or Tool Name
              </Label>
              <Input
                placeholder="e.g. SvelteKit, Rust Actix, Spring Boot, etc."
                value={customNameInput}
                onChange={(e) => setCustomNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
                className="bg-white/80 rounded-xl mt-1 text-sm"
                autoFocus
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Creates an empty blank project root where you can freely structure folders and rules from scratch.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs h-8"
                onClick={() => setCustomModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!customNameInput.trim()}
                className="rounded-full bg-violet-600 hover:bg-violet-700 text-white text-xs h-8"
                onClick={handleCustomSubmit}
              >
                Initialize Blank Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

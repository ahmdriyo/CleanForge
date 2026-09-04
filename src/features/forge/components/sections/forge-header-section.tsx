"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GenerateMcpSection } from "./generate-mcp-section";
import { Loader2, Save, Trash2, Plus } from "lucide-react";
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
import {
  POPULAR_FRAMEWORKS,
  type FrameworkOption,
} from "@/const/framework-templates";

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

  // Sync state during render when props change without effect cascade
  const [prevProps, setPrevProps] = useState({ standardName, framework });
  if (
    prevProps.standardName !== standardName ||
    prevProps.framework !== framework
  ) {
    setPrevProps({ standardName, framework });
    setName(standardName);
    setCurrentFramework(framework);
  }

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
    POPULAR_FRAMEWORKS.find((f) => f.id === currentFramework)?.name ||
    currentFramework;

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
            <SelectTrigger className="h-9 bg-white/90 hover:bg-white border-white/80 rounded-full text-sm font-medium px-3.5 py-2 gap-2 text-slate-800 shadow-xs cursor-pointer">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-600 inline-block mr-0.5" />
              <SelectValue>{activeFrameworkName}</SelectValue>
            </SelectTrigger>
            <SelectContent
              side="bottom"
              sideOffset={6}
              align="start"
              alignItemWithTrigger={false}
              className="max-h-80 w-92 p-2 bg-white/95 backdrop-blur-2xl border border-white/80 rounded-2xl shadow-2xl z-50"
            >
              <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Popular Frameworks (10)
              </div>
              {POPULAR_FRAMEWORKS.filter((f) => f.id !== "custom").map((f) => (
                <SelectItem
                  key={f.id}
                  value={f.id}
                  className="text-sm rounded-xl py-2.5 px-3 hover:bg-violet-50/80 cursor-pointer"
                >
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-slate-900 text-sm">
                      {f.name}
                    </span>
                    <span className="text-xs text-slate-500 capitalize mt-0.5">
                      {f.category} • {f.description.slice(0, 32)}...
                    </span>
                  </div>
                </SelectItem>
              ))}
              <div className="border-t border-slate-100 my-1.5" />
              <SelectItem
                value="custom"
                className="text-sm rounded-xl py-2.5 px-3 text-violet-700 font-semibold hover:bg-violet-50 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Start from 0 (Custom Tool)
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {lastSaved ? (
          <span className="text-xs text-slate-400 hidden xl:inline">
            Saved {lastSaved}
          </span>
        ) : (
          <span className="text-xs text-amber-600 hidden xl:inline font-medium">
            Draft
          </span>
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
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-800">
                  &quot;{name}&quot;
                </span>
                ? This will permanently delete its architecture tree, journal
                history, and revoke any generated MCP tokens.
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
                Creates an empty blank project root where you can freely
                structure folders and rules from scratch.
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

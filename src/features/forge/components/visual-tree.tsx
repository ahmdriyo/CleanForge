"use client";

import { useEffect, useState } from "react";
import type { FolderNode } from "@/types/standard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Folder, File, Plus, GripVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { STANDARD_QUERY_KEYS } from "@/hooks/use-standards";

// Helper: deep clone tree
const cloneTree = (node: FolderNode): FolderNode => ({
  ...node,
  children: node.children ? node.children.map(cloneTree) : undefined,
});

// Helper: find and remove node by id, return removed node and new tree
const removeNode = (
  root: FolderNode,
  id: string,
): { newTree: FolderNode; removed: FolderNode | null } => {
  const newRoot = cloneTree(root);
  let removed: FolderNode | null = null;

  const dfs = (node: FolderNode): boolean => {
    if (!node.children) return false;
    const idx = node.children.findIndex((c) => c.id === id);
    if (idx !== -1) {
      removed = node.children[idx];
      node.children.splice(idx, 1);
      return true;
    }
    for (const child of node.children) {
      if (dfs(child)) return true;
    }
    return false;
  };

  // Don't allow removing root
  if (newRoot.id === id) return { newTree: newRoot, removed: null };
  dfs(newRoot);
  return { newTree: newRoot, removed };
};

// Helper: insert node into target folder
const insertNode = (
  root: FolderNode,
  targetId: string,
  nodeToInsert: FolderNode,
): FolderNode => {
  const newRoot = cloneTree(root);
  const dfs = (node: FolderNode): boolean => {
    if (node.id === targetId) {
      if (node.type !== "folder") return false;
      node.children = [...(node.children || []), nodeToInsert];
      return true;
    }
    if (node.children) {
      for (const child of node.children) {
        if (dfs(child)) return true;
      }
    }
    return false;
  };
  dfs(newRoot);
  return newRoot;
};

// Helper: check if target is descendant of source (prevent circular)
const isDescendant = (
  root: FolderNode,
  sourceId: string,
  targetId: string,
): boolean => {
  const find = (node: FolderNode, id: string): FolderNode | null => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = find(child, id);
        if (found) return found;
      }
    }
    return null;
  };
  const source = find(root, sourceId);
  if (!source) return false;
  return !!find(source, targetId);
};

const TreeNode = ({
  node,
  depth,
  selectedId,
  onSelect,
  onDrop,
  onDelete,
  draggedId,
}: {
  node: FolderNode;
  depth: number;
  selectedId: string | null;
  onSelect: (n: FolderNode) => void;
  onDrop: (draggedId: string, targetId: string) => void;
  onDelete: (id: string) => void;
  draggedId: string | null;
}) => {
  const isFolder = node.type === "folder";
  const isSelected = selectedId === node.id;
  const isDraggedOver = draggedId === node.id;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", node.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isFolder) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isFolder) return;
    e.preventDefault();
    e.stopPropagation();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId && draggedId !== node.id) {
      onDrop(draggedId, node.id);
    }
  };

  return (
    <div>
      <div
        draggable={node.id !== "root"}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => onSelect(node)}
        className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-full cursor-pointer text-sm transition select-none ${
          isSelected
            ? "bg-violet-100 text-violet-900 border border-violet-200/50"
            : isDraggedOver
              ? "bg-violet-50 border border-violet-300"
              : "hover:bg-white/65 text-slate-700"
        } ${node.id !== "root" ? "cursor-grab active:cursor-grabbing" : ""}`}
        style={{ marginLeft: depth * 12 }}
      >
        {node.id !== "root" && (
          <GripVertical className="w-3 h-3 text-slate-400 shrink-0" />
        )}
        {isFolder ? (
          <Folder className="w-4 h-4 text-violet-600 shrink-0" />
        ) : (
          <File className="w-4 h-4 text-slate-400 shrink-0" />
        )}
        <span className="font-mono text-xs truncate flex-1">{node.name}</span>
        {isFolder && node.children && (
          <span className="text-[10px] text-slate-400 mr-1">
            {node.children.length}
          </span>
        )}
        {node.id !== "root" && (
          <button
            type="button"
            className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 text-slate-400 transition rounded-full"
            title={`Delete ${node.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
      {isFolder && node.children && (
        <div className="ml-2 border-l border-white/70">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onDrop={onDrop}
              onDelete={onDelete}
              draggedId={draggedId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const VisualTree = ({
  selectedId,
  onSelect,
  folderTree,
  onTreeChange,
  standardId,
}: {
  selectedId: string | null;
  onSelect: (n: FolderNode) => void;
  folderTree?: FolderNode | null;
  onTreeChange?: (tree: FolderNode) => void;
  standardId?: string;
}) => {
  const queryClient = useQueryClient();
  const [localTree, setLocalTree] = useState<FolderNode | null>(
    folderTree || null,
  );
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"folder" | "file">("folder");
  const [open, setOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    setLocalTree(folderTree || null);
  }, [folderTree]);

  const persistTree = async (newTree: FolderNode) => {
    setLocalTree(newTree);
    onTreeChange?.(newTree);

    if (!standardId || standardId === "new") {
      toast.success(
        "Updated locally — click Save Standard in header to persist",
      );
      return;
    }
    try {
      const { StandardService } = await import("@/services/standard.service");
      await StandardService.patchStandardById(standardId, {
        folderStructure: newTree,
      } as unknown as Partial<import("@/types/standard").Standard>);
      queryClient.invalidateQueries({ queryKey: STANDARD_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: STANDARD_QUERY_KEYS.detail(standardId),
      });
    } catch {
      toast.error("Failed to save changes to server");
    }
  };

  const handleAdd = async () => {
    if (!newName.trim() || !/^[a-z0-9-.]+$/.test(newName.trim())) {
      toast.error("Use kebab-case (e.g. contoh-file or auth-form.tsx)");
      return;
    }
    if (!localTree) {
      toast.error("No tree available");
      return;
    }

    const newNode: FolderNode = {
      id: `node-${Date.now()}`,
      name: newName.trim(),
      type: newType,
      rules:
        newType === "folder"
          ? "Rules for folder — edit in inspector"
          : "File rules — edit in inspector",
      naming: "kebab-case",
      children: newType === "folder" ? [] : undefined,
    };

    let targetId = localTree.id;
    if (selectedId) {
      const find = (node: FolderNode, id: string): FolderNode | null => {
        if (node.id === id) return node;
        if (node.children) {
          for (const child of node.children) {
            const found = find(child, id);
            if (found) return found;
          }
        }
        return null;
      };
      const selectedNode = find(localTree, selectedId);
      if (selectedNode && selectedNode.type === "folder") {
        targetId = selectedNode.id;
      }
    }

    const updatedTree = insertNode(localTree, targetId, newNode);
    await persistTree(updatedTree);
    toast.success(`Added ${newType} "${newName.trim()}"`);
    setOpen(false);
    setNewName("");
    setNewType("folder");
  };

  const handleDelete = async (nodeId: string) => {
    if (!localTree) return;
    if (nodeId === localTree.id || nodeId === "root") {
      toast.error("Cannot delete root folder");
      return;
    }
    const { newTree, removed } = removeNode(localTree, nodeId);
    if (!removed) return;
    await persistTree(newTree);
    toast.success(`Deleted ${removed.name}`);
  };

  const handleDrop = async (draggedId: string, targetId: string) => {
    if (!localTree) return;
    if (draggedId === targetId) return;
    if (isDescendant(localTree, draggedId, targetId)) {
      toast.error("Cannot move folder into its own descendant");
      return;
    }

    const { newTree, removed } = removeNode(localTree, draggedId);
    if (!removed) {
      toast.error("Failed to move — item not found");
      return;
    }

    const updatedTree = insertNode(newTree, targetId, removed);
    await persistTree(updatedTree);
    toast.success(`Moved ${removed.name}`);
  };

  const handleDragOverRoot = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropRoot = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (!draggedId || !localTree) return;
    if (draggedId === localTree.id) return;
    const { newTree, removed } = removeNode(localTree, draggedId);
    if (!removed) return;
    const updatedTree = insertNode(newTree, localTree.id, removed);
    persistTree(updatedTree);
    toast.success(`Moved ${removed.name} to root`);
  };

  if (!localTree) {
    return (
      <div className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-[20px] p-4 h-full flex items-center justify-center">
        <p className="text-sm text-slate-400">Loading structure...</p>
      </div>
    );
  }

  return (
    <div
      className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-[20px] p-4 h-full overflow-y-auto overflow-x-hidden flex flex-col custom-scrollbar"
      onDragOver={handleDragOverRoot}
      onDrop={handleDropRoot}
      onDragEnter={() => setDraggedId(null)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-900 text-sm">
            Project Structure
          </h3>
          <span className="bg-slate-100 text-slate-600 rounded-full text-[11px] px-2 py-0.5 font-medium border">
            kebab-case
          </span>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="rounded-full bg-white/65 border-white/70 text-xs h-7"
              >
                <Plus className="w-3 h-3 mr-1" /> Add Node
              </Button>
            }
          />
          <DialogContent className="bg-white/95 backdrop-blur-2xl border border-white/80 rounded-[24px] w-[95vw] sm:max-w-md p-5 sm:p-6 overflow-x-hidden gap-4">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">
                Add Folder or File
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-semibold text-slate-600">
                  Type
                </Label>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  <Button
                    type="button"
                    variant={newType === "folder" ? "default" : "outline"}
                    className={`rounded-xl text-xs h-9 ${newType === "folder" ? "bg-violet-600 text-white" : "bg-white/80"}`}
                    onClick={() => setNewType("folder")}
                  >
                    <Folder className="w-3.5 h-3.5 mr-1.5" /> Folder
                  </Button>
                  <Button
                    type="button"
                    variant={newType === "file" ? "default" : "outline"}
                    className={`rounded-xl text-xs h-9 ${newType === "file" ? "bg-violet-600 text-white" : "bg-white/80"}`}
                    onClick={() => setNewType("file")}
                  >
                    <File className="w-3.5 h-3.5 mr-1.5" /> File
                  </Button>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="node-name"
                  className="text-xs font-semibold text-slate-600"
                >
                  Name (kebab-case)
                </Label>
                <Input
                  id="node-name"
                  placeholder={
                    newType === "folder"
                      ? "e.g. payment-gateway"
                      : "e.g. order-form.tsx"
                  }
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-white/80 rounded-xl mt-1 text-sm"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Must use kebab-case. Files may include extensions.
                </p>
                {selectedId && (
                  <p className="text-[11px] text-violet-600 mt-1">
                    Will be added inside currently selected folder.
                  </p>
                )}
              </div>

              <Button
                onClick={handleAdd}
                className="w-full rounded-full bg-violet-600 hover:bg-violet-700 text-white h-9 text-xs"
              >
                Add {newType === "folder" ? "Folder" : "File"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div
        className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
        onDragOver={(e) => setDraggedId(null)}
      >
        <TreeNode
          node={localTree}
          depth={0}
          selectedId={selectedId}
          onSelect={onSelect}
          onDrop={handleDrop}
          onDelete={handleDelete}
          draggedId={draggedId}
        />
      </div>

      <div className="mt-4 p-3 bg-white/65 rounded-xl border border-white/70 shrink-0">
        <p className="text-xs text-slate-500">
          Drag folders to reorder. Click a node to view or edit rules in the
          Inspector.
        </p>
      </div>
    </div>
  );
};

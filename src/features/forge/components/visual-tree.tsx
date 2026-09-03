"use client";

import { useState } from "react";
import type { FolderNode } from "@/types/standard";
import { dummyFolderTree } from "@/data-dummy/forge-dummy";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Folder, File, Plus } from "lucide-react";
import { toast } from "sonner";

const TreeNode = ({
  node,
  depth,
  selectedId,
  onSelect,
}: {
  node: FolderNode;
  depth: number;
  selectedId: string | null;
  onSelect: (n: FolderNode) => void;
}) => {
  const isFolder = node.type === "folder";
  const isSelected = selectedId === node.id;
  return (
    <div>
      <div
        onClick={() => onSelect(node)}
        className={`flex items-center gap-2 px-2 py-1.5 rounded-full cursor-pointer text-sm transition ${isSelected ? "bg-violet-100 text-violet-900 border border-violet-200/50" : "hover:bg-white/65 text-slate-700"}`}
        style={{ marginLeft: depth * 12 }}
      >
        {isFolder ? <Folder className="w-4 h-4 text-violet-600 shrink-0" /> : <File className="w-4 h-4 text-slate-400 shrink-0" />}
        <span className="font-mono text-xs truncate">{node.name}</span>
        {isFolder && node.children && <span className="ml-auto text-[10px] text-slate-400">{node.children.length}</span>}
      </div>
      {isFolder && node.children && (
        <div className="ml-2 border-l border-white/70">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export const VisualTree = ({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (n: FolderNode) => void;
}) => {
  const [tree] = useState<FolderNode>(dummyFolderTree);
  const [newName, setNewName] = useState("");
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    if (!newName || !/^[a-z0-9-.]+$/.test(newName)) {
      toast.error("Use kebab-case (e.g., contoh-file)");
      return;
    }
    toast.success(`Added ${newName} (dummy)`);
    setOpen(false);
    setNewName("");
  };

  return (
    <div className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-[20px] p-4 h-full overflow-auto flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-900 text-sm">Project Structure</h3>
          <span className="bg-slate-100 text-slate-600 rounded-full text-[11px] px-2 py-0.5 font-medium border">kebab-case</span>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button variant="outline" size="sm" className="rounded-full bg-white/65 border-white/70 text-xs h-7">
                <Plus className="w-3 h-3" /> Add Folder/File
              </Button>
            }
          />
          <DialogContent className="bg-white/80 backdrop-blur-2xl border-white/70 rounded-[20px]">
            <DialogHeader>
              <DialogTitle>Add Folder/File</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name (kebab-case)</Label>
                <Input id="name" placeholder="contoh-file" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-white/80 rounded-xl mt-1" />
                <p className="text-xs text-slate-400 mt-1">e.g., payment-form, use-auth-query</p>
              </div>
              <Button onClick={handleAdd} className="w-full rounded-full bg-violet-600 hover:bg-violet-700">Add</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 space-y-1">
        <TreeNode node={tree} depth={0} selectedId={selectedId} onSelect={onSelect} />
      </div>

      <div className="mt-4 p-3 bg-white/65 rounded-xl border border-white/70">
        <p className="text-xs text-slate-500">Click any folder to inspect its rules and example code in the right panel.</p>
      </div>
    </div>
  );
};

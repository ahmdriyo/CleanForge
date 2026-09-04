"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ForgeHeaderSection } from "./sections/forge-header-section";
import { ChatPanel } from "./chat-panel";
import { VisualTree } from "./visual-tree";
import { FolderInspector } from "./folder-inspector";
import type { FolderNode } from "@/types/standard";
import { useStandardById, STANDARD_QUERY_KEYS } from "@/hooks/use-standards";
import {
  POPULAR_FRAMEWORKS,
  type FrameworkOption,
  getFrameworkTemplate,
} from "@/const/framework-templates";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { StandardService } from "@/services/standard.service";

// Recursive helper to update a node's details in the tree
const updateNodeInTree = (
  current: FolderNode,
  updated: FolderNode,
): FolderNode => {
  if (current.id === updated.id) {
    return {
      ...updated,
      children: current.children,
    };
  }
  if (!current.children) return current;
  return {
    ...current,
    children: current.children.map((child) => updateNodeInTree(child, updated)),
  };
};

// Recursive helper to delete a node from the tree
const deleteNodeFromTree = (current: FolderNode, id: string): FolderNode => {
  if (!current.children) return current;
  return {
    ...current,
    children: current.children
      .filter((child) => child.id !== id)
      .map((child) => deleteNodeFromTree(child, id)),
  };
};

export const ForgePage = ({
  standardId,
  standardName,
}: {
  standardId: string;
  standardName: string;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isNew = !standardId || standardId === "new";

  const { data: standard } = useStandardById(isNew ? "" : standardId);

  const [currentName, setCurrentName] = useState(standardName);
  const [currentFramework, setCurrentFramework] = useState("nextjs");
  const [currentTree, setCurrentTree] = useState<FolderNode>(
    POPULAR_FRAMEWORKS[0].initialTree,
  );
  const [selected, setSelected] = useState<FolderNode | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync state with fetched standard
  useEffect(() => {
    if (standard) {
      if (standard.name) setCurrentName(standard.name);
      if (standard.framework) setCurrentFramework(standard.framework);
      if (standard.folderStructure) {
        setCurrentTree(standard.folderStructure);
        if (!selected) {
          setSelected(standard.folderStructure);
        }
      }
    } else if (isNew) {
      const defaultTpl = POPULAR_FRAMEWORKS[0];
      setCurrentTree(defaultTpl.initialTree);
      setCurrentFramework(defaultTpl.id);
      if (!selected) {
        setSelected(defaultTpl.initialTree);
      }
    }
  }, [standard, isNew]);

  // Keep selected node in sync when currentTree changes
  const handleSelectNode = useCallback((node: FolderNode) => {
    setSelected(node);
  }, []);

  const handleUpdateTree = useCallback((newTree: FolderNode) => {
    setCurrentTree(newTree);
    setSelected((prev) => {
      if (!prev) return newTree;
      // Find updated version of selected in newTree
      const find = (n: FolderNode, id: string): FolderNode | null => {
        if (n.id === id) return n;
        if (n.children) {
          for (const c of n.children) {
            const found = find(c, id);
            if (found) return found;
          }
        }
        return null;
      };
      return find(newTree, prev.id) || prev;
    });
  }, []);

  const handleUpdateNode = useCallback(
    async (updatedNode: FolderNode) => {
      const updatedTree = updateNodeInTree(currentTree, updatedNode);
      handleUpdateTree(updatedTree);

      if (!isNew && standardId) {
        try {
          await StandardService.patchStandardById(standardId, {
            folderStructure: updatedTree,
          } as unknown as Partial<import("@/types/standard").Standard>);
          queryClient.invalidateQueries({ queryKey: STANDARD_QUERY_KEYS.all });
          queryClient.invalidateQueries({
            queryKey: STANDARD_QUERY_KEYS.detail(standardId),
          });
        } catch {
          // Tree already updated in local state
        }
      }
    },
    [currentTree, isNew, standardId, handleUpdateTree, queryClient],
  );

  const handleDeleteNode = useCallback(
    async (nodeId: string) => {
      if (nodeId === "root" || nodeId === currentTree.id) {
        toast.error("Cannot delete root folder");
        return;
      }
      const updatedTree = deleteNodeFromTree(currentTree, nodeId);
      handleUpdateTree(updatedTree);
      if (selected?.id === nodeId) {
        setSelected(updatedTree);
      }

      if (!isNew && standardId) {
        try {
          await StandardService.patchStandardById(standardId, {
            folderStructure: updatedTree,
          } as unknown as Partial<import("@/types/standard").Standard>);
          queryClient.invalidateQueries({ queryKey: STANDARD_QUERY_KEYS.all });
          queryClient.invalidateQueries({
            queryKey: STANDARD_QUERY_KEYS.detail(standardId),
          });
        } catch {
          // Tree already updated in local state
        }
      }
    },
    [currentTree, isNew, standardId, selected, handleUpdateTree, queryClient],
  );

  const handleSelectFramework = (option: FrameworkOption, customName?: string) => {
    const finalFrameworkName = customName || option.id;
    setCurrentFramework(finalFrameworkName);

    // If new or user wants template structure
    if (confirm(`Switch project structure template to "${customName || option.name}"? This will load its initial standard tree.`)) {
      setCurrentTree(option.initialTree);
      setSelected(option.initialTree);
      if (isNew) {
        setCurrentName(`My ${customName || option.name} Standard`);
      }
      toast.info(`Switched template to ${customName || option.name}`);
    }
  };

  const handleDeleteForge = async () => {
    if (isNew) return;
    setIsDeleting(true);
    try {
      const res = await StandardService.deleteStandardById(standardId);
      if (res.success) {
        toast.success("Standard Forge deleted successfully");
        queryClient.invalidateQueries({ queryKey: STANDARD_QUERY_KEYS.all });
        router.push("/standards");
        return;
      }
      throw new Error(res.message || "Failed to delete standard");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to delete standard";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveStandard = async (nameToSave?: string, frameworkToSave?: string) => {
    const finalName = (nameToSave || currentName).trim();
    const finalFramework = frameworkToSave || currentFramework;
    if (!finalName) {
      toast.error("Standard name cannot be empty");
      return;
    }
    setIsSaving(true);
    try {
      const activeFrameworkInfo = getFrameworkTemplate(finalFramework);

      if (isNew) {
        const res = await StandardService.postStandard({
          name: finalName,
          framework: finalFramework,
          description: `Clean architecture standard for ${activeFrameworkInfo.name} forged with Gemini`,
          folderStructure: currentTree,
          globalRules: activeFrameworkInfo.defaultRules,
        });
        if (res.success && res.data?.id) {
          toast.success("Standard created successfully!");
          queryClient.invalidateQueries({ queryKey: STANDARD_QUERY_KEYS.all });
          router.push(`/forge/${res.data.id}`);
          return;
        }
        throw new Error(res.message || "Failed to create standard");
      } else {
        const res = await StandardService.patchStandardById(standardId, {
          name: finalName,
          framework: finalFramework,
          folderStructure: currentTree,
        } as unknown as Partial<import("@/types/standard").Standard>);
        if (res.success) {
          toast.success("Standard saved successfully!");
          queryClient.invalidateQueries({ queryKey: STANDARD_QUERY_KEYS.all });
          queryClient.invalidateQueries({
            queryKey: STANDARD_QUERY_KEYS.detail(standardId),
          });
          return;
        }
        throw new Error(res.message || "Failed to save standard");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save standard";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyFromChat = (suggestion: string) => {
    // Extract candidate feature name from AI response
    let feat = "new-feature";
    const match =
      suggestion.match(/src\/features\/([a-z0-9-]+)/i) ||
      suggestion.match(/features\/([a-z0-9-]+)/i);
    if (match && match[1]) {
      feat = match[1].toLowerCase();
    } else {
      const lower = suggestion.toLowerCase();
      if (lower.includes("payment")) feat = "payment";
      else if (lower.includes("auth")) feat = "auth";
      else if (lower.includes("profile")) feat = "profile";
      else if (lower.includes("order")) feat = "order";
      else if (lower.includes("analytics")) feat = "analytics";
    }

    const featureFolder: FolderNode = {
      id: `feat-${feat}-${Date.now()}`,
      name: feat,
      type: "folder",
      rules: `Isolated ${feat} module with components, hooks, and schemas.`,
      naming: "kebab-case",
      children: [
        {
          id: `comp-${feat}-${Date.now()}`,
          name: "components",
          type: "folder",
          rules: `UI components for ${feat}`,
          naming: "kebab-case",
          children: [
            {
              id: `file-${feat}-card-${Date.now()}`,
              name: `${feat}-card.tsx`,
              type: "file",
              rules: "Clean UI component",
              naming: "kebab-case",
            },
          ],
        },
        {
          id: `hook-${feat}-${Date.now()}`,
          name: "hooks",
          type: "folder",
          rules: `Query and mutation hooks for ${feat}`,
          naming: "kebab-case",
          children: [
            {
              id: `file-use-${feat}-${Date.now()}`,
              name: `use-${feat}.ts`,
              type: "file",
              rules: "Custom TanStack Query hook",
              naming: "kebab-case",
            },
          ],
        },
      ],
    };

    // Find "features" folder in currentTree or attach to root
    const insertIntoFeaturesOrRoot = (root: FolderNode): FolderNode => {
      const clone = {
        ...root,
        children: root.children ? [...root.children] : [],
      };
      const featNode = clone.children?.find(
        (c) => c.name === "features" && c.type === "folder",
      );
      if (featNode) {
        featNode.children = [...(featNode.children || []), featureFolder];
        return clone;
      }
      clone.children = [...(clone.children || []), featureFolder];
      return clone;
    };

    const newTree = insertIntoFeaturesOrRoot(currentTree);
    handleUpdateTree(newTree);
    setSelected(featureFolder);
    toast.success(`Applied "${feat}" module to project structure!`);
  };

  const formattedLastSaved = standard?.updatedAt
    ? new Date(standard.updatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ForgeHeaderSection
        standardName={currentName}
        standardId={standardId}
        framework={currentFramework}
        onSave={handleSaveStandard}
        onDelete={handleDeleteForge}
        onSelectFramework={handleSelectFramework}
        isSaving={isSaving}
        isDeleting={isDeleting}
        lastSaved={formattedLastSaved}
      />

      {/* Desktop: 3 panels resizable */}
      <div className="hidden lg:block flex-1 min-h-0">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-full rounded-[20px] gap-2"
        >
          <ResizableHandle withHandle className="bg-transparent" />
          <ResizablePanel defaultSize={35} minSize={25}>
            <VisualTree
              selectedId={selected?.id || null}
              onSelect={handleSelectNode}
              folderTree={currentTree}
              onTreeChange={handleUpdateTree}
              standardId={standardId}
            />
          </ResizablePanel>
          <ResizablePanel defaultSize={35} minSize={25}>
            <FolderInspector
              key={selected?.id ?? "none"}
              node={selected}
              onUpdateNode={handleUpdateNode}
              onDeleteNode={handleDeleteNode}
              isSaving={isSaving}
            />
          </ResizablePanel>
          <ResizablePanel defaultSize={30} minSize={20}>
            <ChatPanel standardId={standardId} onApply={handleApplyFromChat} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile: Tabs */}
      <div className="lg:hidden flex-1 flex flex-col min-h-0">
        <Tabs defaultValue="tree" className="flex-1 flex flex-col min-h-0">
          <TabsList className="bg-white/65 backdrop-blur rounded-full p-1 w-fit mx-auto shrink-0 mb-2">
            <TabsTrigger
              value="tree"
              className="rounded-full data-[state=active]:bg-violet-600 data-[state=active]:text-white text-xs px-4"
            >
              Tree
            </TabsTrigger>
            <TabsTrigger
              value="inspector"
              className="rounded-full data-[state=active]:bg-violet-600 data-[state=active]:text-white text-xs px-4"
            >
              Inspector
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="rounded-full data-[state=active]:bg-violet-600 data-[state=active]:text-white text-xs px-4"
            >
              Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tree" className="flex-1 min-h-0 h-[65vh]">
            <VisualTree
              selectedId={selected?.id || null}
              onSelect={handleSelectNode}
              folderTree={currentTree}
              onTreeChange={handleUpdateTree}
              standardId={standardId}
            />
          </TabsContent>
          <TabsContent value="inspector" className="flex-1 min-h-0 h-[65vh]">
            <FolderInspector
              key={selected?.id ?? "none"}
              node={selected}
              onUpdateNode={handleUpdateNode}
              onDeleteNode={handleDeleteNode}
              isSaving={isSaving}
            />
          </TabsContent>
          <TabsContent value="chat" className="flex-1 min-h-0 h-[65vh]">
            <ChatPanel standardId={standardId} onApply={handleApplyFromChat} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

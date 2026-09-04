"use client";

import { useState } from "react";
import { ForgeHeaderSection } from "./sections/forge-header-section";
import { ChatPanel } from "./chat-panel";
import { VisualTree } from "./visual-tree";
import { FolderInspector } from "./folder-inspector";
import type { FolderNode } from "@/types/standard";
import { useStandardById } from "@/hooks/use-standards";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ForgePage = ({
  standardId,
  standardName,
}: {
  standardId: string;
  standardName: string;
}) => {
  const [selected, setSelected] = useState<FolderNode | null>(null);
  const { data: standard } = useStandardById(standardId === "new" ? "" : standardId);
  const folderTree = (standard as unknown as { folderStructure?: FolderNode })?.folderStructure || null;
  const displayName = (standard as unknown as { name?: string })?.name || standardName;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ForgeHeaderSection standardName={displayName} standardId={standardId} />

      {/* Desktop: 3 panels resizable */}
      <div className="hidden lg:block flex-1 min-h-0 ">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-full rounded-[20px] gap-2"
        >
          <ResizableHandle withHandle className="bg-transparent" />
          <ResizablePanel defaultSize={35} minSize={25}>
            <VisualTree
              selectedId={selected?.id || null}
              onSelect={setSelected}
              folderTree={folderTree}
              standardId={standardId}
            />
          </ResizablePanel>
          <ResizablePanel defaultSize={35} minSize={25}>
            <FolderInspector key={selected?.id ?? "none"} node={selected} />
          </ResizablePanel>
          <ResizablePanel defaultSize={30} minSize={20}>
            <ChatPanel
              standardId={standardId}
              onApply={() => console.log("apply", standardId)}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile: Tabs */}
      <div className="lg:hidden flex-1 flex flex-col">
        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <TabsList className="bg-white/65 backdrop-blur rounded-full p-1 w-fit mx-auto">
            <TabsTrigger
              value="chat"
              className="rounded-full data-[state=active]:bg-violet-600 data-[state=active]:text-white"
            >
              Chat
            </TabsTrigger>
            <TabsTrigger
              value="tree"
              className="rounded-full data-[state=active]:bg-violet-600 data-[state=active]:text-white"
            >
              Tree
            </TabsTrigger>
            <TabsTrigger
              value="inspector"
              className="rounded-full data-[state=active]:bg-violet-600 data-[state=active]:text-white"
            >
              Inspector
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tree" className="flex-1 mt-4 h-[60vh]">
            <VisualTree
              selectedId={selected?.id || null}
              onSelect={setSelected}
              folderTree={folderTree}
              standardId={standardId}
            />
          </TabsContent>
          <TabsContent value="inspector" className="flex-1 mt-4 h-[60vh]">
            <FolderInspector key={selected?.id ?? "none"} node={selected} />
          </TabsContent>
          <TabsContent value="chat" className="flex-1 mt-4 h-[60vh]">
            <ChatPanel standardId={standardId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

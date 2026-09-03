"use client";

import { useState } from "react";
import { ForgeHeaderSection } from "./sections/forge-header-section";
import { ChatPanel } from "./chat-panel";
import { VisualTree } from "./visual-tree";
import { FolderInspector } from "./folder-inspector";
import type { FolderNode } from "@/types/standard";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ForgePage = ({ standardId, standardName }: { standardId: string; standardName: string }) => {
  const [selected, setSelected] = useState<FolderNode | null>(null);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <ForgeHeaderSection standardName={standardName} />

      {/* Desktop: 3 panels resizable */}
      <div className="hidden lg:block flex-1">
        <ResizablePanelGroup orientation="horizontal" className="h-full rounded-[20px]">
          <ResizablePanel defaultSize={30} minSize={20}>
            <ChatPanel onApply={() => console.log("apply", standardId)} />
          </ResizablePanel>
          <ResizableHandle withHandle className="bg-transparent" />
          <ResizablePanel defaultSize={35} minSize={25}>
            <VisualTree selectedId={selected?.id || null} onSelect={setSelected} />
          </ResizablePanel>
          <ResizableHandle withHandle className="bg-transparent" />
          <ResizablePanel defaultSize={35} minSize={25}>
            <FolderInspector node={selected} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile: Tabs */}
      <div className="lg:hidden flex-1 flex flex-col">
        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <TabsList className="bg-white/40 backdrop-blur rounded-full p-1 w-fit mx-auto">
            <TabsTrigger value="chat" className="rounded-full data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              Chat
            </TabsTrigger>
            <TabsTrigger value="tree" className="rounded-full data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              Tree
            </TabsTrigger>
            <TabsTrigger value="inspector" className="rounded-full data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              Inspector
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="flex-1 mt-4 h-[60vh]">
            <ChatPanel />
          </TabsContent>
          <TabsContent value="tree" className="flex-1 mt-4 h-[60vh]">
            <VisualTree selectedId={selected?.id || null} onSelect={setSelected} />
          </TabsContent>
          <TabsContent value="inspector" className="flex-1 mt-4 h-[60vh]">
            <FolderInspector node={selected} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

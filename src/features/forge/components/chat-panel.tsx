"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dummyMessages } from "@/data-dummy/journals-dummy";
import { Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useChat } from "@/hooks/use-chat";
import { useJournals } from "@/hooks/use-journals";

export const ChatPanel = ({ onApply, standardId }: { onApply?: () => void; standardId?: string }) => {
  const { data: journals } = useJournals(standardId);
  const initialMessages = journals?.[0]?.messages?.length ? journals[0].messages : dummyMessages;
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const chatMutation = useChat();

  const handleSend = async () => {
    if (!input.trim()) return;
    const newUser = { id: `msg-${Date.now()}`, role: "user" as const, content: input, timestamp: new Date().toISOString() };
    setMessages((prev: typeof dummyMessages) => [...prev, newUser]);
    const currentInput = input;
    setInput("");

    // Try real API if standardId exists and not "new"
    if (standardId && standardId !== "new") {
      try {
        const res = await chatMutation.mutateAsync({ standardId, message: currentInput });
        if ((res as unknown as { success: boolean }).success) {
          const reply = ((res as unknown as { data: { reply: string } }).data).reply;
          const newAssistant = {
            id: `msg-${Date.now() + 1}`,
            role: "assistant" as const,
            content: reply,
            timestamp: new Date().toISOString(),
            hasApply: true,
          };
          setMessages((prev: typeof dummyMessages) => [...prev, newAssistant]);
          return;
        }
      } catch {
        // fallback to dummy
      }
    }

    // Fallback dummy
    const newAssistant = {
      id: `msg-${Date.now() + 1}`,
      role: "assistant" as const,
      content: `Great question about "${currentInput}". I recommend using kebab-case and keeping it in src/features. Click Apply to Standard to update your tree.`,
      timestamp: new Date().toISOString(),
      hasApply: true,
    };
    setMessages((prev: typeof dummyMessages) => [...prev, newAssistant]);
  };

  return (
    <div className="bg-white/65 backdrop-blur-xl border border-white/60 rounded-[20px] flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-white/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-900">Gemini Consultant</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <Button variant="ghost" size="sm" className="text-xs h-7 rounded-full" onClick={() => setMessages(dummyMessages)}>
          Clear Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m: (typeof dummyMessages)[number]) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${m.role === "user" ? "bg-violet-600 text-white rounded-br-sm ml-8" : "bg-white/70 backdrop-blur border border-white/70 rounded-bl-sm mr-8 text-slate-700"}`}>
              <div className="whitespace-pre-wrap">{m.content}</div>
              {m.hasApply && m.role === "assistant" && (
                <Button
                  size="sm"
                  className="mt-2 h-7 text-xs bg-violet-100 text-violet-700 hover:bg-violet-200 rounded-full border border-violet-200"
                  onClick={() => {
                    onApply?.();
                    toast.success("Applied to standard!");
                  }}
                >
                  Apply to Standard
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-white/70">
        <div className="bg-white/80 backdrop-blur border border-white/70 rounded-full px-2 py-1.5 flex gap-2">
          <Input
            placeholder="Ask Gemini about your structure..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 text-sm h-8"
          />
          <Button size="icon" className="rounded-full bg-violet-600 hover:bg-violet-700 w-8 h-8 shrink-0" onClick={handleSend}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";
import { useChat } from "@/hooks/use-chat";
import { useJournals } from "@/hooks/use-journals";
import type { ChatMessage } from "@/types/standard";

export const ChatPanel = ({
  onApply,
  standardId,
}: {
  onApply?: (suggestion: string) => void;
  standardId?: string;
}) => {
  const { data: journals } = useJournals(standardId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const chatMutation = useChat();

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync messages without calling setState in an effect
  const [prevJournalId, setPrevJournalId] = useState<string | null>(null);
  const currentJournal = journals?.[0];
  if (currentJournal && currentJournal.id !== prevJournalId) {
    setPrevJournalId(currentJournal.id);
    if (currentJournal.messages) {
      setMessages(currentJournal.messages);
    }
  }

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const currentInput = input.trim();
    const newUser = {
      id: `msg-${Date.now()}`,
      role: "user" as const,
      content: currentInput,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev: ChatMessage[]) => [...prev, newUser]);
    setInput("");

    // Try real API if standardId exists and not "new"
    if (standardId && standardId !== "new") {
      try {
        const res = await chatMutation.mutateAsync({
          standardId,
          message: currentInput,
        });
        if ((res as unknown as { success: boolean }).success) {
          const reply = (res as unknown as { data: { reply: string } }).data
            .reply;
          const newAssistant = {
            id: `msg-${Date.now() + 1}`,
            role: "assistant" as const,
            content: reply,
            timestamp: new Date().toISOString(),
            hasApply: true,
          };
          setMessages((prev: ChatMessage[]) => [...prev, newAssistant]);
          return;
        }
      } catch {
        // fallback to intelligent architect reply
      }
    }

    // Intelligent fallback reply for consultant
    const lower = currentInput.toLowerCase();
    let suggestedName = "module";
    if (lower.includes("pay") || lower.includes("stripe"))
      suggestedName = "payment";
    else if (lower.includes("user") || lower.includes("profile"))
      suggestedName = "profile";
    else if (lower.includes("auth") || lower.includes("login"))
      suggestedName = "auth";
    else if (lower.includes("order") || lower.includes("cart"))
      suggestedName = "checkout";
    else if (lower.includes("analytic")) suggestedName = "analytics";
    else if (lower.includes("notif")) suggestedName = "notifications";
    else {
      const words = currentInput.split(/\s+/).filter((w) => w.length > 2);
      suggestedName =
        words[words.length - 1]?.replace(/[^a-z0-9-]/gi, "").toLowerCase() ||
        "feature-module";
    }

    const reply = `I recommend structuring this under "src/features/${suggestedName}" using kebab-case:\n\n• components/${suggestedName}-card.tsx\n• hooks/use-${suggestedName}.ts\n• schemas/${suggestedName}-schema.ts\n\nClick "Apply to Standard" below to automatically scaffold this folder into your project structure.`;

    const newAssistant = {
      id: `msg-${Date.now() + 1}`,
      role: "assistant" as const,
      content: reply,
      timestamp: new Date().toISOString(),
      hasApply: true,
    };
    setMessages((prev: ChatMessage[]) => [...prev, newAssistant]);
  };

  return (
    <div className="bg-white/65 backdrop-blur-xl border border-white/60 rounded-[20px] flex flex-col h-full min-h-0 overflow-hidden focus-within:ring-2 focus-within:ring-violet-400/40 transition-all duration-200">
      <div className="px-4 py-3 border-b border-white/70 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-900">
            Gemini Consultant
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-7 rounded-full"
          onClick={() => setMessages([])}
        >
          Clear Chat
        </Button>
      </div>

      <div
        ref={messagesContainerRef}
        tabIndex={0}
        role="region"
        aria-label="Chat messages history"
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 space-y-4 overscroll-contain custom-scrollbar focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-400/50 rounded-xl"
      >
        {messages.map((m: ChatMessage) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3 text-xs sm:text-sm ${m.role === "user" ? "bg-violet-600 text-white rounded-br-sm ml-6" : "bg-white/80 backdrop-blur border border-white/70 rounded-bl-sm mr-6 text-slate-700"}`}
            >
              <div className="whitespace-pre-wrap break-all leading-relaxed">
                {m.content}
              </div>
              {m.hasApply && m.role === "assistant" && (
                <Button
                  size="sm"
                  className="mt-2.5 h-7 text-xs bg-violet-100 text-violet-700 hover:bg-violet-200 rounded-full border border-violet-200"
                  onClick={() => {
                    onApply?.(m.content);
                  }}
                >
                  <Sparkles className="w-3 h-3 mr-1" /> Apply to Standard
                </Button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-white/70 shrink-0">
        <div className="bg-white/80 backdrop-blur border border-white/70 rounded-full px-2 py-1.5 flex gap-2">
          <Input
            placeholder="Ask Gemini about your structure..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 text-xs sm:text-sm h-8"
          />
          <Button
            size="icon"
            className="rounded-full bg-violet-600 hover:bg-violet-700 w-8 h-8 shrink-0"
            onClick={handleSend}
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

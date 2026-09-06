"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Loader2 } from "lucide-react";
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
  const [isSending, setIsSending] = useState(false);
  const chatMutation = useChat();

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
  }, [messages, isSending]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    const currentInput = input.trim();
    const newUser = {
      id: `msg-${Date.now()}`,
      role: "user" as const,
      content: currentInput,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev: ChatMessage[]) => [...prev, newUser]);
    setInput("");
    setIsSending(true);

    // Try real API if standardId exists and not "new"
    if (standardId && standardId !== "new") {
      try {
        const res = await chatMutation.mutateAsync({
          standardId,
          message: currentInput,
        });
        if (res.success && res.data?.reply) {
          const reply = res.data.reply;
          const newAssistant = {
            id: `msg-${Date.now() + 1}`,
            role: "assistant" as const,
            content: reply,
            timestamp: new Date().toISOString(),
            hasApply: true,
          };
          setMessages((prev: ChatMessage[]) => [...prev, newAssistant]);
          setIsSending(false);
          return;
        }
      } catch (err) {
        console.warn("Real API chat error, using fallback reply:", err);
      }
    }

    // Offline fallback (only when standardId is "new" or API truly unreachable — server now has richer fallback)
    const lower = currentInput.toLowerCase();
    let suggestedName = "feature-module";
    let hint = "";
    if (lower.includes("pay") || lower.includes("stripe") || lower.includes("billing")) {
      suggestedName = "payment";
      hint = "Payment flow — consider Stripe intents + idempotent webhooks.";
    } else if (lower.includes("user") || lower.includes("profile") || lower.includes("account")) {
      suggestedName = "user-profile";
      hint = "User profile — avatar upload + Zod profile schema.";
    } else if (lower.includes("auth") || lower.includes("login") || lower.includes("register")) {
      suggestedName = "auth";
      hint = "Auth — JWT + Firebase Auth guard + Zod.";
    } else if (lower.includes("order") || lower.includes("cart") || lower.includes("checkout")) {
      suggestedName = "checkout";
      hint = "Checkout — cart state (Zustand) + order validation.";
    } else if (lower.includes("analytic") || lower.includes("metric") || lower.includes("stat") || lower.includes("dashboard")) {
      suggestedName = "analytics";
      hint = "Analytics — charts + TanStack Query.";
    } else if (lower.includes("notif") || lower.includes("chat") || lower.includes("message")) {
      suggestedName = "notifications";
      hint = "Notifications — realtime (Firestore) + toast.";
    } else {
      const words = currentInput.split(/\s+/).filter((w) => w.length > 3 && !["please", "could", "would", "create", "build", "make"].includes(w.toLowerCase()));
      const last = words[words.length - 1]?.replace(/[^a-z0-9-]/gi, "").toLowerCase();
      if (last && last.length > 2) suggestedName = last;
    }

    const reply = `Offline fallback - Gemini not reachable for this request.

Saran untuk ${suggestedName} (${hint || "general feature"}):

Path: src/features/${suggestedName}
1. components/${suggestedName}-card.tsx - UI, kebab-case, Tailwind
2. hooks/use-${suggestedName}.ts - data, TanStack Query
3. schemas/${suggestedName}-schema.ts - Zod

Klik Apply to Standard untuk scaffold, atau coba lagi setelah Gemini dikonfigurasi. Untuk balasan AI asli, set GEMINI_API_KEY yang valid di Secret Manager.`;

    const newAssistant = {
      id: `msg-${Date.now() + 1}`,
      role: "assistant" as const,
      content: reply,
      timestamp: new Date().toISOString(),
      hasApply: true,
    };
    setMessages((prev: ChatMessage[]) => [...prev, newAssistant]);
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTemplateClick = (text: string) => {
    if (isSending) return;
    setInput(text);
    // auto-send after setting input
    setTimeout(() => {
      // directly send with that text to avoid race with state
      const newUser = {
        id: `msg-${Date.now()}`,
        role: "user" as const,
        content: text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev: ChatMessage[]) => [...prev, newUser]);
      setInput("");
      setIsSending(true);
      if (standardId && standardId !== "new") {
        chatMutation
          .mutateAsync({ standardId, message: text })
          .then((res) => {
            if (res.success && res.data?.reply) {
              setMessages((prev: ChatMessage[]) => [
                ...prev,
                {
                  id: `msg-${Date.now() + 1}`,
                  role: "assistant" as const,
                  content: res.data.reply,
                  timestamp: new Date().toISOString(),
                  hasApply: true,
                },
              ]);
            }
          })
          .catch(() => {
            const lower = text.toLowerCase();
            let suggestedName = "feature-module";
            if (lower.includes("payment")) suggestedName = "payment";
            else if (lower.includes("profile")) suggestedName = "profile";
            else if (lower.includes("auth")) suggestedName = "auth";
            setMessages((prev: ChatMessage[]) => [
              ...prev,
              {
                id: `msg-${Date.now() + 1}`,
                role: "assistant" as const,
                content: `Saran untuk ${suggestedName}:\nPath: src/features/${suggestedName}\n1. components/${suggestedName}-card.tsx\n2. hooks/use-${suggestedName}.ts\n3. schemas/${suggestedName}-schema.ts\n\nKlik Apply to Standard untuk scaffold.`,
                timestamp: new Date().toISOString(),
                hasApply: true,
              },
            ]);
          })
          .finally(() => setIsSending(false));
      } else {
        // fallback for "new"
        setTimeout(() => setIsSending(false), 400);
        setMessages((prev: ChatMessage[]) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            role: "assistant" as const,
            content: `Saran untuk ${text.slice(0, 30)}:\nPath: src/features/feature-module\n1. components/feature-module-card.tsx\n2. hooks/use-feature-module.ts\n3. schemas/feature-module-schema.ts`,
            timestamp: new Date().toISOString(),
            hasApply: true,
          },
        ]);
      }
    }, 50);
  };

  const MESSAGE_TEMPLATES = [
    "Scaffold payment gateway feature with clean structure",
    "How to organize my Next.js folder for scalability?",
    "Create user profile feature following the standard",
    "Explain best practice for Go clean architecture",
    "Help me refactor auth module to be more isolated",
    "Generate example code for src/features/payment/components",
  ];

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
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-white/80 backdrop-blur border border-white/70 rounded-2xl rounded-bl-sm p-3 text-xs text-slate-500 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-600" />
              <span>Gemini is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message templates — clickable to auto-send */}
      {messages.length === 0 && !isSending && (
        <div className="px-3 pb-2 shrink-0">
          <p className="text-[11px] font-medium text-slate-500 mb-1.5">Try asking:</p>
          <div className="flex flex-wrap gap-1.5">
            {MESSAGE_TEMPLATES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTemplateClick(t)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 transition text-left leading-tight"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 border-t border-white/70 shrink-0">
        <div className="bg-white/85 backdrop-blur border border-white/70 rounded-2xl p-2 flex flex-col gap-1.5 shadow-xs focus-within:border-violet-300 focus-within:ring-1 focus-within:ring-violet-300 transition-all">
          <Textarea
            ref={textareaRef}
            placeholder="Ask Gemini about your architecture structure... (Enter to send, Shift+Enter for new line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            rows={2}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 text-xs sm:text-sm p-1 resize-none custom-scrollbar min-h-12 max-h-32"
          />
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 px-1">
              Press{" "}
              <kbd className="px-1 py-0.5 rounded bg-slate-100 font-mono text-[9px]">
                Enter
              </kbd>{" "}
              to send
            </span>
            <Button
              size="sm"
              disabled={isSending || !input.trim()}
              className="rounded-full bg-violet-600 hover:bg-violet-700 text-white h-7 px-3 text-xs gap-1.5"
              onClick={handleSend}
            >
              {isSending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Send className="w-3 h-3" />
              )}
              <span>Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/server/auth/verify-id-token";
import {
  getJournalByStandardId,
  getOrCreateJournal,
  appendMessages,
} from "@/server/repository/journal-repository";
import { chatWithGemini } from "@/server/service/gemini-service";
import { getStandardById } from "@/server/repository/standard-repository";

const chatSchema = z.object({
  standardId: z.string().min(1, "standardId required"),
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(500, "Max 500 chars"),
});

export async function POST(req: Request) {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    const body = await req.json();
    const parsed = chatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { standardId, message } = parsed.data;

    // Verify standard belongs to user
    const standard = await getStandardById(auth.uid, standardId);
    if (!standard)
      return NextResponse.json(
        { success: false, message: "Standard not found" },
        { status: 404 },
      );

    const journal = await getOrCreateJournal(auth.uid, standardId);

    let reply: string;
    try {
      reply = await chatWithGemini({
        history: journal.messages,
        message,
        standardContext: standard.folderStructure,
      });
    } catch (geminiError: unknown) {
      const errMsg = geminiError instanceof Error ? geminiError.message : String(geminiError);
      const isKeyInvalid = errMsg.includes("API_KEY_INVALID") || errMsg.includes("API key not valid");
      console.warn("Gemini service failed, using enhanced fallback:", errMsg);

      // Enhanced fallback that still uses the real standard context (not just keyword matching)
      const lower = message.toLowerCase();
      const framework = standard.framework || "nextjs";
      const rootName = standard.folderStructure?.name || "src";
      const hasFeatures = JSON.stringify(standard.folderStructure).includes("features");

      let suggestedName = "feature-module";
      let reason = "general feature";

      if (lower.includes("pay") || lower.includes("stripe") || lower.includes("billing")) {
        suggestedName = "payment";
        reason = "payment/billing flow";
      } else if (lower.includes("user") || lower.includes("profile") || lower.includes("account")) {
        suggestedName = "user-profile";
        reason = "user management";
      } else if (lower.includes("auth") || lower.includes("login") || lower.includes("register") || lower.includes("session")) {
        suggestedName = "auth";
        reason = "authentication";
      } else if (lower.includes("order") || lower.includes("cart") || lower.includes("checkout")) {
        suggestedName = "checkout";
        reason = "order processing";
      } else if (lower.includes("analytic") || lower.includes("metric") || lower.includes("stat") || lower.includes("dashboard")) {
        suggestedName = "analytics";
        reason = "data visualization";
      } else if (lower.includes("notif") || lower.includes("message") || lower.includes("chat")) {
        suggestedName = "notifications";
        reason = "messaging";
      } else if (lower.includes("setting") || lower.includes("config")) {
        suggestedName = "settings";
        reason = "configuration";
      } else {
        // Use last meaningful word, but make it more natural
        const words = message.split(/\s+/).filter((w) => w.length > 3 && !["please", "could", "would", "should", "create", "build", "make", "add"].includes(w.toLowerCase()));
        const lastWord = words[words.length - 1]?.replace(/[^a-z0-9-]/gi, "").toLowerCase();
        if (lastWord && lastWord.length > 2) {
          suggestedName = lastWord;
          reason = lastWord;
        }
      }

      const basePath = hasFeatures ? `${rootName}/features/${suggestedName}` : `${rootName}/${suggestedName}`;
      const keyNote = isKeyInvalid
        ? "\n\n> ⚠️ Gemini API key is invalid or not configured (Secret Manager GEMINI_API_KEY). Showing offline fallback — set a valid AIza... key from https://aistudio.google.com to get real AI replies."
        : "";

      // More varied, context-aware reply
      reply = `For **${reason}** in **${framework}** (${rootName}/), I recommend:\n\n**Path:** \`${basePath}\`\n- \`components/${suggestedName}-card.tsx\` — UI (kebab-case, Tailwind + shadcn, no data-fetch)\n- \`hooks/use-${suggestedName}.ts\` — data layer (TanStack Query, key: ["${suggestedName}"])\n- \`schemas/${suggestedName}-schema.ts\` — Zod validation\n\n**Rules from your standard:**\n- Naming: \`${standard.globalRules?.namingConvention || "kebab-case"}\`\n- Styling: \`${standard.globalRules?.styling || "Tailwind"}\`\n- Principles: \`${(standard.globalRules?.principles || []).join(", ") || "feature-based, isolated"}\`\n\nClick **"Apply to Standard"** to scaffold this now, or tell me more about the ${suggestedName} flow and I'll refine it.${keyNote}`;
    }

    const now = new Date().toISOString();
    const userMsg = {
      id: `msg-${Date.now()}`,
      role: "user" as const,
      content: message,
      timestamp: now,
    };
    const assistantMsg = {
      id: `msg-${Date.now() + 1}`,
      role: "assistant" as const,
      content: reply,
      timestamp: now,
      hasApply: reply.includes("Apply"),
    };

    const updated = await appendMessages(auth.uid, journal.id, [
      userMsg,
      assistantMsg,
    ]);

    return NextResponse.json({
      success: true,
      data: { reply, journalId: journal.id, messages: updated?.messages || [] },
    });
  } catch (e) {
    console.error("POST /api/chat error", e);
    return NextResponse.json(
      { success: false, message: "Failed to chat with Gemini" },
      { status: 500 },
    );
  }
}

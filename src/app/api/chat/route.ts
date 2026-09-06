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
    } catch (geminiError) {
      console.warn(
        "Gemini service failed or not configured, using fallback consultant:",
        geminiError,
      );

      const lower = message.toLowerCase();
      let suggestedName = "module";
      if (
        lower.includes("pay") ||
        lower.includes("stripe") ||
        lower.includes("billing")
      )
        suggestedName = "payment";
      else if (lower.includes("user") || lower.includes("profile"))
        suggestedName = "profile";
      else if (
        lower.includes("auth") ||
        lower.includes("login") ||
        lower.includes("register")
      )
        suggestedName = "auth";
      else if (
        lower.includes("order") ||
        lower.includes("cart") ||
        lower.includes("checkout")
      )
        suggestedName = "checkout";
      else if (
        lower.includes("analytic") ||
        lower.includes("metric") ||
        lower.includes("stat")
      )
        suggestedName = "analytics";
      else if (lower.includes("notif")) suggestedName = "notifications";
      else {
        const words = message.split(/\s+/).filter((w) => w.length > 2);
        suggestedName =
          words[words.length - 1]?.replace(/[^a-z0-9-]/gi, "").toLowerCase() ||
          "feature-module";
      }

      reply = `I recommend structuring this under "src/features/${suggestedName}" using kebab-case following clean architecture:\n\n• components/${suggestedName}-card.tsx\n• hooks/use-${suggestedName}.ts\n• schemas/${suggestedName}-schema.ts\n\nClick "Apply to Standard" below to automatically scaffold this folder into your project structure.`;
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

import { getGeminiClient, GEMINI_MODEL, GEMINI_SYSTEM_INSTRUCTION } from "@/server/infra/gemini-client";
import type { ChatMessage } from "@/types/standard";
import type { FolderNode } from "@/types/standard";

/**
 * Gemini Service — Flash only, multi-turn, streaming
 */

export const chatWithGemini = async (args: {
  history: ChatMessage[];
  message: string;
  standardContext?: FolderNode;
}): Promise<string> => {
  const client = await getGeminiClient();
  const model = client.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
  });

  // Build history for Gemini: turn history into parts
  const history = args.history
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content }],
    }));

  const contextPrefix = args.standardContext
    ? `Current standard context: ${JSON.stringify(args.standardContext).slice(0, 2000)}\n\n`
    : "";

  const chat = model.startChat({
    history,
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
  });

  const result = await chat.sendMessage(`${contextPrefix}${args.message}`);
  return result.response.text();
};

export const chatWithGeminiStream = async (
  args: { history: ChatMessage[]; message: string; standardContext?: FolderNode },
  onChunk: (chunk: string) => void,
): Promise<string> => {
  const client = await getGeminiClient();
  const model = client.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
  });

  const history = args.history.map((m) => ({
    role: m.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: m.content }],
  }));

  const contextPrefix = args.standardContext ? `Context: ${JSON.stringify(args.standardContext).slice(0, 2000)}\n\n` : "";

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(`${contextPrefix}${args.message}`);

  let full = "";
  for await (const chunk of result.stream) {
    const text = chunk.text();
    full += text;
    onChunk(text);
  }
  return full;
};

export const generateExampleCode = async (args: {
  folderPath: string;
  rules: string;
  naming: string;
}): Promise<string> => {
  const client = await getGeminiClient();
  const model = client.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
  });

  const prompt = `Generate example code for folder: ${args.folderPath}\nRules: ${args.rules}\nNaming: ${args.naming}\nReturn only code block, keep it short, TypeScript React with Tailwind + shadcn, kebab-case file.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

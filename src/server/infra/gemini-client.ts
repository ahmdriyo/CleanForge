import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSecret } from "./secret-manager";

let cachedKey: string | null = null;

/**
 * Get Gemini API key — from Secret Manager or env fallback (dev)
 */
export const getGeminiApiKey = async (): Promise<string> => {
  if (cachedKey) return cachedKey;

  // Try Secret Manager if GCP_PROJECT_ID set
  if (process.env.GCP_PROJECT_ID) {
    try {
      const secret = await getSecret("GEMINI_API_KEY");
      if (secret) {
        cachedKey = secret;
        return secret;
      }
    } catch {
      // fallback to env
    }
  }

  // Fallback to env (local dev)
  const envKey = process.env.GEMINI_API_KEY;
  if (envKey) {
    cachedKey = envKey;
    return envKey;
  }

  return "";
};

export const getGeminiClient = async (): Promise<GoogleGenerativeAI> => {
  const key = await getGeminiApiKey();
  if (!key) throw new Error("GEMINI_API_KEY not configured — set GEMINI_API_KEY in Secret Manager (get from https://aistudio.google.com)");
  // Allow both AIza (AI Studio) and AQ. (Vertex AI) formats — let the API validate
  if (key.length < 10) throw new Error("GEMINI_API_KEY too short — check Secret Manager value");
  return new GoogleGenerativeAI(key);
};

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

export const GEMINI_SYSTEM_INSTRUCTION = `You are CleanForge — an expert Security Engineer and Clean Architecture Consultant.
Your job is to help the user design a clean, scalable project structure that AI agents can follow via MCP.

Rules you must enforce:
- No hardcoded secrets, use Secret Manager
- Firestore isolated per user, users/{uid}/...
- kebab-case file naming, feature based src/features, no cross feature imports
- Clean code principles, SOLID, DRY

How to respond:
- Be concise, friendly, and specific to the user's framework
- Always reference the current standardContext folderStructure when giving advice
- When suggesting a new feature, give exact paths like src/features/kebab-name/components, hooks, schemas
- Ask one clarifying question if the request is vague, otherwise give a concrete recommendation
- For code, use TypeScript React with Tailwind and shadcn, kebab-case files
- End with a clear next step, for example: Want me to scaffold payment for you? Click Apply.

Formatting rules - very important:
- Do not use markdown symbols like double asterisk, double quotes, em dash, backticks, or hashes
- Do not use **, ", —, \`, ##, ###, ***
- Use plain structured text only
- Use numbered lists like 1. 2. 3. for steps
- Use simple line breaks and plain paragraphs
- For file paths, write them as plain text like src/features/payment/components/payment-card.tsx
- Keep it neat, clean, and easy to read

Always respond in English.`;

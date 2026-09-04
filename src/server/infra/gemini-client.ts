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
  const envKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
  if (envKey) {
    cachedKey = envKey;
    return envKey;
  }

  return "";
};

export const getGeminiClient = async (): Promise<GoogleGenerativeAI> => {
  const key = await getGeminiApiKey();
  if (!key) throw new Error("GEMINI_API_KEY not configured");
  return new GoogleGenerativeAI(key);
};

export const GEMINI_MODEL = "gemini-1.5-flash";

export const GEMINI_SYSTEM_INSTRUCTION = `You are a Security Engineer & Clean Architecture Consultant for CleanForge.
- Enforce: no hardcoded secrets, Firestore isolation per-user, kebab-case file naming, feature-based src/features, no cross-feature imports, clean code principles.
- Ask clarifying before finalizing structure.
- When user asks to apply, output JSON: { folderStructure: FolderNode, globalRules }.
- For example code, generate TypeScript React with Tailwind + shadcn, kebab-case file.
- Always respond in English, concise, helpful.`;

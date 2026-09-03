import { z } from "zod";

export const folderNodeSchema = z.object({
  name: z.string().min(1, "Name required").regex(/^[a-z0-9-.]+$/, "Use kebab-case (e.g., contoh-file)"),
  rules: z.string().min(1, "Rules required"),
  naming: z.enum(["kebab-case", "PascalCase", "camelCase"]),
  exampleCode: z.string().optional(),
  description: z.string().optional(),
});

export const chatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(500, "Max 500 chars"),
});

export const secretSchema = z.object({
  secret: z.string().optional(),
});

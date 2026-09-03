import type { DocSection } from "@/types/standard";

export const docsSections: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    content: "CleanForge helps you enforce clean code standards via private MCP endpoints. Create a standard, brainstorm with Gemini, generate your MCP, and paste it into Cursor or Claude Desktop. Your AI will then generate code following your kebab-case, feature-based architecture.",
  },
  {
    id: "forge-guide",
    title: "Forge Guide",
    content: "In Forge Studio, use the 3-panel layout: Left is your Gemini Consultant chat (journal), center is the visual folder tree, right is the inspector for per-folder rules and example code. Click any folder to edit its naming and example.",
  },
  {
    id: "mcp-cursor",
    title: "How to Connect to Cursor",
    content: "Open Cursor Settings → MCP → Add new global MCP server. Paste your endpoint URL.",
    code: `{\n  "mcpServers": {\n    "cleanforge": {\n      "url": "https://cleanforge.run.app/mcp/USER_ID/STANDARD_ID/sse?token=YOUR_TOKEN",\n      "headers": { "Authorization": "Bearer YOUR_TOKEN" }\n    }\n  }\n}`,
  },
  {
    id: "mcp-claude",
    title: "How to Connect to Claude Desktop",
    content: "Edit claude_desktop_config.json and add your CleanForge MCP server.",
    code: `{\n  "mcpServers": {\n    "cleanforge": {\n      "command": "npx",\n      "args": ["mcp-remote", "https://cleanforge.run.app/mcp/USER_ID/STANDARD_ID/sse?token=YOUR_TOKEN"]\n    }\n  }\n}`,
  },
  {
    id: "best-practices",
    title: "Best Practices",
    content: "• Always use kebab-case for files: payment-form.tsx\n• One feature = one folder in src/features\n• Keep components pure, no business logic\n• Store secrets in Secret Manager, never hardcode\n• Validate structure with validate_structure tool before committing",
  },
];

export const docsFaqs = [
  { q: "How private is my MCP?", a: "Your MCP is isolated per-user via Firebase Auth and Firestore rules. Only your token can access your standards." },
  { q: "Can I regenerate my token?", a: "Yes, go to My MCPs and click Regenerate Token. Old token will be invalidated immediately." },
  { q: "Does it work offline?", a: "The dashboard works offline for viewing, but generating and testing MCP requires connection to Cloud Run." },
];

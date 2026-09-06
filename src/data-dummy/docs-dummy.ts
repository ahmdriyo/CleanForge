import type { DocSection } from "@/types/standard";

export const docsSections: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    content: "Welcome to CleanForge! In just 3 steps you can make any AI follow your clean code rules.\n\nStep 1 — Create a Standard: Go to Forge, pick a framework (Next.js, Go, Laravel, etc.), and design your ideal folder structure. You can start from a Template or build from scratch.\n\nStep 2 — Generate MCP: Click Generate Private MCP Endpoint, choose how long it lasts (1 day to Never) and whether it needs a Bearer token, then copy your private URL.\n\nStep 3 — Connect your AI: Paste the URL into your AI tool (Cursor, Claude, Opencode, VS Code, etc. — see guides below). Your AI will then automatically call get_my_project_standard and generate code exactly like your Visual Tree. No more messy folders.",
  },
  {
    id: "forge-guide",
    title: "Forge Guide",
    content: "Forge Studio has 3 simple panels:\n\nLeft — Gemini Consultant: Chat with AI about your architecture. It remembers your history and can suggest a clean structure. Click Apply to Standard to add its suggestion to your tree.\n\nCenter — Project Structure: See your folders as a visual tree. Drag and drop to reorder, click Add Node to create a new folder or file (always kebab-case), and click any item to edit it on the right.\n\nRight — Inspector: Edit the details of the selected folder or file. Set the Rules (how to code there), Naming, Example Code (click Generate with Gemini for a starter), and Description. Changes save automatically, or click Save Standard at the top when you are done. What you save here is exactly what your AI will receive via MCP.",
  },
  {
    id: "mcp-overview",
    title: "MCP Overview — SSE + 4 Tools",
    content: "Single SSE endpoint per standard: https://host/mcp/{uid}/{standardId}. Auth: Header Authorization: Bearer <JWT> if Bearer required, else public. Tools: get_my_project_standard (MUST call first — returns folderStructure recursive + vibeCodingInstructions + flatList/filePaths/textTree + globalRules), get_folder_rules, scaffold_feature, validate_structure. Framework-agnostic (any root: src, app, lib, root, internal, project). Browser GET ?method=get_my_project_standard&raw=1 returns raw JSON for debug.",
    code: `// Browser / curl — verify complete data (same as AI receives)
curl -H "Authorization: Bearer <JWT>" "https://host/mcp/UID/ID?method=get_my_project_standard&raw=1"

// MCP POST (what Cursor/Claude sends)
{"method":"tools/call","params":{"name":"get_my_project_standard","arguments":{}}}`,
  },
  {
    id: "mcp-opencode",
    title: "How to Connect to Opencode",
    content: "Opencode (opencode.ai) — add to opencode.json at project root. Type remote, URL + headers. Restart opencode after saving (config not hot-reloaded).",
    code: `{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "cleanforge": {
      "type": "remote",
      "url": "https://cleanforge.run.app/mcp/UID/ID",
      "enabled": true,
      "headers": { "Authorization": "Bearer YOUR_TOKEN" }
    }
  }
}
// Public (no token): omit headers
// File: ./opencode.json  then: quit & restart opencode`,
  },
  {
    id: "mcp-cursor",
    title: "How to Connect to Cursor",
    content: "Cursor → Settings → Features → MCP Servers → Add new global MCP server. Paste URL + Bearer header (if required). Restart Cursor.",
    code: `{
  "mcpServers": {
    "cleanforge": {
      "url": "https://cleanforge.run.app/mcp/UID/ID",
      "headers": { "Authorization": "Bearer YOUR_TOKEN" }
    }
  }
}`,
  },
  {
    id: "mcp-claude-desktop",
    title: "How to Connect to Claude Desktop",
    content: "Edit claude_desktop_config.json (macOS: ~/Library/Application Support/Claude/claude_desktop_config.json, Windows: %APPDATA%\\Claude\\claude_desktop_config.json). Uses native SSE remote (Claude 2024.11+). Legacy proxy alternative via mcp-remote shown below.",
    code: `// Native SSE (recommended)
{
  "mcpServers": {
    "cleanforge": {
      "url": "https://cleanforge.run.app/mcp/UID/ID",
      "headers": { "Authorization": "Bearer YOUR_TOKEN" }
    }
  }
}

// Legacy via mcp-remote
{
  "mcpServers": {
    "cleanforge": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://cleanforge.run.app/mcp/UID/ID", "--header", "Authorization: Bearer YOUR_TOKEN"]
    }
  }
}`,
  },
  {
    id: "mcp-claude-code",
    title: "How to Connect to Claude Code",
    content: "Claude Code CLI — use claude mcp add with --transport sse.",
    code: `claude mcp add --transport sse cleanforge https://cleanforge.run.app/mcp/UID/ID --header "Authorization: Bearer YOUR_TOKEN"
# Public: omit --header
# Config stored in ~/.claude.json`,
  },
  {
    id: "mcp-windsurf",
    title: "How to Connect to Windsurf",
    content: "Windsurf (Codeium) → Settings → MCP → Add server. File: ~/.codeium/windsurf/mcp_config.json",
    code: `{
  "mcpServers": {
    "cleanforge": {
      "url": "https://cleanforge.run.app/mcp/UID/ID",
      "headers": { "Authorization": "Bearer YOUR_TOKEN" }
    }
  }
}`,
  },
  {
    id: "mcp-cline",
    title: "How to Connect to Cline (VS Code)",
    content: "VS Code → Cline extension → MCP Servers → Edit cline_mcp_settings.json",
    code: `{
  "mcpServers": {
    "cleanforge": {
      "url": "https://cleanforge.run.app/mcp/UID/ID",
      "headers": { "Authorization": "Bearer YOUR_TOKEN" },
      "disabled": false,
      "autoApprove": []
    }
  }
}`,
  },
  {
    id: "mcp-vscode",
    title: "How to Connect to VS Code (1.99+)",
    content: "VS Code native MCP (1.99+): create .vscode/mcp.json at project root.",
    code: `{
  "servers": {
    "cleanforge": {
      "url": "https://cleanforge.run.app/mcp/UID/ID",
      "headers": { "Authorization": "Bearer YOUR_TOKEN" }
    }
  }
}`,
  },
  {
    id: "mcp-generic",
    title: "How to Connect — Generic SSE / mcp-remote",
    content: "Any MCP client supporting SSE or stdio proxy. For legacy stdio-only clients, use mcp-remote.",
    code: `{
  "mcpServers": {
    "cleanforge": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://cleanforge.run.app/mcp/UID/ID", "--header", "Authorization: Bearer YOUR_TOKEN"]
    }
  }
}

// curl — verify
curl -H "Accept: text/event-stream" "https://cleanforge.run.app/mcp/UID/ID?method=tools/list"
curl -H "Authorization: Bearer TOKEN" "https://cleanforge.run.app/mcp/UID/ID?method=get_my_project_standard&raw=1"`,
  },
  {
    id: "best-practices",
    title: "Best Practices",
    content: "• AI MUST call get_my_project_standard first before any generation — it contains vibeCodingInstructions + full tree. • Use kebab-case: payment-form.tsx • One feature = one folder (use scaffold_feature) • Keep components pure, call get_folder_rules before writing • Validate with validate_structure • Test via Test Connection in Forge modal or My MCPs → Test",
  },
];

export const docsFaqs = [
  { q: "How private is my MCP?", a: "Your MCP is isolated per-user via Firebase Auth and Firestore rules. Only your token can access your standards." },
  { q: "Can I regenerate my token?", a: "Yes, go to My MCPs and click Regenerate Token. Old token will be invalidated immediately." },
  { q: "Does it work offline?", a: "The dashboard works offline for viewing, but generating and testing MCP requires connection to Cloud Run." },
];

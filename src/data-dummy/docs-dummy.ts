import type { DocSection } from "@/types/standard";

export const docsSections: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    content: "CleanForge helps you enforce clean code standards via private MCP endpoints. 1) Create a Standard in Forge (pick framework, edit folder tree & per-folder rules/exampleCode), 2) Generate Private MCP Endpoint (choose expiry 1 day..Never + Bearer token toggle), 3) Paste the snippet for your AI agent below — AI will then call get_my_project_standard and scaffold code 1:1 with your Visual Tree + Inspector. Supports all 10 frameworks (Next.js, Go, React, Vue, Express, NestJS, Laravel, FastAPI, Django, Flutter).",
  },
  {
    id: "forge-guide",
    title: "Forge Guide",
    content: "Forge Studio is 3-panel: Left Gemini Consultant (journal multi-turn, Apply to Standard), Center Project Structure (visual tree, drag-drop, kebab-case, custom scrollbar), Right Inspector (per-folder Rules, Naming, Example Code with Gemini generate, Description). Edits auto-save via PATCH /api/standards/[id] or locally until you click Save Standard. The saved folderStructure is exactly what MCP serves.",
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

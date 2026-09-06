# CleanForge — Clean Code, Every Vibe

> **Private Standard Journal + MCP Forge for Vibe Coders**
> Journal your architecture, brainstorm with Gemini, and give any AI agent a private MCP endpoint that enforces your clean code standards.

**Live:** https://cleanforge-55907076747.asia-southeast2.run.app &nbsp;|&nbsp; **Stack:** Next.js 15 · Firebase Auth · Firestore · Gemini 1.5 Flash · Secret Manager · Cloud Run

---

### Why CleanForge?

Vibe coding is fast — but messy. Ask AI to *build a todo app* and you get random folder structures, mixed naming, and instant tech debt.

**CleanForge fixes it at the source:**

1. **Journal** your ideal folder/file/code standards in a private space
2. **Brainstorm** with Gemini as a Clean Architecture consultant (multi-turn, isolated per user)
3. **Generate** a private SSE MCP endpoint (`/mcp/{uid}/{id}` + Bearer JWT) for Cursor / Claude / Opencode

AI then scaffolds via `get_my_project_standard` → `scaffold_feature` → `get_folder_rules` → `validate_structure` — **always following your tree, not guessing**.

---

### Key Features

**Forge Studio (3-Panel)**
* Left: Gemini Consultant (chat + Apply to Standard)
* Center: Visual Tree (drag-drop, kebab-case, 10 framework presets: Next.js, Go, React, Vue, Express, NestJS, Laravel, FastAPI, Django, Flutter + Custom)
* Right: Inspector (per-folder Rules, Naming, Example Code with Gemini generate, Description)

**Private MCP (SSE + Bearer)**
* Expiry: 1 day / 7 / 30 / 90 / 1 year / Never (default 1 day, public)
* Bearer toggle: Public (no header) or Private (JWT HS256, 30d, SHA-256 hash in Firestore, revoke on regenerate)
* 4 tools: `get_my_project_standard` (full tree + flatList + filePaths + vibeCodingInstructions), `get_folder_rules`, `scaffold_feature`, `validate_structure`

**Templates & Docs**
* 10 enriched templates — every folder/file has `rules` + `description` + `exampleCode` (ready for MCP vibe coding)
* Documentation with **On this page** blue active state + multi-agent How to Connect (Opencode, Cursor, Claude Desktop/Code, Windsurf, Cline, VS Code, Generic)

**Dashboard**
* 12 menus (6 Full: Dashboard, My Standards, Forge, My MCPs, Templates, Docs) + 6 Coming Soon — glassmorphism, mesh gradient, `custom-scrollbar` small violet.

---

### Tech Stack — 4 Pillars

| Pillar | Tech |
|---|---|
| **Auth** | Firebase Authentication (Google + Email) |
| **AI** | Gemini 1.5 Flash via `@google/generative-ai` + Secret Manager |
| **Isolated Storage** | Cloud Firestore `users/{uid}/standards|journals|mcps` + `firestore.rules` (uid isolation) |
| **Secrets** | Google Secret Manager (`GEMINI_API_KEY`, `MCP_JWT_SECRET` — never hardcoded) |
| **Deploy** | Single Service Cloud Run `output: 'standalone'` — FE + API + MCP SSE one URL |

---

### Project Structure

```
src/
├── app/
│   ├── page.tsx (landing, public)
│   └── (dashboard)/ (private, AuthGuard)
│       ├── dashboard/ standards/ forge/[id] forge/new
│       ├── mcps/ templates/ docs/ + 6 placeholders
│       └── api/ (standards, chat, journals, templates, mcps, stats)
│       └── mcp/[uid]/[standardId]/route.ts (SSE, Bearer optional)
├── features/ (landing, dashboard, forge, templates...)
├── server/ (infra/firebase-admin, secret-manager, repository, service, auth)
├── const/framework-templates.ts (10 enriched frameworks)
├── lib/firebase/client.ts (runtime window.__FIREBASE_CONFIG__ injection)
└── data-dummy/ (fallback, overridden by real API)
```

---

### Quick Start (Local)

```bash
# 1. Clone & install
git clone https://github.com/your-org/cleanforge.git
cd cleanforge
npm install

# 2. Env — copy and fill
cp .env.example .env
# Fill:
# NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cleanforge-c7ad6.firebaseapp.com
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=cleanforge-c7ad6
# FIREBASE_ADMIN_PROJECT_ID=...
# FIREBASE_ADMIN_CLIENT_EMAIL=...
# FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
# GCP_PROJECT_ID=cleanforge-c7ad6
# GEMINI_API_KEY=AIza...
# MCP_JWT_SECRET=random-32-char

# 3. Firestore rules (optional local verify)
firebase deploy --only firestore:rules --project cleanforge-c7ad6

# 4. Seed demo data
npm run seed # creates demo@cleanforge.dev / Demo123! + test@cleanforge.dev / Test123!

# 5. Dev
npm run dev # http://localhost:3000 (landing) and http://localhost:3000/dashboard (private)

# 6. Build check
npm run build # must be 31/31 static
```

> **No hardcode check:** `grep -r "AIza" --exclude-dir=node_modules` should be 0 — keys only via `getSecret()`.

---

### Using MCP with AI Agents

**Generate:** Forge → Generate Private MCP Endpoint → choose Expiry + Bearer → Generate → Copy endpoint + token (if private).

**Connect — pick your agent in the modal (8 options):**

* **Opencode** (`opencode.json`):
```json
{ "$schema": "https://opencode.ai/config.json", "mcp": { "cleanforge": { "type": "remote", "url": "https://.../mcp/UID/ID", "headers": { "Authorization": "Bearer TOKEN" }, "enabled": true } } }
```
* **Cursor** → Settings → Features → MCP Servers:
```json
{ "mcpServers": { "cleanforge": { "url": "https://.../mcp/UID/ID", "headers": { "Authorization": "Bearer TOKEN" } } } }
```
* **Claude Desktop** (`claude_desktop_config.json`), **Claude Code** (`claude mcp add --transport sse ...`), **Windsurf**, **Cline**, **VS Code** (`.vscode/mcp.json`), **Generic** (`mcp-remote`) — all in modal + Docs.

**Vibe code prompt:**
```
Call cleanforge get_my_project_standard first, then scaffold feature payment-gateway following the standard.
```
AI will: `get_my_project_standard` (full tree + vibeCodingInstructions) → `scaffold_feature` → `get_folder_rules` → `validate_structure` → generate `src/features/payment-gateway/...`.

**Test:** `curl -H "Authorization: Bearer TOKEN" "https://.../mcp/UID/ID?method=get_my_project_standard&raw=1"`

---

### Deploy to Cloud Run (Single Service)

See `doc-deploy-simple.md` (6 steps, mandatory only) and `doc-deploy.md` (detailed per stage).

**One-liner:**
```bash
gcloud run deploy cleanforge --source . --region asia-southeast2 --allow-unauthenticated \
  --service-account=cleanforge@cleanforge-c7ad6.iam.gserviceaccount.com \
  --set-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest,MCP_JWT_SECRET=MCP_JWT_SECRET:latest \
  --set-env-vars="GCP_PROJECT_ID=cleanforge-c7ad6,NEXT_PUBLIC_FIREBASE_API_KEY=...,NEXT_PUBLIC_FIREBASE_PROJECT_ID=..." \
  --set-build-env-vars="NEXT_PUBLIC_FIREBASE_API_KEY=...,NEXT_PUBLIC_FIREBASE_PROJECT_ID=..." \
  --memory 1Gi --port 3000 --project=cleanforge-c7ad6
```
Live URL: `https://cleanforge-55907076747.asia-southeast2.run.app`

---

### Hackathon Context

Built for **Gen AI Academy APAC Cohort 3 Ideathon** — theme *Personal Gemini Journal* pivoted to *Standard Journal*.

* **Original feature:** MCP Standard Forge (SSE + 4 tools) — beyond base spec, enforced via AI Studio Custom Instructions (Security Engineer constitution).
* **Judging:** Authenticity (10 enriched templates), Usability (2-min TTFS, glassmorphism), Stability (Zod, try/catch, TanStack retry), Security (per-user isolation, Secret Manager).
* **Deliverables:** Public repo + live Cloud Run URL + social post `#AccelerateAIwithCloudRun`.

---

### License

MIT — feel free to fork for your team standards.

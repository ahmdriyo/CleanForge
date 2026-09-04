# CleanForge — Project Context for AI Agents

> **Read this first if you are a new AI agent session.** This file + `rules_event.md` + 3 PRDs give you full project understanding in <2 minutes.

## 1. What is CleanForge?

**CleanForge = Developer Architecture Journal & Project Standard Forge** — a private, authenticated AI app for the **Gen AI Academy APAC Cohort 3 Ideathon** (theme: *Personal Gemini Journal*).

**Problem solved:** Vibe coders ask AI to "build a todo app" and get messy, inconsistent folder/file/code. No way to teach AI their personal clean standards.

**Solution:** Users sign in (Firebase Auth), journal & brainstorm their *project folder/file/code standards* with Gemini (multi-turn), all conversations saved isolated per-user in Firestore, then **generate a private MCP endpoint** (`/mcp/{uid}/{standardId}/sse` via SSE, Bearer JWT) that any AI Agent (Cursor/Claude) can call to generate code following their standards (`get_my_project_standard`, `get_folder_rules`, `scaffold_feature`, `validate_structure`).

## 2. Tech Stack (Must Match 4 Pillars `rules_event.md:5`)

- **Next.js 15** App Router, `src/`, TypeScript, Tailwind v4, `kebab-case`, `output: 'standalone'` for Cloud Run
- **UI:** shadcn/ui New York + `lucide-react` + `react-icons` + `framer-motion` (landing only) + glassmorphism (`backdrop-blur-xl` `bg-white/60`)
- **State:** TanStack Query v5, Zod + react-hook-form
- **Package:** `npm`
- **Google:** Firebase Auth, Firestore (isolated `users/{uid}/...`), Gemini API `gemini-1.5-flash` only via Secret Manager, Cloud Run single service, `GOOGLE_APPLICATION_CREDENTIALS` env
- **MCP:** `@modelcontextprotocol/sdk` SSE, Bearer JWT (`MCP_JWT_SECRET` HS256)

## 3. Folder Structure (Feature-Based)

```
src/
├── app/
│   ├── page.tsx                          # Landing (public)
│   ├── layout.tsx                        # Root: Inter font, MainProviders
│   └── (dashboard)/layout.tsx            # Private: Sidebar 12 menu + Header + MeshGradientBg + AuthGuard
│       ├── dashboard/                    # Dashboard Home
│       ├── standards/                    # My Standards
│       ├── forge/[id] & /forge/new      # Forge Studio 3-panel (Chat | Tree | Inspector)
│       ├── mcps/ templates/ docs/        # FULL (6)
│       └── analytics/activity/validations/playground/marketplace/settings # PLACEHOLDER Coming Soon
├── features/
│   ├── landing/ (navbar, hero + claymorphism, problem, solution, features, templates-preview, how-it-works, tech-stack, cta, footer)
│   ├── dashboard/ (stats, recent-standards, quick-actions)
│   ├── forge/ (chat-panel, visual-tree, folder-inspector, generate-mcp)
│   ├── standards/, mcps/, templates/, docs/, analytics/ etc.
│   └── * all kebab-case, sections/ split
├── providers/                            # MainProviders (QueryClient + Auth + Toaster) — single composition root
│   ├── MainProviders.tsx
│   ├── AuthProvider.tsx
│   └── index.ts
├── components/
│   ├── providers.tsx                     # Deprecated re-export from @/providers/MainProviders (keep for compat)
│   ├── layout/ (sidebar 12 menu, header, mesh-gradient-bg)
│   └── ui/ (shadcn)
├── const/ (base-api.ts axios, rest-endpoint.ts, upload.ts)
├── utils/ (action.ts cookies, debounce, pagination, etc.)
├── lib/ (utils, query-client, firebase/client, firebase/admin)
├── server/ (infra/firebase-admin, secret-manager, repository, service, auth) — BE (planned)
├── data-dummy/ (7 files: standards, forge, journals, templates, stats, mcps, docs)
├── types/standard.ts (FolderNode, Standard, ChatMessage)
└── hooks/, schemas/

docs/
├── prd-frontend-landing.md    # Monochrome purple, radial + glass, soft 3D claymorphism
├── prd-frontend-dashboard.md  # Glassmorphism modern light UI, 12 menu (6 FULL + 6 placeholder), Full English
└── prd-backend.md             # SSE + Flash only + Bearer JWT + array journals, single service

rules_event.md                 # 4 pillars, timeline 06 Sept, 4 criteria, rewards
data-rules.md                  # Mandatory submission rules
```

## 4. PRDs & Language

- **PRDs:** `docs/prd-frontend-landing.md` (monochrome violet), `docs/prd-frontend-dashboard.md` (glassmorphism, 12 menus, 6 FULL), `docs/prd-backend.md` (SSE, Flash, Bearer JWT) — **PRDs Indonesia, UI Full English**.
- **Dashboard FULL (6):** Dashboard, My Standards, Forge Studio, My MCPs, Templates, Documentation
- **Placeholder (6):** Analytics, Activity, Validations, Playground, Marketplace, Settings — `Coming Soon`

## 5. Current State & Conventions

- **Branch:** `dev` is main dev branch (landing + dashboard FE done, BE PRD done, BE code not yet). `main` is stable.
- **Build:** `npm run build` must pass — 16 routes static, `ƒ /forge/[id]` dynamic.
- **Providers:** All new providers go to `src/providers/*` and compose in `MainProviders.tsx`. `src/components/providers.tsx` is just re-export.
- **Kebab-case:** All feature files `contoh-file.tsx`, not `ContohFile.tsx`.
- **FE-First:** `data-dummy` used via TanStack `queryFn: () => dummy` — BE will replace with `fetch('/api/*')`.
- **Git:** Commit per feature/section, English UI, Indonesian PRD.

## 6. How to Continue

- **If you need landing:** see `docs/prd-frontend-landing.md` + `src/features/landing/`
- **If you need dashboard:** see `docs/prd-frontend-dashboard.md` + `src/features/dashboard|forge|...`
- **If you need backend:** see `docs/prd-backend.md` — start with `verify-id-token`, `standard-repository`, `gemini-service Flash`, `token-service JWT`, `mcp-service 4 tools SSE`
- **Do not write BE code yet** if user says so — FE adjustments first.

## 7. Quick Commands

- `npm install` — install
- `npm run build` — verify
- `npm run dev` — dev at `http://localhost:3000` (`/` landing, `/dashboard` private)
- `git push origin dev` — push dev


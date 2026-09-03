# PRD Backend — CleanForge

> **Project:** CleanForge - Developer Architecture Journal & Project Standard Forge
> **Scope:** Backend Only (API, MCP Server, Firebase, Gemini, Secret Manager)
> **Stack:** Next.js 15 Route Handlers, TypeScript, `src/server/{infra,repository,service,auth}`, Firebase Admin (GOOGLE_APPLICATION_CREDENTIALS), Firestore, Secret Manager, Gemini API, MCP SDK, npm
> **Status:** EMPTY — Akan dirincikan setelah frontend 100% sesuai keinginan
> **Docs Terkait:** `docs/prd-frontend-landing.md`, `docs/prd-frontend-dashboard.md`, `rules_event.md`

---

## Placeholder — Belum Dirincikan

Sesuai instruksi, PRD Backend dikosongkan untuk fase Frontend First.

### Scope yang Akan Datang (Outline)

- `src/server/infra/firebase-admin.ts` — init via `GOOGLE_APPLICATION_CREDENTIALS`
- `src/server/infra/secret-manager.ts` — get `GEMINI_API_KEY`, `mcpToken`
- `src/server/repository/standard-repository.ts` — Firestore CRUD `users/{uid}/standards`
- `src/server/repository/journal-repository.ts` — Firestore `users/{uid}/journals`
- `src/server/service/gemini-service.ts` — proxy Gemini multi-turn, Custom Instructions Security Engineer
- `src/server/service/mcp-service.ts` — `tools/list`, `tools/call` untuk 4 tools (`get_my_project_standard`, `get_folder_rules`, `scaffold_feature`, `validate_structure`)
- `src/server/auth/verify-id-token.ts` — verifikasi Firebase ID Token per-request
- `src/app/api/*` — Route Handlers (standards, chat, mcp)
- `src/app/mcp/[uid]/[standardId]/route.ts` — Single Service MCP (SSE/HTTP) di Cloud Run `rules_event.md:5`
- Firestore Rules (isolated per-user), Secret Manager, `Dockerfile` `output: 'standalone'`, `gcloud run deploy`

### Status
`EMPTY` — Menunggu approval frontend (landing + dashboard) sebelum dirincikan detail per-section seperti 2 PRD frontend.


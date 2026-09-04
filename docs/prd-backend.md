# PRD Backend — CleanForge

> **Project:** CleanForge - Developer Architecture Journal & Project Standard Forge
> **Scope:** Backend Only (API, MCP SSE Server, Firebase Auth, Firestore, Gemini Flash, Secret Manager)
> **Stack:** Next.js 15 Route Handlers, TypeScript, `src/server/{infra,repository,service,auth}`, Firebase Admin (`GOOGLE_APPLICATION_CREDENTIALS`), Firestore, Secret Manager, Gemini API (`gemini-1.5-flash` only), MCP SDK (SSE), npm
> **Architecture:** Single Service Cloud Run `output: 'standalone'` — FE + API + MCP SSE dalam 1 service
> **Language:** UI Full English, PRD Indonesia
> **Status:** READY FOR BUILD — Tanpa Team/Billing, 6 Placeholder tetap Coming Soon
> **Docs Terkait:** `docs/prd-frontend-landing.md`, `docs/prd-frontend-dashboard.md`, `rules_event.md` (4 Pilar), `data-rules.md`

---

## 1. Overview & Goals

### 1.1 Latar Belakang
Landing (`/`) menjelaskan problem vibe coding, dashboard (`/(dashboard)`) adalah **inti Personal Gemini Journal** `rules_event.md:4` yang di-pivot menjadi **Standard Journal**. User `sign in` via Firebase Auth `rules_event.md:5:19` → `journal/brainstorm multi-turn` dengan Gemini `rules_event.md:5:22` → disimpan di `private space` Firestore isolated `rules_event.md:5:23` + secrets via Secret Manager `rules_event.md:5:25`. Dari journal itu user **Generate MCP SSE privat** yang enforce standar ke AI Agent.

### 1.2 Tujuan Backend
- Ganti `src/data-dummy/*` FE-First dengan **real Google services** production-ready.
- Sediakan **6 FULL** pages real data: `Dashboard, My Standards, Forge Studio, My MCPs, Templates, Documentation` — 6 placeholder tetap `Coming Soon` English.
- Semua API harus `authenticated, isolated per-user, no hardcoded key, deployed on Cloud Run` `data-rules.md:3`.
- Original feature `Plus at least one original feature` `rules_event.md:91` = `MCP Standard Forge` SSE dengan 4 tools.

### 1.3 KPI
- API `p95 < 300ms` (Firestore + Zod)
- Firestore rules `100% isolated` — user A tidak bisa read `users/B/*`
- Gemini streaming `first token < 800ms` via Flash
- MCP `tools/list` & `tools/call` `< 100ms` (read Firestore cached)
- Cloud Run `cold start < 2s` (standalone)

### 1.4 Non-Goals
- Tidak ada Team / Billing
- Tidak ada MCP Streamable HTTP (hanya SSE)
- Tidak ada Gemini Pro (Flash only)
- Tidak ada subcollection untuk chat history (array di journal)
- 6 placeholder tidak ada BE full — tetap dummy/Coming Soon

---

## 2. Tech Stack & Konvensi

| Layer | Detail |
| :--- | :--- |
| **Runtime** | Next.js 15 App Router Route Handlers (`src/app/api/*`, `src/app/mcp/[uid]/[standardId]/route.ts`), TS 5 strict, `kebab-case` |
| **Auth** | `firebase 11` client (FE) + `firebase-admin 12` via `GOOGLE_APPLICATION_CREDENTIALS` `src/server/infra/firebase-admin.ts` |
| **DB** | `Cloud Firestore` via `adminDb` |
| **AI** | `@google/generative-ai 0.21` `gemini-1.5-flash` only via `src/server/service/gemini-service.ts` — key dari Secret Manager |
| **Secrets** | `@google-cloud/secret-manager 5` `src/server/infra/secret-manager.ts` |
| **Validation** | `Zod 3` + `react-hook-form` — schema shared `src/features/*/schemas` dipakai server juga |
| **MCP** | `@modelcontextprotocol/sdk` SSE |
| **Package** | `npm` |
| **Env** | `GOOGLE_APPLICATION_CREDENTIALS` (file path), `GCP_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_*` (public) |

**Konvensi File `kebab-case`:** `standard-repository.ts`, `verify-id-token.ts`, `gemini-service.ts`, `mcp-service.ts`.

---

## 3. Arsitektur Single Service Cloud Run

```
Browser (TanStack Query v5)
  → Next.js API Route (verify Bearer JWT ID Token → Zod → repository → adminDb)
  → Gemini Service (SecretManager.getSecret('GEMINI_API_KEY') → gemini-1.5-flash stream)
  → MCP SSE Route (verify Authorization: Bearer <MCP JWT> → mcp-service → adminDb read owned standard)
         ↓
Cloud Run (1 service, 1 Dockerfile, next.config.ts output: 'standalone')
  ├── /                              (landing)
  ├── /(dashboard)/*                 (dashboard FE)
  ├── /api/standards, /api/standards/[id], /api/journals, /api/chat, /api/templates
  └── /mcp/[uid]/[standardId]/route.ts  (SSE text/event-stream)

Secrets (Secret Manager):
  - GEMINI_API_KEY (latest)
  - MCP_JWT_SECRET (HS256 untuk sign Bearer JWT)
Env (Cloud Run):
  - GOOGLE_APPLICATION_CREDENTIALS (service account)
  - GCP_PROJECT_ID
```

**Mengapa Single Service:** Memenuhi `rules_event.md:5` `deployed on Cloud Run` dengan 1 URL prototype, simpel `gcloud run deploy cleanforge --source .`, FE + BE + MCP share domain `https://cleanforge.run.app`.

---

## 4. Security Model — 4 Pilar `rules_event.md:5`

### 4.1 User Identity (Firebase Auth `data-rules.md:19`)
- FE: `firebase/auth` `signInWithPopup` (Google) + email, simpan `ID Token` di memory, kirim `Authorization: Bearer <ID_TOKEN>` setiap `fetch('/api/*')`.
- BE: `src/server/auth/verify-id-token.ts` → `adminAuth.verifyIdToken(token)` → `uid`. Jika gagal → `401 Unauthorized` English JSON.

### 4.2 Isolated Data Storage (Firestore `data-rules.md:23`)
- Semua data di `users/{uid}/...` — `uid` dari verified token.
- Repository selalu pakai `adminDb` tapi **wajib cek `uid` param == token uid** di service layer (defense in depth, walau `adminDb` bypass rules).
- Client tidak pernah query Firestore langsung untuk standards/journals (hanya via API), menghindari leakage via rules misconfig.

### 4.3 Secure Key Management (Secret Manager `data-rules.md:25`)
- `GEMINI_API_KEY` tidak ada di `.env` atau client bundle — hanya `src/server/infra/secret-manager.ts` `accessSecretVersion('GEMINI_API_KEY')` + cache 5m.
- `MCP_JWT_SECRET` juga dari Secret Manager, dipakai `sign/verify` JWT.

### 4.4 No Hardcoded Secrets
- Validasi via `grep` di CI: tidak ada `sk-`, `AIza` di repo.

---

## 5. Data Model Firestore (Isolated Per-User)

```
users/{uid}
  standards/{standardId}
    - name: string (Zod min 3)
    - framework: "nextjs" | "nestjs" | "go"
    - description: string
    - folderStructure: FolderNode (JSON, mirror forge-dummy.ts)
    - globalRules: { namingConvention: "kebab-case"|"PascalCase"|"camelCase", stateManagement, styling, principles: string[] }
    - mcpEndpoint: string "/mcp/{uid}/{id}"
    - mcpTokenHash: string (SHA-256 of JWT, plaintext only shown once)
    - mcpJwt?: string (optional, bisa regenerate)
    - createdAt: Timestamp
    - updatedAt: Timestamp

  journals/{journalId}
    - standardId: string (FK ke standards/{id})
    - messages: ChatMessage[]  // ARRAY di dokumen (keputusan: array, bukan subcollection)
        { id, role: "user"|"assistant", content, timestamp: ISO, hasApply?: boolean }
    - updatedAt: Timestamp
    // Array dipilih karena <100 msg, 1 read = full history, update via arrayUnion, simple untuk multi-turn

  // Denormalisasi opsional untuk /mcps page cepat:
  mcps/{mcpId}
    - standardId, standardName, endpoint, tokenHash, status, usageCount, lastUsedAt, createdAt
```

**Tipe `FolderNode` (`src/types/standard.ts`):** `{ id, name, type: "folder"|"file", rules?, naming?, exampleCode?, description?, children?: FolderNode[] }`

**Index:** `users/{uid}/standards` `orderBy updatedAt desc` + `where framework ==`. `journals` `where standardId ==`.

---

## 6. Firestore Rules (Wajib `rules_event.md:8 Security`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/standards/{standardId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /users/{uid}/journals/{journalId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /users/{uid}/mcps/{mcpId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    // Tidak ada rule untuk collection root — deny by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Test Plan:** Emulator test — user A `GET /api/standards` tidak bisa lihat `users/B/standards/*` → `403`. `firestore.rules` di-commit di repo `rules_event.md:6` deliverables.

---

## 7. Secret Manager Design

| Secret | Nama di Secret Manager | Dipakai di | Cara Akses |
| :--- | :--- | :--- | :--- |
| **GEMINI_API_KEY** | `projects/{GCP_PROJECT_ID}/secrets/GEMINI_API_KEY` | `gemini-service.ts` | `getSecret('GEMINI_API_KEY')` cached |
| **MCP_JWT_SECRET** | `projects/{GCP_PROJECT_ID}/secrets/MCP_JWT_SECRET` | `token-service.ts` sign/verify JWT | `getSecret('MCP_JWT_SECRET')` |
| **MCP Token per-standard** | Tidak perlu Secret Manager per-token — simpan `hash` di Firestore. JWT plaintext hanya ditampilkan sekali di `GenerateMcpSection` FE. | `mcp-service.ts` | `hash(token) == mcpTokenHash` |

**Local dev:** `GOOGLE_APPLICATION_CREDENTIALS=./service-account.json` + `gcloud auth application-default login` — `getSecret` fallback ke `process.env.GEMINI_API_KEY` jika Secret Manager tidak tersedia (hanya dev).

**Cloud Run:** `--set-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest,MCP_JWT_SECRET=MCP_JWT_SECRET:latest`

---

## 8. Gemini Service — Flash Only, Multi-Turn, Custom Instructions

**File:** `src/server/service/gemini-service.ts`

**System Instruction (Constitution `rules_event.md:78` Security Engineer):**
```
You are a Security Engineer & Clean Architecture Consultant for CleanForge.
- Enforce: no hardcoded secrets, Firestore isolation per-user, kebab-case file naming, feature-based src/features, no cross-feature imports, clean code principles.
- Ask clarifying before finalizing structure.
- When user asks to apply, output JSON: { folderStructure: FolderNode, globalRules }.
- For example code, generate TypeScript React with Tailwind + shadcn, kebab-case file.
```

**Fungsi:**

```ts
// Dipakai POST /api/chat
export const chatWithGemini = async (args: {
  history: ChatMessage[]; // array dari journals/{id}.messages
  message: string; // new user message (Zod validated)
  standardContext?: FolderNode; // current tree for grounding
}): Promise<ReadableStream<string>> // stream to FE

// Dipakai folder-inspector Generate with Gemini
export const generateExampleCode = async (args: {
  folderPath: string; // e.g., "src/features/payment/components"
  rules: string;
  naming: NamingConvention;
}): Promise<string> // Flash, return code string
```

**Model:** `gemini-1.5-flash` only (sesuai keputusan Flash only) — `getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction })`.

**Streaming:** `POST /api/chat` → `streamText` → `ReadableStream` → FE `chat-panel.tsx` `useMutation` + `fetch` reader, simpan full `messages` array via `journal-repository` `arrayUnion`.

**Zod:** `chatSchema: { message: z.string().min(1).max(500), standardId: z.string() }` di handler.

---

## 9. MCP SSE Server Spec — SSE Only, Bearer JWT

**Route:** `src/app/mcp/[uid]/[standardId]/route.ts`

**Transport:** **SSE Only** (`Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`) — sesuai keputusan SSE, bukan Streamable HTTP.

**Auth:** **Header Bearer JWT** (keputusan Bearer JWT, bukan query). FE `GenerateMcpSection` akan tampilkan `curl -H "Authorization: Bearer <JWT>" https://cleanforge.run.app/mcp/{uid}/{id}`.

**JWT Spec (`src/server/service/token-service.ts`):**
- `payload: { uid, standardId, iat, exp: 30d }`
- `sign(payload, MCP_JWT_SECRET, { algorithm: "HS256" })`
- `verify(token, MCP_JWT_SECRET)` → cek `exp` + `uid == params.uid` + `standardId == params.standardId` + `hash(token) == Firestore mcpTokenHash` (revoke support).

**Flow:**
1. `GET /mcp/:uid/:standardId` — client (Cursor/Claude) kirim `Authorization: Bearer <JWT>` (via `mcp-remote` config `headers`).
2. Server verifikasi JWT → load `adminDb/users/{uid}/standards/{standardId}` (hanya jika `uid` milik JWT).
3. Jika valid, handle MCP protocol: `initialize`, `tools/list`, `tools/call`.

**4 Tools (Context Provider, Read-Only):**

| Tool | InputSchema (JSON) | Logic |
| :--- | :--- | :--- |
| `get_my_project_standard` | `{}` | Return `{ folderStructure, globalRules, textTree }` — full JSON standar user |
| `get_folder_rules` | `{ path: "src/features/auth" }` | Find `FolderNode` by path, return `{ rules, naming, exampleCode, description }` — 404 if not found |
| `scaffold_feature` | `{ featureName: "payment" }` | Validate `kebab-case`, return `{ suggestedPaths: ["src/features/payment/components/payment-card.tsx", "src/features/payment/hooks/use-payment-query.ts"], instructions: "Create in src/features/payment..." }` |
| `validate_structure` | `{ proposedPath: "src/payment.js" }` | Check `kebab-case` regex `^[a-z0-9-/\.]+$` + path exists in tree + naming match, return `{ valid: false, reason: "Must be in src/features/..., use kebab-case" }` |

**Implementasi:** `@modelcontextprotocol/sdk` `Server` + `SSEServerTransport` di Route Handler, atau manual `tools/list` JSON jika SDK tidak support Next.js. `usageCount++` di `mcps` doc setiap `tools/call` (untuk `/mcps` `Usage 42 calls`).

**Placeholder:** 6 pages `Analytics, Activity, Validations, Playground, Marketplace, Settings` tetap `Coming Soon` — tidak ada BE untuk mereka, tapi `Playground` placeholder nanti bisa test SSE `tools/list` via FE `fetch` dummy jika sempat.

---

## 10. API Route Handlers — 6 FULL Pages Real Data

Semua handler: `verifyIdToken` dari `Authorization: Bearer <ID_TOKEN>` → `uid` → Zod → `repository` → `adminDb`.

```
POST   /api/standards
  - Body: { name, framework, description, folderStructure, globalRules } (Zod: name min 3, framework enum, folderStructure FolderNode)
  - Action: create users/{uid}/standards/{id} (auto id), return 201 { standard }

GET    /api/standards
  - Query: ?framework=nextjs|nestjs|go&search=
  - Action: list own standards, filter/search in memory (6-12 docs), orderBy updatedAt
  - Used by: Dashboard recent-standards, My Standards grid

GET    /api/standards/[id]
  - Action: get one, 404 if not owned
  - Used by: Forge Studio load tree

PATCH  /api/standards/[id]
  - Body: { folderStructure?, globalRules?, name? } (partial Zod)
  - Action: update users/{uid}/standards/{id}, updatedAt now
  - Used by: visual-tree Add, folder-inspector Save

DELETE /api/standards/[id]
  - Action: delete standard + related journals + mcps, revoke JWT (delete hash)
  - Used by: (future) Delete button

POST   /api/standards/[id]/generate-mcp
  - Action: generate JWT (30d), hash save to mcpTokenHash, create/update mcps doc, return { endpoint: "/mcp/{uid}/{id}", token: jwt (plaintext once), endpointFull: "https://cleanforge.run.app/mcp/..." }
  - Used by: GenerateMcpSection

POST   /api/chat
  - Body: { standardId, message } (chatSchema)
  - Action: verify, load history journals/{journalId}, call gemini-service stream, append to messages array via journal-repository, return stream
  - Used by: chat-panel

GET    /api/journals?standardId=xxx
  - Action: list journals for standard, return messages array
  - Used by: chat-panel load history

GET    /api/templates
  - Public, no auth, return static 3 templates (Next.js Clean etc) from dummy or Firestore `templates` collection
  - Used by: Templates page, landing templates-preview

GET    /api/mcps
  - Action: list own mcps denormalized
  - Used by: My MCPs page

GET    /api/stats
  - Action: aggregate counts (totalStandards, activeMcps) via count queries
  - Used by: Dashboard stats-section
```

**Error Format English:** `{ error: "Message cannot be empty", code: 400 }`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

**Zod Messages English:** `Name must be at least 3 characters`, `Use kebab-case`, `Message cannot be empty`.

---

## 11. Server Directory Final (Kebab-Case)

```
src/server/
├── infra/
│   ├── firebase-admin.ts      // init via GOOGLE_APPLICATION_CREDENTIALS (done)
│   ├── secret-manager.ts      // getSecret(name) cached (done)
│   └── gemini-client.ts       // getGeminiModel() via SecretManager Flash
├── repository/
│   ├── standard-repository.ts // adminDb CRUD users/{uid}/standards
│   ├── journal-repository.ts  // adminDb array messages users/{uid}/journals
│   ├── mcp-repository.ts      // mcps denormalized
│   └── template-repository.ts // static 3
├── service/
│   ├── gemini-service.ts      // chatWithGemini, generateExampleCode (Flash)
│   ├── mcp-service.ts         // getMyStandard, getFolderRules, scaffold, validate
│   └── token-service.ts       // generateMcpJwt, verifyMcpJwt, hash
└── auth/
    ├── verify-id-token.ts     // Firebase ID Token
    └── verify-mcp-token.ts    // JWT Bearer

src/app/
├── api/
│   ├── standards/route.ts
│   ├── standards/[id]/route.ts
│   ├── standards/[id]/generate-mcp/route.ts
│   ├── chat/route.ts
│   ├── journals/route.ts
│   ├── templates/route.ts
│   ├── mcps/route.ts
│   └── stats/route.ts
└── mcp/
    └── [uid]/[standardId]/route.ts  // SSE

src/app/(dashboard)/layout.tsx — akan tambah AuthGuard (check ID Token, redirect /login if null)
```

---

## 12. Validation & Error Handling (Stability `rules_event.md:8`)

*   **Zod di FE + BE:** FE `react-hook-form` + `zodResolver` tampilkan English error, BE re-validate → 400.
*   **Stability:** Semua handler `try/catch` → `NextResponse.json({ error: English })` status 4xx/5xx, tidak `throw` unhandled → tidak crash. TanStack `retry: 1` untuk chat.
*   **Firestore Rules test:** `firebase emulators:exec --only firestore "npm run test:rules"` — pastikan cross-user deny.

---

## 13. Deployment Cloud Run (Single Service)

*   `next.config.ts` sudah `output: 'standalone'` `next.config.ts:1`.
*   `Dockerfile` multi-stage:
    ```dockerfile
    FROM node:20-alpine AS builder
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY . .
    RUN npm run build
    FROM node:20-alpine AS runner
    WORKDIR /app
    COPY --from=builder /app/.next/standalone ./
    COPY --from=builder /app/.next/static ./.next/static
    COPY --from=builder /app/public ./public
    CMD ["node", "server.js"]
    ```
*   Deploy:
    ```bash
    gcloud run deploy cleanforge \
      --source . \
      --allow-unauthenticated \
      --set-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest,MCP_JWT_SECRET=MCP_JWT_SECRET:latest \
      --set-env-vars=GCP_PROJECT_ID=cleanforge-xxx,FIREBASE_PROJECT_ID=xxx \
      --service-account=cleanforge@xxx.iam.gserviceaccount.com
    ```
*   `firestore.rules` di-deploy via `firebase deploy --only firestore:rules`.

---

## 14. Deliverables Mapping `rules_event.md:6` & `data-rules.md:47`

| Deliverable | File/API |
| :--- | :--- |
| **Public Repo** | `github.com/.../CleanForge` `README.md` + `firestore.rules` + `GOOGLE_APPLICATION_CREDENTIALS` instruksi |
| **Deployed URL** | `https://cleanforge-xxx.run.app` (FE + `/api/*` + `/mcp/*` SSE) — single Cloud Run URL |
| **Social Post** | LinkedIn/X dengan `#AccelerateAIwithCloudRun` + link repo + demo video (Forge → MCP → Cursor) |
| **Brief Description** | `README` jelaskan: Firebase Auth (login), Firestore isolated (private journals), Gemini Flash multi-turn (chat + custom instructions), Secret Manager (keys), Cloud Run (standalone) — semua `rules_event.md:5` |

---

## 15. Acceptance Criteria (English UI)

| ID | Story | AC |
| :--- | :--- | :--- |
| **B-01** | As a logged-in user, I create a standard | `POST /api/standards` creates `users/{uid}/standards/{id}`, returns 201, appears in Dashboard |
| **B-02** | As a user, I chat multi-turn | `POST /api/chat` streams Flash, saves to `journals/{id}.messages[]`, `GET /api/journals` returns history isolated |
| **B-03** | As a user, I generate MCP | `POST /api/standards/[id]/generate-mcp` returns `Authorization: Bearer <JWT>` + endpoint `https://.../mcp/{uid}/{id}`, JWT verify `200`, wrong uid `403` |
| **B-04** | As an AI Agent, I call MCP | `GET /mcp/{uid}/{id}` with `Authorization: Bearer JWT` → `tools/list` 4 tools, `tools/call get_my_project_standard` returns `folderStructure` |
| **B-05** | As a user, I validate no leakage | User A `GET /api/standards/B_id` → `404`, Firestore rules deny cross-read, `mcp` JWT of A cannot access B |
| **B-06** | As a judge, I see no hardcoded keys | `grep -r "AIza" --exclude-dir=node_modules` 0 hits, `GEMINI_API_KEY` only via `getSecret` |
| **B-07** | As FE dev, I replace dummy | `use-standards-query` `queryFn: () => fetch('/api/standards')` replaces `dummyStandards`, no dummy in prod build |
| **B-08** | As placeholder pages, I see Coming Soon | `Analytics, Activity, Validations, Playground, Marketplace, Settings` tetap `PlaceholderCard` English, no BE routes |

---

## 16. File Structure Final Backend (Ready)

```
src/
├── app/
│   ├── (dashboard)/layout.tsx (tambah AuthGuard)
│   ├── api/ (+ mcp)
│   └── mcp/[uid]/[standardId]/route.ts (SSE)
├── server/ (infra, repository, service, auth)
├── features/* (tetap, tapi hooks ganti ke fetch /api)
├── data-dummy/ (keep untuk fallback, tapi BE akan override)
├── lib/firebase/client.ts (FE), lib/firebase/admin.ts (re-export)
└── types/standard.ts (shared)
firestore.rules
firestore.indexes.json
Dockerfile
```

**Next Step Setelah PRD Ini Di-Approve:** Tulis code BE sesuai bab 5-10 (dimulai dari `verify-id-token`, `standard-repository`, `gemini-service Flash`, `token-service JWT`, `4 MCP tools SSE`) — **tidak ada Team/Billing, tidak ada Streamable HTTP, tidak ada Pro**.


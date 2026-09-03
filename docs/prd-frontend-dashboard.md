# PRD Frontend — Dashboard — CleanForge

> **Project:** CleanForge - Developer Architecture Journal & Project Standard Forge
> **Scope:** Frontend Dashboard Only (Private, Post-Auth) — Main App
> **Stack:** Next.js 15 (App Router, `src/`), TypeScript, Tailwind v4, shadcn/ui (New York), react-icons, TanStack Query v5, Zod + react-hook-form, npm, `GOOGLE_APPLICATION_CREDENTIALS` (env)
> **Architecture:** Feature-Based `src/features/{dashboard,forge,templates,standards,mcps,docs,analytics,...}/` + `kebab-case` + Section Split + `src/server/{infra,repository,service,auth}` (BE nanti) + `src/data-dummy/` (FE First, tanpa BE)
> **Language:** UI Full English (semua teks web English), PRD tetap Indonesia
> **Status:** READY FOR BUILD — Revisi Opsi A (6 Full + 6 Placeholder, Tanpa Team/Billing)
> **Docs Terkait:** `docs/prd-frontend-landing.md`, `rules_event.md` (4 Pilar), `data-rules.md`

---

## 1. Overview & Goals

### 1.1 Latar Belakang
Setelah landing mengonversi visitor, dashboard adalah **inti Personal Gemini Journal** `rules_event.md:4` yang di-pivot menjadi **Standard Journal**. User `sign in` via Firebase Auth `rules_event.md:5:19`, melakukan `journal + brainstorm` multi-turn dengan Gemini `rules_event.md:5:22`, semua disimpan di `private space` Firestore isolated per-user `rules_event.md:5:23`, dengan secrets via Secret Manager `rules_event.md:5:25`. Dari journal itu user **generate MCP privat** yang enforce standar ke AI Agent.

### 1.2 Tujuan Dashboard
- Private workspace untuk kelola **Standards** (CRUD visual folder tree + rules + example code) — **Full English UI**.
- **Forge Studio** 3-panel (Chat Gemini | Visual Tree | Inspector) sebagai *Journal* utama — English.
- Generate & kelola **MCP Endpoints** privat per-standard (`/mcp/{uid}/{id}/sse`).
- Browse & clone **3 Template** Clean Code + **Documentation** lengkap — 6 halaman full.
- Sidebar terlihat **kaya (12 menu)** agar produk terasa matang, bukan demo 3-4 menu — `Opsi A`.
- Dashboard harus terasa **premium, ringan, modern** — mendorong user membuat standard dalam <2 menit.

### 1.3 KPI
- Time to First Standard (TTFS) < 2 menit (dari `+ New Standard` -> `Save`).
- Chat -> `Apply to Standard` conversion > 50%.
- `Generate MCP` -> `Copy Link` > 70%.
- Empty state tidak bounce.
- Sidebar click coverage > 80% (user explore Docs & My Standards).

### 1.4 Target User
- Vibe coder yang sudah login, ingin standarisasi project Next.js/NestJS/Go.
- Team lead yang ingin share MCP link ke anggota tim (via token) — tanpa fitur Team/Billing dulu.

### 1.5 Non-Goals (FE First)
- Tidak ada koneksi Firestore real (pakai `data-dummy` dulu).
- Tidak ada call Gemini real (mock chat + tombol `Generate Example` hybrid manual + mock Gemini).
- Tidak ada deploy Cloud Run di fase FE (tapi `next.config.ts` sudah `standalone`).
- **Tidak ada Team / Billing** — sesuai request.
- 6 halaman placeholder hanya `Coming Soon` glass card, tidak full logic.

---

## 2. Tech Stack & Konvensi Dashboard

| Layer | Detail |
| :--- | :--- |
| **Framework** | Next.js 15 App Router, `src/`, `TS strict`, `output: 'standalone'` |
| **Styling** | Tailwind v4, shadcn New York, `tailwind-merge` |
| **Icons** | `lucide-react` (outline 1.5px) + `react-icons/fi, si` |
| **State/Data** | TanStack Query v5 (fetch dummy), Zod + react-hook-form untuk semua form |
| **Auth (FE)** | `firebase` client (mock guard dulu, nanti real), `AuthContext` di `src/app/layout.tsx` |
| **Package** | npm |
| **Env** | `GOOGLE_APPLICATION_CREDENTIALS` (dipakai `src/server/infra/firebase-admin.ts` nanti, FE tidak direct) |
| **Language** | **UI Full English** — semua label, CTA, empty, error English |

**Aturan `kebab-case`:** `standard-card.tsx`, `visual-tree.tsx`, `use-standards-query.ts`, `forge-schema.ts`.

---

## 3. Visual Design System — Glassmorphism Modern Light UI

Sesuai ketentuan style dashboard yang kamu beri.

### 3.1 Pola Warna & Latar Belakang (Background Effects)

**Color Pattern — Cool Tones:**
- **Base:** `ice blue` `#f0f9ff` / `cyan-50` `#ecfeff` / `lavender` `#ede9fe` / `slate-50` `#f8fafc` — dominan dingin, bukan warm.
- **Surface:** `white` `#ffffff` dengan opacity rendah (untuk glass).
- **Text Primary:** `slate-900` `#0f172a` / `indigo-950` `#1e1b4b` untuk metric besar.
- **Text Secondary:** `slate-500` `#64748b` / `slate-400` `#94a3b8` dengan rona kebiruan (`cool gray`).
- **Aksen Fungsional (ketat):**
  - `mint/neon green` `#10b981` / `emerald-400` untuk indikator positif (kenaikan, active, success).
  - `ungu pekat` `violet-900` `#4c1d95` / `indigo-600` `#4f46e5` untuk data grafik & active state.
  - `tosca` `teal-500` `#14b8a6` / `cyan-600` `#0891b2` untuk pembeda data.
  - Jangan pakai warna aksen di luar fungsi.

**Background Gradients & Effects — Mesh Gradient / Aurora:**
- Bukan flat, tapi **mesh gradient** — beberapa titik warna (biru, ungu lembut, cyan, putih) diburamkan ekstrem (`heavy blur`) sehingga seperti gumpalan cahaya organik.
- Implementasi `src/app/(dashboard)/layout.tsx`:
  ```tsx
  <div className="fixed inset-0 -z-10 bg-[#fbfbff]">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_10%,_#dbeafe_25%,_transparent_60%),radial-gradient(ellipse_70%_50%_at_80%_20%,_#ede9fe_25%,_transparent_60%),radial-gradient(ellipse_60%_40%_at_50%_90%,_#ecfeff_20%,_transparent_60%)] blur-[60px] opacity-70" />
    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent_60%,_#f8fafc_100%)]" />
  </div>
  ```
- Atau pakai `mesh` dengan `filter: blur(80px)` + `opacity 0.5` + `mix-blend-soft-light`.
- Pastikan tidak ganggu readability — `opacity 0.6-0.7`, `blur 60-80px`.

### 3.2 Gaya Kartu (Card Borders & Gradients) — Glassmorphism

**Efek Material:**
- Setiap panel/card pakai `backdrop-blur-xl` (atau `backdrop-blur-2xl` untuk card besar) yang mendistorsi mesh gradient di belakangnya.
- `bg-white/40` hingga `bg-white/60` (bukan solid).

**Card Gradient:**
- Permukaan kartu: `linear gradient` putih opasitas sangat rendah `from-white/40 to-white/10` atau `from-white/60 to-white/20`.
- Implementasi:
  ```tsx
  <Card className="bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(31,38,135,0.07),inset_0_1px_0_0_rgba(255,255,255,0.6)] rounded-[24px]">
  ```

**Card Border — Specular Highlight:**
- Ciri khas: `border 1px solid white` semi-transparan `border-white/40` atau `border-white/50`.
- Fungsi sebagai pantulan cahaya ujung kaca, memisahkan kartu dari background tanpa kaku.
- Tambahan: `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)]` untuk highlight atas.
- Radius besar: `rounded-[20px]` / `rounded-[24px]` / `rounded-2xl` (jangan `rounded-md`).

**Contoh Token Card:**
```tsx
// Card Glass
className="bg-white/50 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(31,38,135,0.07)] rounded-[24px]"
// Card Hover
className="hover:bg-white/60 hover:border-white/60 hover:shadow-[0_12px_40px_rgba(31,38,135,0.1)] transition-all duration-300"
// Metric Card (dengan aksen)
className="bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-xl border border-white/50"
```

### 3.3 Tipografi

**Font:** `Inter` / `SF Pro Display` / `Plus Jakarta Sans` via `next/font/google` (`--font-inter`), sama dengan landing untuk konsistensi.

**Hierarki Data:**

| Elemen | Style | Tailwind |
| :--- | :--- | :--- |
| **Metric Angka Utama** | Bold/SemiBold, masif `text-3xl md:text-4xl` | `text-3xl font-bold tracking-tight text-slate-900` |
| **Label Kategori** | Regular, kecil `text-xs md:text-sm` | `text-sm font-normal text-slate-500` |
| **Section Title** | Medium, `text-lg` | `text-lg font-semibold tracking-tight text-slate-900` |
| **Kategori Menu** | Uppercase tracking-widest, `text-[11px]` | `text-[11px] font-semibold uppercase tracking-widest text-slate-400` |
| **Body/Secondary** | Regular, `leading-relaxed` | `text-sm leading-relaxed text-slate-600` |
| **Badge/Indicator** | Medium, `text-xs` | `text-xs font-medium` |

**Warna Teks:**
- Utama: `text-slate-900` / `text-violet-950`
- Sekunder: `text-slate-500` (kebiruan, jangan `gray-500` warm)
- Muted: `text-slate-400`

**Full English:** Semua teks UI English — `Dashboard`, `My Standards`, `Forge Studio`, `Generate MCP`, `No standards yet`, `Create your first clean standard`, `Private Standard Journal`, dll.

### 3.4 Gaya Navigasi (Sidebar Style)

**Teks & Kategori:**
- Judul kelompok (`OVERVIEW`, `FORGE`, `MCP & TEMPLATES`, `SYSTEM`) — `uppercase tracking-widest text-[11px] font-semibold text-slate-400` — tidak mendominasi.

**Ikonografi:**
- **Outline icons** minimalis, `stroke 1.5px`, tanpa `fill` saat tidak aktif (`lucide-react` default outline).
- Konsisten ketebalan, `w-5 h-5`, `stroke-[1.5]`.
- Warna inactive: `text-slate-500`.
- Pakai `react-icons` untuk stack (Next.js) jika perlu, tapi sidebar utama `lucide-react`.

**Active State:**
- Highlight pakai `pill` `rounded-full` warna **ungu transparan/pastel** `bg-violet-100` atau `bg-violet-500/10` + `border border-violet-200/50`.
- Warna ikon & teks berubah dari `slate-500` -> `violet-900` / `indigo-600` (`text-violet-900 font-medium`).
- Contoh:
  ```tsx
  // Active
  className="bg-violet-100 text-violet-900 rounded-full px-3 py-2 font-medium shadow-sm border border-violet-200/50"
  // Inactive
  className="text-slate-500 hover:text-slate-900 hover:bg-white/40 rounded-full px-3 py-2"
  ```

**Hover State:**
- Implisit: `hover:text-slate-900` atau `hover:bg-white/40` (`bg-white/40 backdrop-blur-sm`) dengan opasitas jauh di bawah active.
- Transition: `transition-colors duration-200`.

**Sidebar Container:**
- `bg-white/30 backdrop-blur-xl border-r border-white/40` — bukan solid white.
- Width: `w-[280px]` desktop, `Sheet` mobile (shadcn).

---

## 4. Information Architecture & Routing — Expanded 12 Menu

**Group Route:** `src/app/(dashboard)/` (private, AuthGuard)

```
src/app/(dashboard)/
├── layout.tsx                // Sidebar (12 menu) + Header + Mesh Gradient BG + AuthGuard
├── dashboard/page.tsx        // Dashboard Home — overview (FULL)
├── standards/page.tsx        // My Standards — list & search (FULL)
├── forge/[id]/page.tsx       // Forge Studio — 3 panel (FULL)
├── forge/new/page.tsx        // New Standard — create flow (FULL, part of Forge)
├── mcps/page.tsx             // My MCPs — list endpoints (FULL)
├── templates/page.tsx        // Browse Templates (FULL)
├── docs/page.tsx             // Documentation (FULL) — NEW, 6th full page
│
├── analytics/page.tsx        // Analytics — charts (PLACEHOLDER Coming Soon)
├── activity/page.tsx         // Activity — timeline (PLACEHOLDER)
├── validations/page.tsx      // Validations — run checks (PLACEHOLDER)
├── playground/page.tsx       // Playground — MCP Inspector (PLACEHOLDER)
├── marketplace/page.tsx      // Marketplace — shared standards (PLACEHOLDER)
└── settings/page.tsx         // Settings — profile, secrets (PLACEHOLDER, includes Help)
```

**Sidebar Menu 12 Items — 4 Kategori (Full English, Glassmorphism):**

```
- OVERVIEW
  - Dashboard          (/dashboard)       [LayoutDashboard]  — FULL
  - Analytics          (/analytics)       [BarChart3]        — PLACEHOLDER Coming Soon
  - Activity           (/activity)        [Clock]            — PLACEHOLDER

- FORGE
  - My Standards       (/standards)       [Layers]           — FULL
  - Forge Studio       (/forge/new or /forge/[id]) [Hammer] — FULL (inti journal)
  - Validations        (/validations)     [ShieldCheck]      — PLACEHOLDER
  - Playground         (/playground)      [FlaskConical]     — PLACEHOLDER

- MCP & TEMPLATES
  - My MCPs            (/mcps)            [Plug]             — FULL
  - Templates          (/templates)       [LayoutTemplate]   — FULL
  - Marketplace        (/marketplace)     [Store]            — PLACEHOLDER

- SYSTEM
  - Documentation      (/docs)            [BookOpen]         — FULL (6th)
  - Settings           (/settings)        [Settings]         — PLACEHOLDER (includes Help & Feedback)
```

**Keterangan:**
- **FULL (6):** `Dashboard, My Standards, Forge Studio, My MCPs, Templates, Documentation` — dibangun penuh dengan dummy data, glass cards, interaktif.
- **PLACEHOLDER (6):** `Analytics, Activity, Validations, Playground, Marketplace, Settings` — hanya tampilkan `Coming Soon` glass card (`bg-white/40 backdrop-blur-xl border border-dashed border-white/50 rounded-[24px] p-12 text-center` + icon outline + `Coming Soon` badge `bg-violet-100` + desc English) — agar sidebar terlihat kaya tanpa overload scope. Tanpa Team/Billing.

**Header (Top Bar):**
- `bg-white/40 backdrop-blur-xl border-b border-white/40 sticky top-0 z-30`
- Left: `Breadcrumb` (Dashboard / Forge / Standard Name) — English
- Right: `Search` (cmdk placeholder), `Notifications` (bell outline), `User Menu` (avatar `bg-gradient-to-br from-violet-500 to-indigo-600` + `Logout` English)

**Routing FE First:** Semua `page.tsx` hanya import dari `src/features/*`, tidak ada logic fetch langsung. Placeholder pages import dari `src/features/{analytics,activity,...}/components/placeholder-section.tsx`.

**Full English Note:** Semua menu label, kategori, breadcrumb, button, empty, toast English. Contoh: `My Standards`, `Forge Studio`, `My MCPs`, `Documentation`, `Coming Soon — This feature is under construction`.

---

## 5. Section Breakdown — Dashboard Home (`/dashboard`) — FULL

**File:** `src/features/dashboard/components/` — dipanggil `src/app/(dashboard)/dashboard/page.tsx` -> `<DashboardPage />`

### 5.1 `dashboard-header-section.tsx`
- **Layout:** `flex justify-between items-center mb-8`
- **Left:** Greeting `Good morning, Alex` (`text-2xl font-semibold tracking-tight text-slate-900`) + sub `Manage your clean standards` (`text-sm text-slate-500`) — English
- **Right:** `Button` glass `+ New Standard` (`bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-full shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30` + `backdrop-blur`) -> `/forge/new`
- **Style:** Floating di atas mesh gradient.

### 5.2 `stats-section.tsx` (Metrics)
- **Grid 4 Cards** (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`):
  1. `Total Standards` — angka `12` (`text-3xl font-bold text-slate-900`) + label `Standards` + icon `Layers` + trend `+2 this week` (`text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5 text-xs`)
  2. `Active MCPs` — `8` + `MCP Endpoints` + dot hijau `bg-emerald-400`
  3. `Templates Used` — `3` + `From library`
  4. `Avg. Features` — `5.2` + `Per standard`
- **Card Style Glassmorphism:** `bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-xl border border-white/40 rounded-[20px] p-5 shadow-[0_8px_32px_rgba(31,38,135,0.07)]`
- **Typography:** Angka `font-bold`, label `text-xs uppercase tracking-widest text-slate-400`, trend `text-xs font-medium text-emerald-600`.

### 5.3 `recent-standards-section.tsx`
- **Header:** `Recent Standards` (`text-lg font-semibold`) + `View All` (`text-sm text-violet-600 hover:text-violet-700`) -> `/standards`
- **Grid 3 Cards** (`grid md:grid-cols-2 lg:grid-cols-3 gap-4`):
  - `StandardCard` — `bg-white/50 backdrop-blur-xl border border-white/40 rounded-[20px] p-5 hover:bg-white/60 transition`
    - Top: `Framework Badge` (`Next.js 15` `bg-slate-900 text-white rounded-full text-xs`) + `Status` (`Active` `bg-emerald-50 text-emerald-700 border-emerald-200`)
    - Middle: Title `My Next.js Clean Standard` (`font-semibold text-slate-900`) + Desc `App Router + src/features` (`text-sm text-slate-500`) + Mini tree preview (3 baris `src/features/auth` dengan `text-xs font-mono text-slate-400`)
    - Bottom: `Updated 2h ago` + `MCP: Active` dot + `Open in Forge` button (`rounded-full bg-violet-600 text-white text-xs`) — English
- **Empty State:** `bg-white/30 backdrop-blur-xl border border-dashed border-white/50 rounded-[24px] p-12 text-center` — Illustration `FolderOpen` outline, `No standards yet` (`font-semibold`), `Create your first clean standard` + `Browse Templates` + `Start from Scratch` (2 buttons glass) — English.
- **Dummy:** `src/data-dummy/standards-dummy.ts` -> `use-standards-query.ts` (TanStack).

### 5.4 `quick-actions-section.tsx`
- **Cards 2:** `Clone Template` -> `/templates` + `Go to Documentation` -> `/docs` (ganti dari Import GitHub) — style glass `bg-white/40 backdrop-blur-xl`. English.

---

## 6. Section Breakdown — Forge Studio (`/forge/[id]` & `/forge/new`) — FULL, INTI JOURNAL

**Route:** `src/app/(dashboard)/forge/[id]/page.tsx` & `src/app/(dashboard)/forge/new/page.tsx` -> `<ForgePage />`
**Layout:** `ResizablePanelGroup` shadcn (`direction="horizontal"`) — 3 panel resizable, `minSize 20`. Mobile: `Tabs` (Chat | Tree | Inspector).

### 6.1 `forge-header-section.tsx`
- **Bar:** `bg-white/40 backdrop-blur-xl border border-white/40 rounded-full px-4 py-2 flex justify-between items-center mb-4`
- **Left:** `Standard Name` (editable inline `Input` Zod, English placeholder `e.g., My Next.js Clean Standard`) + `Framework Badge` + `Last saved 5m ago` (`text-xs text-slate-400`)
- **Right:** `Save` (`bg-violet-600 rounded-full` English) + `Generate MCP` (`bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full shadow` English) + `More` (`Ghost`).
- English semua.

### 6.2 Left Panel — `chat-panel.tsx` (Journal Brainstorming)
- **Container:** `bg-white/40 backdrop-blur-xl border border-white/40 rounded-[20px] flex flex-col h-full`
- **Header:** `Gemini Consultant` (`text-sm font-semibold text-slate-900`) + `Online` dot emerald + `Clear Chat` (ghost English)
- **Messages:** `flex-1 overflow-y-auto p-4 space-y-4` — bubbles:
  - User: `bg-violet-600 text-white rounded-2xl rounded-br-sm ml-8 p-3 text-sm`
  - Gemini: `bg-white/70 backdrop-blur border border-white/50 rounded-2xl rounded-bl-sm mr-8 p-3 text-sm text-slate-700` — dengan `Apply to Standard` button (`text-xs bg-violet-100 text-violet-700 rounded-full` English) di bawah response yang mengandung JSON.
- **Input:** `bg-white/60 backdrop-blur border border-white/50 rounded-full px-4 py-3 flex gap-2` — `Input` (`border-0 bg-transparent focus:ring-0 placeholder:text-slate-400` English placeholder `Ask Gemini about your structure...`) + `Send` (`rounded-full bg-violet-600 w-8 h-8`) — Zod `chat-schema.ts` (`message: z.string().min(1)`).
- **Dummy:** `src/data-dummy/journals-dummy.ts` (English messages) + `TanStack mutation` mock.

### 6.3 Center Panel — `visual-tree.tsx` (Folder Visualization)
- **Container:** `bg-white/50 backdrop-blur-xl border border-white/40 rounded-[20px] p-4 h-full overflow-auto`
- **Header:** `Project Structure` (`font-semibold` English) + `kebab-case` badge (`bg-slate-100 text-slate-600 rounded-full text-xs`) + `+ Add Folder/File` (`outline rounded-full border-white/50 bg-white/40` English)
- **Tree:** Recursive `FolderNode` — folder `FiFolder` (react-icons) + file `FiFile` — indent `ml-4 border-l border-white/30`
  - Folder row: `hover:bg-white/40 rounded-full px-2 py-1 cursor-pointer` + `selected: bg-violet-100 text-violet-900 rounded-full`
  - File row: `text-sm font-mono text-slate-600`
  - Visual: `src/features/...` dengan `...` collapse
- **Interactions:** Click -> set `selectedFolder` (lift to ForgePage), Add -> Dialog Zod (`name: z.string().regex(/^[a-z0-9-]+$/)` untuk kebab-case), Delete -> confirm English (`Delete this folder?`).
- **Empty Tree:** `bg-white/30 border-dashed rounded-[16px] p-8 text-center` + `Create root folder` English.

### 6.4 Right Panel — `folder-inspector.tsx` (Rules + Example)
- **Container:** `bg-white/40 backdrop-blur-xl border border-white/40 rounded-[20px] p-4 h-full overflow-auto`
- **Header:** `Inspector` (`font-semibold` English) + `selectedPath` (`text-xs font-mono text-slate-500 bg-white/50 rounded-full px-2 py-1`)
- **Form (Zod + react-hook-form, English labels):**
  - `Rules` (Textarea) — `Label` `RULES` (`uppercase tracking-widest text-[11px] text-slate-400`) + `Textarea` (`bg-white/60 backdrop-blur border-white/50 rounded-xl focus:border-violet-300`) — placeholder `Each feature in its own folder...`
  - `Naming Convention` (Input) — `kebab-case` / `PascalCase` badge + `Input` (`bg-white/60 rounded-xl`) English
  - `Example Code` (Code Editor) — `Label` `EXAMPLE CODE` + `pre` (`bg-slate-900 rounded-xl p-3 text-xs font-mono text-violet-100 overflow-auto`) + `Copy` + `Generate with Gemini` (`bg-violet-100 text-violet-700 rounded-full text-xs` English) — hybrid manual + auto. Zod `exampleCode: z.string().optional()`.
  - `Description` (Input) English
- **Actions:** `Save Inspector` (`bg-violet-600 rounded-full w-full` English) + `Reset` English.
- **Empty:** Jika tidak ada folder selected -> `Select a folder to inspect` (`text-sm text-slate-400 text-center py-12` English).

### 6.5 Generate MCP Section (Dialog)
**File:** `src/features/forge/components/sections/generate-mcp-section.tsx` — `Dialog` dari `forge-header`.

- **Trigger:** `Generate MCP` -> `Dialog` (`bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[24px]`)
- **Content English:**
  - Preview JSON (`bg-slate-900 rounded-xl p-4 font-mono text-xs text-emerald-300 overflow-auto max-h-48`)
  - Secret Input — `Label` `API KEY (Optional)` + `Input type=password` (`bg-white/60 rounded-xl`) — Zod `secret: z.string().optional()` — nanti via Secret Manager, FE masked.
  - Generated Link Card — `bg-gradient-to-br from-violet-50 to-white border border-violet-200 rounded-xl p-3` — `https://cleanforge.run.app/mcp/{uid}/{id}/sse` (`font-mono text-xs`) + `Copy` (`Check` jika copied) + `Private` badge (`bg-emerald-50 text-emerald-700`)
  - Instructions — `How to Connect` + code block `claude_desktop_config.json` snippet + `Test Connection` (`outline rounded-full` English) — Test call `tools/list` mock.
  - Actions: `Generate` (`bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full` English) + `Regenerate Token` (link English).

---

## 7. Section Breakdown — My Standards (`/standards`) — FULL

**File:** `src/features/standards/components/` — `src/app/(dashboard)/standards/page.tsx` -> `<StandardsPage />`

### 7.1 `standards-header-section.tsx`
- Title `My Standards` (`text-2xl font-bold tracking-tight text-slate-900` English) + Desc `Manage all your clean standards` (`text-sm text-slate-500` English) — floating.
- Right: `Search` (`Input` `bg-white/60 backdrop-blur border-white/40 rounded-full` English placeholder `Search standards...`) + `Filter by Framework` (`Select` shadcn English) + `+ New Standard` (`bg-violet-600 rounded-full` English)

### 7.2 `standards-grid-section.tsx`
- **Grid 6 Cards** (`grid md:grid-cols-2 lg:grid-cols-3 gap-4`) dari `src/data-dummy/standards-dummy.ts` (English data):
  - `StandardCard` — sama seperti `recent-standards-section` tapi full: `Framework Badge` + `Status Active` + `Title` + `Desc` + `Mini tree` + `Updated 2h ago` + `MCP: Active` + `Open in Forge` + `Duplicate` + `Delete` (English)
  - Hover `bg-white/60`, selected `ring-2 ring-violet-500`
- **Empty/Search Empty:** Glass dashed + `No standards found` English + `Clear search` English.
- **Pagination (dummy):** `Showing 6 of 12` English.

---

## 8. Section Breakdown — My MCPs (`/mcps`) — FULL

**File:** `src/features/mcps/components/` — `src/app/(dashboard)/mcps/page.tsx`

### 8.1 `mcps-header-section.tsx`
- Title `My MCPs` English + Desc `Manage your private MCP endpoints` English

### 8.2 `mcps-list-section.tsx`
- **List 3-4 MCP Cards** (`space-y-4`) dari `src/data-dummy/mcps-dummy.ts` (English):
  - Card `bg-white/50 backdrop-blur-xl border border-white/40 rounded-[20px] p-5`
    - Left: `MCP Name` (`My Next.js Clean MCP` English) + `Standard: My Next.js Clean Standard` (`text-sm text-slate-500`) + `Endpoint` (`font-mono text-xs bg-slate-900 text-emerald-300 rounded-lg px-2 py-1`)
    - Right: `Status Active` (`bg-emerald-50 text-emerald-700 rounded-full` English) + `Usage 42 calls` (`text-xs`) + `Copy Link` (`outline rounded-full` English) + `Regenerate Token` (link English) + `Test` (`ghost`)
- **Empty:** `No MCPs yet — Generate from Forge Studio` English + `Go to Forge` button.

---

## 9. Section Breakdown — Templates (`/templates`) — FULL

**File:** `src/features/templates/components/` — `src/app/(dashboard)/templates/page.tsx` -> `<TemplatesPage />`

### 9.1 `templates-header-section.tsx`
- Title `Browse Templates` (`text-2xl font-bold tracking-tight` English) + Desc `Start with proven clean standards` (`text-sm text-slate-500` English) — floating.

### 9.2 `template-grid-section.tsx`
- **Grid 3 Cards** (`grid md:grid-cols-3 gap-4`) dari `src/data-dummy/templates-dummy.ts` (English):
  ```ts
  dummyTemplates = [
    { id: 'nextjs-clean', name: 'Next.js Clean Architecture', framework: 'Next.js 15', structure: 'src/features/auth, src/features/forge', icon: SiNextdotjs, accent: 'violet', rules: 'kebab-case, App Router' },
    { id: 'nestjs-modular', name: 'NestJS Modular', framework: 'NestJS', structure: 'src/modules/user', icon: SiNestjs, accent: 'indigo' },
    { id: 'go-clean', name: 'Go Clean Arch', framework: 'Go', structure: 'internal/user', icon: SiGo, accent: 'teal' },
  ]
  ```
- **Card:** `bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-xl border border-white/40 rounded-[20px] p-5 hover:bg-white/70 hover:shadow-lg transition`
  - Top: Framework icon `w-10 h-10 rounded-2xl bg-white shadow-sm border border-white/50` + `Framework Badge` (`bg-slate-900 text-white rounded-full` English)
  - Middle: Title `font-semibold` English, Desc `text-sm text-slate-500` English, Mini tree `font-mono text-xs text-slate-400`
  - Bottom: `Use Template` (`bg-violet-600 text-white rounded-full w-full` English) -> clone ke `standards-dummy` + toast `sonner` English + redirect `/forge/{newId}`

---

## 10. Section Breakdown — Documentation (`/docs`) — FULL (6th)

**File:** `src/features/docs/components/` — `src/app/(dashboard)/docs/page.tsx` -> `<DocsPage />`

### 10.1 `docs-header-section.tsx`
- Title `Documentation` English + Desc `Learn how to connect your MCP to any AI Agent` English — floating.

### 10.2 `docs-content-section.tsx`
- **Layout 2 Kolom:** `Left: Sidebar Docs Nav` (`Getting Started`, `Forge Guide`, `MCP Setup`, `Best Practices`) — `bg-white/40 backdrop-blur-xl border border-white/40 rounded-[16px] p-4` + active `bg-violet-100 rounded-full`, **Right: Content** glass cards.
- **Cards:**
  1. `Getting Started` — Steps `1. Create Standard -> 2. Brainstorm with Gemini -> 3. Generate MCP` English + visual mini tree.
  2. `How to Connect to Cursor` — Code block `json` (`bg-slate-900 text-emerald-300 rounded-xl p-4 font-mono text-xs`) + `Copy` English
  3. `How to Connect to Claude Desktop` — `claude_desktop_config.json` snippet English
  4. `Best Practices` — List `kebab-case`, `src/features`, `clean code` English + `Tips` callout `bg-violet-50 border-violet-200 rounded-xl`
- **Style:** Semua card `bg-white/50 backdrop-blur-xl border border-white/40 rounded-[20px] p-6` English, code `bg-slate-900`.

### 10.3 `docs-faq-section.tsx`
- Accordion shadcn `FAQ` English — `How private is my MCP?`, `Can I regenerate token?` — glass.

---

## 11. Section Breakdown — Placeholder Pages (6) — Coming Soon

Semua placeholder pakai komponen reusable `src/components/ui/placeholder-card.tsx` — **Full English**.

**File:** `src/features/{analytics,activity,validations,playground,marketplace,settings}/components/placeholder-section.tsx`

- **Container:** `bg-white/40 backdrop-blur-xl border border-dashed border-white/50 rounded-[24px] p-12 text-center max-w-2xl mx-auto mt-12`
- **Icon:** Outline `BarChart3`, `Clock`, `ShieldCheck`, `FlaskConical`, `Store`, `Settings` — `w-16 h-16 bg-white/60 rounded-3xl border border-white/50 flex items-center justify-center text-violet-600 mx-auto mb-4`
- **Title:** `Coming Soon` (`text-xl font-semibold text-slate-900` English)
- **Desc:** `This feature is under construction. We're building something amazing for you.` (`text-sm text-slate-500` English) + specific desc per page:
  - Analytics: `Track your standards performance and MCP usage with beautiful charts.`
  - Activity: `View your recent actions and standard history.`
  - Validations: `Validate your project structure against your clean standards.`
  - Playground: `Test your MCP tools directly without leaving CleanForge.`
  - Marketplace: `Discover and share community standards.`
  - Settings: `Manage your profile, secrets, and preferences. Help & Feedback included.`
- **Badge:** `Coming Soon` (`bg-violet-100 text-violet-700 border-violet-200 rounded-full text-xs` English)
- **CTA:** `Go back to Dashboard` (`rounded-full bg-violet-600 text-white` English) + `Notify Me` (disabled `opacity-50` English)

**Routes:** Masing-masing `src/app/(dashboard)/{analytics,activity,validations,playground,marketplace,settings}/page.tsx` -> `<PlaceholderPage feature="analytics" />`

---

## 12. Data & State Management (FE First, Dummy — English Data)

**Folder:** `src/data-dummy/` (sesuai request)

| File | Isi | Dipakai |
| :--- | :--- | :--- |
| `standards-dummy.ts` | `dummyStandards: Standard[]` 6 items (English names: `My Next.js Clean Standard`, `E-commerce Modular`, etc), field `id, name, framework, folderStructure: FolderNode, globalRules, mcpStatus: 'active'` | `recent-standards`, `standards-grid`, `mcps-list` |
| `forge-dummy.ts` | `dummyFolderTree: FolderNode` nested (root `src` -> `features/auth`, `features/forge`, `components/ui`, `server/infra` etc) + each node `rules, naming, exampleCode` English | `visual-tree`, `folder-inspector` |
| `journals-dummy.ts` | `dummyMessages: ChatMessage[]` 6 bubbles English (user + Gemini), `geminiResponses` mock JSON English | `chat-panel` |
| `templates-dummy.ts` | `dummyTemplates: Template[]` 3 items English | `template-grid` |
| `stats-dummy.ts` | `dummyStats: { total:12, active:8, templatesUsed:3 }` English | `stats-section` |
| `mcps-dummy.ts` | `dummyMcps: Mcp[]` 4 items English (`My Next.js Clean MCP`, endpoint `https://cleanforge.run.app/mcp/...`) | `mcps-list` |
| `docs-dummy.ts` | `docsSections: DocSection[]` English (Getting Started, MCP Setup) | `docs-content` |

**TanStack Query Hooks (FE First, English):**
```ts
// src/features/dashboard/hooks/use-standards-query.ts
export const useStandardsQuery = () => useQuery({
  queryKey: ['standards'],
  queryFn: async () => dummyStandards,
});
// nanti -> fetch('/api/standards')
```
- `use-forge-query.ts` -> `dummyFolderTree`
- `use-chat-mutation.ts` -> `useMutation({ mutationFn: (msg) => mockGeminiResponse })`
- `use-mcps-query.ts` -> `dummyMcps`

**Zod Schemas (`src/features/*/schemas/`, English messages):**
- `standard-schema.ts`: `name: z.string().min(3, 'Name must be at least 3 characters')`, `framework: z.enum(['nextjs','nestjs','go'])`, `folderStructure: folderNodeSchema`
- `folder-node-schema.ts`: `name: z.string().regex(/^[a-z0-9-.]+$/, 'Use kebab-case'), rules: z.string().min(1, 'Rules required'), naming: z.enum(['kebab-case','PascalCase']), exampleCode: z.string().optional()`
- `chat-schema.ts`: `message: z.string().min(1, 'Message cannot be empty').max(500)`

---

## 13. Component Inventory (shadcn + Custom)

**shadcn yang perlu di-init (`npx shadcn@latest add ...`):**
- `button` (custom variant `glass`, `pill`)
- `card` (override ke glass)
- `badge`
- `input`, `textarea`, `label`
- `dialog`, `sheet`, `separator`
- `resizable` (untuk Forge 3-panel)
- `avatar`, `dropdown-menu`, `toast` (`sonner`)
- `accordion` (untuk Docs FAQ)
- `select` (untuk Standards filter)
- `tabs` (untuk mobile Forge)

**Custom Components:**

```
src/features/dashboard/components/
├── dashboard-page.tsx
├── sections/
│   ├── dashboard-header-section.tsx
│   ├── stats-section.tsx
│   ├── recent-standards-section.tsx
│   └── quick-actions-section.tsx
├── standard-card.tsx
└── empty-state.tsx

src/features/standards/components/
├── standards-page.tsx
└── sections/standards-grid-section.tsx

src/features/forge/components/
├── forge-page.tsx
├── chat-panel.tsx
├── visual-tree.tsx
├── folder-inspector.tsx
└── sections/
    ├── forge-header-section.tsx
    └── generate-mcp-section.tsx

src/features/mcps/components/
├── mcps-page.tsx
└── sections/mcps-list-section.tsx

src/features/templates/components/
├── templates-page.tsx
└── sections/template-grid-section.tsx

src/features/docs/components/
├── docs-page.tsx
└── sections/
    ├── docs-header-section.tsx
    ├── docs-content-section.tsx
    └── docs-faq-section.tsx

src/features/{analytics,activity,validations,playground,marketplace,settings}/components/
└── placeholder-section.tsx

src/components/layout/
├── sidebar.tsx              // 12 menu, Glassmorphism sidebar
├── header.tsx               // Top bar
└── mesh-gradient-bg.tsx     // Background aurora

src/components/ui/
└── placeholder-card.tsx     // Reusable Coming Soon
```

**File Naming:** Semua `kebab-case`.

---

## 14. Layout & Responsive

- **Sidebar:** `w-[280px]` desktop `fixed`, mobile `Sheet` (shadcn) triggered hamburger. 12 menu scrollable `overflow-y-auto`.
- **Mesh Gradient:** `fixed inset-0 -z-10` agar scroll tidak repaint.
- **Forge 3-Panel:** `ResizablePanelGroup` — desktop `horizontal`, mobile `vertical` (stack: Chat -> Tree -> Inspector dengan `Tabs`).
- **Cards:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` — glass tetap readable di mobile (increase `bg-white/60` di mobile).
- **Typography:** `text-3xl md:text-4xl` metrics, `text-sm` labels — tidak pecah di mobile.
- **Full English:** Pastikan tidak ada overflow karena teks English lebih pendek dari Indonesia — aman.

---

## 15. Accessibility & States (English)

- **Loading:** `Skeleton` shadcn dengan `bg-white/30 backdrop-blur` + `animate-pulse` — English `Loading...`
- **Empty:** `border-dashed` glass + illustration outline + CTA English (`No standards yet`, `Create your first clean standard`).
- **Error:** `bg-red-50/50 backdrop-blur border border-red-200/50 rounded-[20px] p-4 text-red-700` English (`Something went wrong`).
- **Focus:** `focus:ring-2 focus:ring-violet-500 focus:ring-offset-0` — jangan `ring-offset-white` karena glass.
- **Keyboard:** `Tab` nav untuk sidebar pill, `Esc` close Dialog.

---

## 16. User Stories & Acceptance Criteria (English UI)

| ID | Story | AC |
| :--- | :--- | :--- |
| **D-01** | As a logged-in user, I want to see overview | Dashboard shows `stats-section` 4 metrics (dummy English) + `recent-standards` grid 3 glass cards, metric `font-bold`, label `uppercase tracking-widest` |
| **D-02** | As a user, I want to create new standard | Click `+ New Standard` English -> `/forge/new` -> Forge 3-panel `Resizable` visible, mesh gradient blur intact |
| **D-03** | As a user, I want to brainstorm with Gemini | `chat-panel` English bubbles `white/70` vs `violet-600`, input `rounded-full` English placeholder `Ask Gemini...`, `Apply to Standard` English updates `visual-tree` |
| **D-04** | As a user, I want to visualize folder | `visual-tree` English recursive `kebab-case`, click folder -> `folder-inspector` English `RULES, EXAMPLE CODE` |
| **D-05** | As a user, I want to edit per-folder rules | `folder-inspector` English Zod `kebab-case` validation English message, save -> tree preview English update, `bg-white/60 rounded-xl` |
| **D-06** | As a user, I want to generate private MCP | `Generate MCP` Dialog English glass, shows `https://.../mcp/{uid}/{id}/sse` + `Copy` English + `Test Connection` English (mock `tools/list`) |
| **D-07** | As a user, I want to manage all standards | `/standards` English full grid 6 cards, search English `Search standards...`, filter English, `Open in Forge` English |
| **D-08** | As a user, I want to manage MCPs | `/mcps` English list 4 MCP cards, `Copy Link` English, `Regenerate Token` English |
| **D-09** | As a user, I want to use template | `/templates` English grid 3 glass cards, `Use Template` English -> clone dummy + redirect Forge + toast English |
| **D-10** | As a user, I want to read docs | `/docs` English full, sidebar docs nav + content glass cards + `How to Connect` code `bg-slate-900` English + FAQ accordion English |
| **D-11** | As a user, I see expanded sidebar | Sidebar shows 12 menus English in 4 groups (OVERVIEW 3, FORGE 4, MCP & TEMPLATES 3, SYSTEM 2), active `pill violet-100`, 6 full pages navigable, 6 placeholder show `Coming Soon` English glass card |
| **D-12** | As a FE dev, I want FE first | All data from `src/data-dummy/` English, TanStack `queryFn: () => dummy`, no Firestore fetch, `kebab-case`, base on `features/` |
| **D-13** | As a judge `rules_event.md:8`, I want consistent glassmorphism | All cards `bg-white/50 backdrop-blur-xl border-white/40 rounded-[20px]`, sidebar `bg-white/30`, header `bg-white/40`, mesh aurora `blur-[60px]` |
| **D-14** | As a user, I want Full English | No Indonesian text in web UI — all English, PRD stays Indonesian |

---

## 17. File Structure Final Dashboard (Updated)

```
src/
├── app/(dashboard)/
│   ├── layout.tsx           // MeshGradientBg + Sidebar (12) + Header + AuthGuard
│   ├── dashboard/page.tsx   // -> features/dashboard (FULL)
│   ├── standards/page.tsx   // -> features/standards (FULL)
│   ├── forge/[id]/page.tsx  // -> features/forge (FULL)
│   ├── forge/new/page.tsx   // -> features/forge (FULL)
│   ├── mcps/page.tsx        // -> features/mcps (FULL)
│   ├── templates/page.tsx   // -> features/templates (FULL)
│   ├── docs/page.tsx        // -> features/docs (FULL) — 6th
│   ├── analytics/page.tsx   // -> features/analytics (PLACEHOLDER)
│   ├── activity/page.tsx    // -> features/activity (PLACEHOLDER)
│   ├── validations/page.tsx // -> features/validations (PLACEHOLDER)
│   ├── playground/page.tsx  // -> features/playground (PLACEHOLDER)
│   ├── marketplace/page.tsx // -> features/marketplace (PLACEHOLDER)
│   └── settings/page.tsx    // -> features/settings (PLACEHOLDER)
├── features/
│   ├── dashboard/           // sections: dashboard-header, stats, recent-standards
│   ├── standards/           // standards-grid, header
│   ├── forge/               // chat-panel, visual-tree, folder-inspector, generate-mcp
│   ├── mcps/                // mcps-list
│   ├── templates/           // template-grid
│   ├── docs/                // docs-header, docs-content, docs-faq — FULL
│   ├── analytics/           // placeholder-section
│   ├── activity/            // placeholder-section
│   ├── validations/         // placeholder-section
│   ├── playground/          // placeholder-section
│   ├── marketplace/         // placeholder-section
│   └── settings/            // placeholder-section
├── server/                  // (EMPTY FE phase, siap untuk BE)
│   ├── infra/firebase-admin.ts
│   ├── repository/
│   ├── service/
│   └── auth/
├── components/
│   ├── ui/                  // shadcn + placeholder-card
│   └── layout/              // sidebar (12), header, mesh-gradient-bg
├── data-dummy/
│   ├── standards-dummy.ts
│   ├── forge-dummy.ts
│   ├── journals-dummy.ts
│   ├── templates-dummy.ts
│   ├── stats-dummy.ts
│   ├── mcps-dummy.ts
│   └── docs-dummy.ts
├── lib/utils.ts
└── hooks/ schemas/ types/
```

**Next Step:** Scaffold dashboard FE sesuai PRD revisi ini (12 menu, 6 full + 6 placeholder, Full English, Tanpa Team/Billing) dengan dummy data & glassmorphism. Backend tetap kosong `docs/prd-backend.md` (placeholder).


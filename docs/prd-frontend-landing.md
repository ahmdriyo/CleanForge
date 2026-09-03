# PRD Frontend — Landing Page — CleanForge

> **Project:** CleanForge - Developer Architecture Journal & Project Standard Forge
> **Scope:** Frontend Landing Page Only (Public, Pre-Auth)
> **Stack:** Next.js 15 (App Router, `src/`), TypeScript, Tailwind v4, shadcn/ui (New York), react-icons, TanStack Query v5, Zod, npm, `GOOGLE_APPLICATION_CREDENTIALS` (env)
> **Architecture:** Feature-Based `src/features/landing/` + `kebab-case` + Section Split + `src/data-dummy/` (FE First, tanpa BE)
> **Status:** READY FOR BUILD
> **Docs Terkait:** `rules_event.md` (4 Pilar Wajib, Timeline 06 Sept), `data-rules.md`

---

## 1. Overview & Goals

### 1.1 Latar Belakang
Vibe coding membuat developer menyuruh AI `buatkan project todo app` tanpa standar. Hasil: struktur folder berantakan, penamaan tidak konsisten, tidak clean code. Tidak ada cara untuk "mengajari" AI tentang standar folder/file/code personal/team.

CleanForge menyelesaikan ini lewat **Personal Gemini Journal** yang inti `rules_event.md:4` (`sign in, journal/brainstorm with Gemini, private space` Firestore `rules_event.md:5:23`) yang di-pivot menjadi **Standard Journal** — jurnal privat tempat developer mencatat & merumuskan standar projek, brainstorming dengan Gemini sebagai `Clean Architecture Consultant` (`rules_event.md:5:22` multi-turn), lalu di-generate menjadi **MCP Endpoint privat** (`get_my_project_standard`) yang memberi tahu AI Agent (Cursor/Claude) standar tersebut.

### 1.2 Tujuan Landing Page
- Menjelaskan problem & solusi dalam <10 detik (headline + visual 3D).
- Mengonversi visitor -> `Login` -> `Dashboard` -> `Forge`.
- Menampilkan 3 template Clean Code siap pakai sebagai proof.
- SEO & performa (Next.js metadata, Tailwind v4).
- 100% statis (tanpa fetch Firestore di MVP), data template dari `src/data-dummy/templates-dummy.ts`.

### 1.3 KPI
- CTR `Hero CTA` -> `/login` > 40%
- Scroll depth hingga `how-it-works` > 60%
- Click `Use Template` -> `/templates` (track TanStack Query event)

### 1.4 Target User
- Vibe coder / Solo dev Next.js/NestJS yang frustrasi struktur AI berantakan.
- Team lead yang ingin standarisasi project.

### 1.5 Non-Goals
- Tidak ada logic auth/Firestore di landing (hanya link ke `/login`).
- Tidak ada chat Gemini di landing.
- Tidak ada generate MCP di landing.

---

## 2. Tech Stack & Konvensi Landing

| Layer | Detail |
| :--- | :--- |
| **Framework** | Next.js 15.1+ App Router, `src/`, `output: 'standalone'` (`next.config.ts`) untuk Cloud Run Single Service `rules_event.md:5` |
| **Language** | TypeScript 5.7+ strict |
| **Styling** | Tailwind v4 (globals.css), shadcn/ui New York, `tailwind-merge` + `class-variance-authority` |
| **Icons** | `lucide-react` (UI shadcn) + `react-icons/fi, si` (stack badges) |
| **State/Data** | TanStack Query v5 (`QueryClientProvider` di `src/app/layout.tsx`) — landing hanya untuk `templates preview` (query dummy), Zod untuk validasi newsletter (jika ada) |
| **Package Manager** | npm |
| **Env** | `GOOGLE_APPLICATION_CREDENTIALS=./service-account.json` (tidak dipakai landing, tapi disiapkan) |

**Aturan File `kebab-case` Wajib:**
`hero-section.tsx`, `problem-section.tsx`, `use-templates-query.ts`, `landing-schema.ts` — semua di `src/features/landing/`.

---

## 3. Visual Design System (Sesuai Ketentuan Style Kamu)

### 3.1 Pola Warna (Color Pattern) — Monokromatik Ungu

Skema monokromatik dari satu warna dasar ungu + ruang putih dominan.

| Token | Nilai Tailwind | Penggunaan |
| :--- | :--- | :--- |
| **Primary Accent (Ungu Pekat/Indigo)** | `indigo-900` `#1e1b4b` / `violet-950` `#2e1065` | Logo, headline, icon blok 3D, border CTA. Kesan teknologi & stabilitas. |
| **Secondary/Highlight (Lavender/Lilac)** | `violet-100` `#ede9fe` / `purple-100` `#f3e8ff` / `lavender: #e9e5ff` | Icon 3D, bagian terang tombol CTA, pill badge bg, card highlight. |
| **Neutral Text (Cool Gray)** | `zinc-800` `#27272a` untuk heading, `muted: #6b7280` dengan rona ungu `slate-500` `#64748b` tapi `text-muted-foreground` di-shade ke `violet-950/60` | Body text — **jangan** pakai gray standar, pakai `text-slate-600` + `violet` tint: `text-violet-950/70` |
| **Base/Background (Ice White)** | `off-white: #fbfbff` / `ice: #f8f7ff` / `white` `#ffffff` | Background utama. Jangan `#FFFFFF` full, pakai `bg-[#fbfbff]` dengan rona kebiruan/keunguan tipis agar tidak menyilaukan. `bg-background` di-override ke `#fbfbff` di `globals.css`. |

**Implementasi Tailwind v4 `globals.css`:**
```css
@theme {
  --color-primary: #2e1065; /* violet-950 */
  --color-primary-foreground: #ffffff;
  --color-secondary: #ede9fe; /* violet-100 */
  --color-muted-foreground: #6b7280; /* cool gray with violet tint via opacity */
  --color-background: #fbfbff; /* ice white */
}
```

**Pola Penggunaan:**
- Headline: `text-violet-950` / `text-indigo-900`
- Body: `text-slate-600` / `text-violet-950/70`
- Card bg: `bg-white` + `border-violet-100`
- Badge pill: `bg-violet-100 text-violet-900 border-violet-200`

### 3.2 Gradasi Warna (Gradients)

**a. Radial Background Gradient (Hero):**
- Titik pusat di **bawah tengah** (di belakang objek 3D), memancar `white solid` -> memudar ke atas & samping menjadi `cool lavender` sangat pucat.
- Implementasi:
  ```tsx
  <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_center,_#ffffff_30%,_#f3e8ff_60%,_#ede9fe_80%,_#fbfbff_100%)]" />
  // atau tailwind v4: bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,_white_0%,_#ede9fe_50%,_#fbfbff_100%)]
  ```
- Opacity rendah (0.6-0.8) agar tidak ganggu teks.

**b. Linear Glass Gradient (CTA Button):**
- Tombol `Get Started` & `Book A Free Call Now` (di landing jadi `Start Forging Free` & `View Templates`):
  - `bg-gradient-to-br from-violet-950 via-indigo-900 to-violet-800`
  - `backdrop-blur-md` + `bg-white/10` overlay untuk efek kaca buram
  - `inner border` gradasi putih tipis di tepi atas: `border-t border-white/20` + `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)]`
  - `shadow-lg shadow-violet-950/20` + `hover:shadow-violet-950/30`
  - Contoh shadcn `Button` variant `glass`:
    ```tsx
    className="bg-gradient-to-br from-violet-950 to-indigo-900 text-white backdrop-blur-md border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_8px_32px_rgba(46,16,101,0.2)] hover:from-violet-900 hover:to-indigo-800"
    ```

### 3.3 Tipografi (Typography & Font)

**Jenis Font: Sans-Serif Geometris**
- **Primary:** `Inter` (via `next/font/google`) — fallback `Plus Jakarta Sans`, `SF Pro Display`.
- Implementasi `src/app/layout.tsx`:
  ```ts
  import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
  const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
  // atau: const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });
  // pakai Inter untuk body, Plus Jakarta Sans untuk headline jika mau lebih geometric
  ```
- Body: `font-sans` -> `var(--font-inter)`
- Headline alternatif: `font-[Plus_Jakarta_Sans]` jika butuh lebih modern.

**Hierarki & Styling:**

| Elemen | Style | Tailwind |
| :--- | :--- | :--- |
| **Headline** (`Scale Smarter...` -> `Clean Code, Every Vibe`) | Medium/Semi-Bold, tracking-tight `letter-spacing: -0.02em` | `text-4xl md:text-6xl font-semibold tracking-tight text-violet-950 leading-tight` |
| **Body Text** | Regular, leading longgar `line-height: 1.6` | `text-base md:text-lg font-normal leading-relaxed text-slate-600` / `text-violet-950/70` |
| **Pill Badge** (`NEW GEN AI...` -> `NEW • CLEANFORGE MCP FORGE`) | Uppercase, tracking-widest, font-size kecil | `text-[11px] font-medium uppercase tracking-widest text-violet-900 bg-violet-100 border border-violet-200 rounded-full px-3 py-1` |
| **Section Label** | Uppercase kecil | `text-xs font-semibold uppercase tracking-widest text-violet-700` |
| **CTA Text** | Medium | `text-sm font-medium tracking-tight` |

**Konfigurasi `tailwind.config.ts` / `globals.css`:**
```css
--font-sans: var(--font-inter), ui-sans-serif, system-ui;
```

### 3.4 Gaya 3D Isometrik — Soft 3D / Claymorphism

Aset visual tengah layar (hero illustration).

**Karakteristik:**
- **Material:** Matte (tidak glossy), tanpa tekstur realistis. Halus, menyerap cahaya, seperti plastik doff / tanah liat.
- **Bentuk Geometri:** Kubus dasar dengan **heavy bevel/fillet** (`rounded-[24px]` / `rounded-3xl`), tidak kaku. Tumpukan kubus isometrik.
- **Pencahayaan:** Difus dari kiri atas, bayangan jatuh ke kanan bawah sangat halus, blur, tidak pekat (`shadow-xl shadow-violet-950/10 blur-sm`), ilusi melayang (`transform translate-y-1 hover:translate-y-0 transition`).
- **Warna Objek 3D:** `bg-gradient-to-br from-white to-violet-50` + `border border-violet-100` + `icon text-violet-900`.

**Implementasi (Tanpa Asset 3D Berat — Pure CSS/Tailwind):**
- Gunakan div bertumpuk dengan `transform: rotateX(60deg) rotateZ(-45deg)` untuk isometrik, atau pakai `lucide` icon di dalam `rounded-3xl` card dengan `shadow-2xl`.
- Contoh komponen `src/features/landing/components/hero-illustration.tsx`:
  ```tsx
  <div className="relative mx-auto w-[420px] h-[320px]">
    <div className="absolute inset-0 bg-gradient-to-br from-white to-violet-50 rounded-[32px] border border-violet-100 shadow-[0_24px_64px_rgba(46,16,101,0.08),0_8px_24px_rgba(46,16,101,0.06)] backdrop-blur-sm" />
    <div className="absolute top-8 left-8 w-24 h-24 bg-white rounded-3xl shadow-lg border border-violet-100 flex items-center justify-center">
      <FolderIcon className="w-10 h-10 text-violet-900" />
    </div>
    // tumpukan 2-3 kubus dengan translate
  </div>
  ```
- Jangan pakai image PNG berat — pure CSS agar performa Next.js optimal.

---

## 4. Information Architecture & Routing

**Route Landing:** `src/app/page.tsx` (public, no auth guard)

**Struktur:**
```
src/app/page.tsx -> import { LandingPage } from '@/features/landing/components/landing-page'
```

**Navbar Anchor (Sesuai Request):**
- Sticky top navbar dengan anchor scroll smooth ke section.
- Menu: `Features` -> `#features`, `Templates` -> `#templates`, `How It Works` -> `#how-it-works`, `Tech Stack` -> `#tech-stack`
- CTA kanan: `Login` (ghost) + `Start Forging Free` (glass gradient)
- Mobile: hamburger `Sheet` shadcn.

**Anchor IDs:**
- `#hero` (default top)
- `#problem`
- `#solution`
- `#features`
- `#templates`
- `#how-it-works`
- `#tech-stack`
- `#cta`

**Scroll Behavior:** `html { scroll-behavior: smooth; }` + `scroll-mt-20` untuk offset sticky navbar.

---

## 5. Section Breakdown (Feature-Based, `kebab-case`)

Semua section di `src/features/landing/components/sections/` — dipanggil oleh `landing-page.tsx`.

### 5.1 `navbar-section.tsx` / `navbar.tsx`
- **Layout:** `sticky top-0 z-50 bg-[#fbfbff]/80 backdrop-blur-md border-b border-violet-100`
- **Left:** Logo `CleanForge` (`text-violet-950 font-semibold tracking-tight` + icon `Box` / `Layers` `indigo-900`)
- **Center:** Nav links `hidden md:flex gap-8 text-sm font-medium text-slate-600 hover:text-violet-900`
- **Right:** `Button variant ghost` (Login -> `/login`) + `Button glass` (Start Forging Free -> `/dashboard` atau `/login` jika belum auth)
- **Mobile:** `Sheet` dari shadcn.
- **Props:** `activeSection` (observe IntersectionObserver untuk highlight anchor).

### 5.2 `hero-section.tsx` (`#hero`)
- **Background:** Radial gradient (lihat 3.2.a) full section.
- **Pill Badge:** `NEW • CLEANFORGE — MCP FORGE FOR VIBE CODERS` (`uppercase tracking-widest bg-violet-100 text-violet-900`)
- **Headline:** `Clean Code, Every Vibe` atau `Scale Smarter with Clean Standards` (2 baris, `text-5xl md:text-7xl font-semibold tracking-tight text-violet-950`)
  - Baris kedua bisa gradient text: `Every Vibe` dengan `bg-gradient-to-r from-violet-900 to-indigo-700 bg-clip-text text-transparent`
- **Subheadline:** `Jangan biarkan AI merusak struktur projekmu. Journal standar privatmu, brainstorm dengan Gemini, generate MCP yang enforce clean code ke setiap AI Agent.` (`text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto`)
- **CTA:** 2 tombol — `Start Forging Free` (glass gradient primary) + `View Templates` (secondary `bg-white border-violet-200 text-violet-900`)
- **Visual 3D:** `hero-illustration.tsx` soft 3D claymorphism di bawah CTA, centered.
- **Social Proof (opsional):** `Trusted by vibe coders` + avatar stack.

### 5.3 `problem-section.tsx` (`#problem`)
- **Label:** `THE PROBLEM` (`uppercase tracking-widest text-violet-700`)
- **Headline:** `Vibe Coding is Fast. But Messy.` (`text-3xl font-semibold tracking-tight text-violet-950`)
- **Grid 3 Cards** (`grid md:grid-cols-3 gap-6`):
  1.  Icon `FolderX` (clay card), Title `Struktur Berantakan`, Desc `AI generate folder acak tiap project, tidak konsisten.`
  2.  Icon `Code2`, Title `Tidak Clean Code`, Desc `Penamaan campur aduk, logic tercampur.`
  3.  Icon `AlertTriangle`, Title `Tech Debt Instan`, Desc `Cepat di awal, susah maintain selamanya.`
- **Card Style:** `bg-white border border-violet-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition` + icon `bg-violet-50 rounded-2xl w-12 h-12 flex items-center justify-center text-violet-900`

### 5.4 `solution-section.tsx` (`#solution`)
- **Headline:** `Your Private Standard Journal` (`text-3xl font-semibold`)
- **3 Steps Horizontal** (`grid md:grid-cols-3 gap-8` dengan connector line `hidden md:block`):
  1.  `Journal` — Icon `BookOpen`, Title `Journal Standarmu`, Desc `Catat struktur folder, aturan penamaan, contoh code per-folder. Visual tree editor.`
  2.  `Brainstorm` — Icon `Sparkles`, Title `Brainstorm dengan Gemini`, Desc `Multi-turn chat dengan Gemini sebagai Clean Architecture Consultant.`
  3.  `Generate MCP` — Icon `Plug`, Title `Generate MCP Link`, Desc `Dapatkan endpoint privat `/mcp/{id}/sse` untuk Cursor/Claude.`
- **Visual:** Garis penghubung `border-t-2 border-dashed border-violet-200` di desktop.

### 5.5 `features-section.tsx` (`#features`)
- **Label:** `FEATURES`
- **Grid 2x2** (`grid md:grid-cols-2 gap-6`):
  - Card `Visual Folder Tree Editor` — preview mini tree + `kebab-case` badge
  - Card `AI Consultant` — chat bubble mock + `Apply to Standard`
  - Card `Private MCP Endpoint` — URL mock `https://cleanforge.run.app/mcp/...` + `Copy` + `Private` badge
  - Card `Isolated & Secure` — `Firebase Auth + Firestore Rules + Secret Manager` icons
- **Card Style:** `bg-white rounded-[24px] border border-violet-100 p-6` + header icon `bg-gradient-to-br from-violet-50 to-white`

### 5.6 `templates-preview-section.tsx` (`#templates`)
- **Headline:** `Start with Proven Standards` + Desc `3 template clean code siap pakai, tinggal clone & customize.`
- **Grid 3 Cards** (`grid md:grid-cols-3 gap-6`) — data dari `src/data-dummy/templates-dummy.ts` via TanStack Query:
  ```ts
  // templates-dummy.ts
  export const dummyTemplates = [
    { id: 'nextjs-clean', name: 'Next.js Clean Architecture', framework: 'Next.js 15', structure: 'src/features/...', icon: SiNextdotjs, color: 'violet' },
    { id: 'nestjs-modular', name: 'NestJS Modular', framework: 'NestJS', structure: 'src/modules/...', icon: SiNestjs, color: 'indigo' },
    { id: 'go-clean', name: 'Go Clean Arch', framework: 'Go', structure: 'internal/...', icon: SiGo, color: 'purple' },
  ]
  ```
- **Card:** `bg-white rounded-3xl border border-violet-100 overflow-hidden hover:shadow-lg transition` — top `framework badge`, middle `mini folder tree` (3 baris `src/features/auth` etc), bottom `Use Template` button (`variant outline border-violet-200`)
- **CTA:** `View All Templates` -> `/templates` (nanti dashboard).

### 5.7 `how-it-works-section.tsx` (`#how-it-works`)
- **Label:** `HOW IT WORKS`
- **Steps 1-4 dengan Number + Connector** (`flex flex-col md:flex-row gap-8`):
  1. `Login with Firebase Auth`
  2. `Create Standard in Visual Editor`
  3. `Chat & Refine with Gemini`
  4. `Generate MCP & Paste to Cursor` — tampilkan snippet `get_my_project_standard` JSON.
- **Code Preview Card:** `bg-violet-950 rounded-2xl p-4 text-violet-100 font-mono text-sm` — mock `tools/list` response.
- **Visual:** Timeline vertical di mobile, horizontal di desktop.

### 5.8 `tech-stack-section.tsx` (`#tech-stack`)
- **Headline:** `Built on Google Ecosystem` (`rules_event.md:5` compliance showcase)
- **Grid Badges** (`flex flex-wrap gap-3 justify-center`):
  - `Next.js 15`, `Firebase Auth`, `Firestore`, `Gemini API`, `Secret Manager`, `Cloud Run` — masing-masing `bg-white border border-violet-100 rounded-full px-4 py-2 text-sm font-medium text-violet-900` + react-icons.
- **Subtext:** `Production-ready, authenticated, isolated per-user, deployed on Cloud Run.` `rules_event.md:5`

### 5.9 `cta-section.tsx` (`#cta`)
- **Background:** `bg-gradient-to-br from-violet-950 via-indigo-900 to-violet-800` + radial overlay `bg-white/5` + `backdrop-blur`
- **Headline:** `Ready to Enforce Clean Code?` (`text-3xl font-semibold text-white tracking-tight`)
- **Desc:** `Join CleanForge. Your standards, every vibe.` (`text-violet-200`)
- **Buttons:** `Start Forging Free` (`bg-white text-violet-900 hover:bg-violet-50` + `shadow-lg`) + `Book a Demo` (jika ada, `bg-white/10 backdrop-blur border border-white/20 text-white`)
- **Glass Effect:** Sama seperti 3.2.b tapi inverted.

### 5.10 `footer-section.tsx` / `footer.tsx`
- **Layout:** `bg-[#fbfbff] border-t border-violet-100 py-12`
- **Left:** Logo + `© 2026 CleanForge. Built for Gen AI Academy APAC.`
- **Center:** Links `Features`, `Templates`, `How It Works` (anchor)
- **Right:** `GitHub` (repo publik `rules_event.md:6`), `X`, `LinkedIn` + hashtag `#AccelerateAIwithCloudRun`
- **Text:** `text-sm text-slate-500`

---

## 6. Data & State Management (FE First, Dummy)

**File:** `src/data-dummy/` (sesuai request: fokus FE dulu)

| File | Isi | Dipakai di |
| :--- | :--- | :--- |
| `templates-dummy.ts` | `dummyTemplates` 3 items (Next.js, NestJS, Go) | `templates-preview-section.tsx` |
| `landing-stats-dummy.ts` (opsional) | `stats: { users: 1200, standards: 3400 }` | `hero-section.tsx` social proof |
| `forge-dummy.ts` | Tidak dipakai landing, untuk dashboard nanti | — |

**TanStack Query di Landing:**
```ts
// src/features/landing/hooks/use-templates-query.ts
import { useQuery } from '@tanstack/react-query';
import { dummyTemplates } from '@/data-dummy/templates-dummy';

export const useTemplatesQuery = () => useQuery({
  queryKey: ['landing-templates'],
  queryFn: async () => dummyTemplates, // FE first, nanti -> fetch('/api/templates')
  staleTime: 1000 * 60 * 5,
});
```

**Zod:** Tidak wajib di landing MVP, kecuali ada `newsletter-form.tsx` (`newsletter-schema.ts`).

---

## 7. Component Inventory (shadcn + Custom)

**shadcn/ui yang perlu di-init (`npx shadcn@latest add ...`):**
- `button` (variant `default`, `ghost`, `outline`, custom `glass`)
- `card`
- `badge`
- `sheet` (mobile navbar)
- `separator`

**Custom Components (`src/features/landing/components/`):**
- `landing-page.tsx` (orchestrator, import semua sections)
- `navbar.tsx`
- `hero-illustration.tsx` (soft 3D claymorphism pure CSS)
- `sections/hero-section.tsx`
- `sections/problem-section.tsx`
- `sections/solution-section.tsx`
- `sections/features-section.tsx`
- `sections/templates-preview-section.tsx`
- `sections/how-it-works-section.tsx`
- `sections/tech-stack-section.tsx`
- `sections/cta-section.tsx`
- `footer.tsx`

**File Naming:** Semua `kebab-case` (`hero-section.tsx`, bukan `HeroSection.tsx`).

---

## 8. Responsive & Accessibility

- **Breakpoints:** `sm: 640`, `md: 768`, `lg: 1024`, `xl: 1280` — Mobile-first.
- **Navbar:** `hidden md:flex` untuk links, `Sheet` untuk mobile.
- **Grid:** `grid-cols-1 md:grid-cols-3` untuk problem/templates, `md:grid-cols-2` untuk features.
- **Typography:** `text-4xl md:text-6xl` headline, `text-base md:text-lg` body.
- **A11y:** `aria-label` untuk icon button, `alt` untuk illustration, contrast `violet-950` on `white` AA compliant, keyboard nav untuk anchor.

---

## 9. SEO & Performance (Next.js 15)

**`src/app/layout.tsx` metadata:**
```ts
export const metadata = {
  title: 'CleanForge — Clean Code, Every Vibe | MCP Standard Forge',
  description: 'Private Standard Journal. Brainstorm with Gemini. Generate MCP that enforces your clean code to every AI Agent.',
  keywords: ['MCP', 'Clean Code', 'Next.js', 'Gen AI Academy', 'Cloud Run'],
  openGraph: { images: ['/og-image.png'] },
}
```

**Performance:**
- `next/font` Inter (swap, subset latin) — no layout shift.
- `next/image` untuk illustration jika pakai image (tapi prefer pure CSS 3D).
- `Tailwind v4` JIT, purge otomatis.
- No client JS berat di landing (hanya TanStack Query untuk templates preview, bisa `initialData` agar SSR).

---

## 10. User Stories & Acceptance Criteria

| ID | Story | AC |
| :--- | :--- | :--- |
| **L-01** | Sebagai visitor, saya ingin paham CleanForge dalam 5 detik dari hero | Headline `Clean Code, Every Vibe` + sub + CTA terlihat tanpa scroll di `lg`, pill badge `NEW` terlihat |
| **L-02** | Sebagai dev, saya ingin navigasi cepat ke Features/Templates | Navbar anchor smooth scroll ke `#features`, `#templates`, `#how-it-works`, `#tech-stack`, active state highlight via IntersectionObserver |
| **L-03** | Sebagai visitor, saya ingin lihat contoh template | Grid 3 template dari `dummyTemplates` tampil, masing-masing ada framework icon (react-icons), mini tree, tombol `Use Template` -> `/login` |
| **L-04** | Sebagai user, saya ingin CTA jelas | 2 CTA di hero + 1 di `cta-section` (glass gradient), semua -> `/login` atau `/dashboard` jika sudah auth |
| **L-05** | Sebagai juri `rules_event.md:8`, saya ingin lihat tech stack Google | Section `tech-stack` tampilkan 6 badges (Next.js 15, Firebase Auth, Firestore, Gemini, Secret Manager, Cloud Run) |
| **L-06** | Sebagai mobile user, saya ingin akses menu | Hamburger -> Sheet shadcn, semua anchor & CTA tetap jalan |
| **L-07** | Sebagai FE dev, saya ingin code base on features | Semua section di `src/features/landing/components/sections/`, file `kebab-case`, tidak ada logic di `src/app/page.tsx` selain import |

---

## 11. File Structure Final Landing (Siap Scaffold)

```
src/
├── app/
│   ├── page.tsx                          // -> <LandingPage />
│   ├── layout.tsx                        // font Inter, QueryClientProvider, metadata
│   └── globals.css                       // Tailwind v4 + --color-background: #fbfbff
├── features/
│   └── landing/
│       ├── components/
│       │   ├── landing-page.tsx
│       │   ├── navbar.tsx
│       │   ├── hero-illustration.tsx
│       │   ├── footer.tsx
│       │   └── sections/
│       │       ├── hero-section.tsx
│       │       ├── problem-section.tsx
│       │       ├── solution-section.tsx
│       │       ├── features-section.tsx
│       │       ├── templates-preview-section.tsx
│       │       ├── how-it-works-section.tsx
│       │       ├── tech-stack-section.tsx
│       │       └── cta-section.tsx
│       ├── hooks/
│       │   └── use-templates-query.ts
│       ├── schemas/
│       │   └── landing-schema.ts         // optional newsletter
│       └── types/
│           └── landing-types.ts
├── data-dummy/
│   ├── templates-dummy.ts
│   └── landing-stats-dummy.ts
├── components/ui/                        // shadcn
└── lib/utils.ts
```

**Next Step Setelah PRD Ini Di-Approve:** Scaffold FE landing sesuai struktur di atas dengan `data-dummy`, lalu lanjut PRD Dashboard (PRD 2) — backend tetap kosong `docs/prd-backend.md`.


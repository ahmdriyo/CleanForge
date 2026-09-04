"use client";

/**
 * @deprecated — Prefer importing from `@/providers/MainProviders` directly.
 * This file is kept for backward-compat because `src/app/layout.tsx`
 * still imports `{ Providers } from "@/components/providers"`.
 * All new providers should be added under `src/providers/*`
 * and composed inside `src/providers/MainProviders.tsx`.
 */

export { default as Providers, default } from "@/providers/MainProviders";

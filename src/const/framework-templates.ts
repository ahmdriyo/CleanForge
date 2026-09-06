import type { FolderNode, NamingConvention } from "@/types/standard";

export interface FrameworkOption {
  id: string;
  name: string;
  category: "frontend" | "backend" | "fullstack" | "mobile" | "custom";
  description: string;
  defaultNaming: NamingConvention;
  defaultRules: {
    namingConvention: NamingConvention;
    stateManagement: string;
    styling: string;
    principles: string[];
  };
  initialTree: FolderNode;
}

export const POPULAR_FRAMEWORKS: FrameworkOption[] = [
  {
    id: "nextjs",
    name: "Next.js",
    category: "fullstack",
    description:
      "App Router, feature-based modules, TanStack Query/Zustand, Tailwind CSS",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "TanStack Query + Zustand",
      styling: "Tailwind CSS + shadcn/ui",
      principles: [
        "Feature-based",
        "App Router isolation",
        "No cross-feature imports",
      ],
    },
    initialTree: {
      id: "root-nextjs",
      name: "src",
      type: "folder",
      rules:
        "Application root — all code under src/. Feature folders are isolated; shared code only in components/, lib/, hooks/.",
      naming: "kebab-case",
      description:
        "Root source folder for Next.js 15 App Router. Enforces clean architecture for vibe-coded projects.",
      children: [
        {
          id: "next-app",
          name: "app",
          type: "folder",
          rules:
            "Next.js App Router ONLY — route segments, layouts, pages, and route handlers. No business logic here; import from features/. Each folder inside app/ maps to a URL segment.",
          naming: "kebab-case",
          description:
            "App Router routes. Each subfolder is a URL segment with page.tsx / layout.tsx / route.ts.",
          children: [
            {
              id: "next-app-layout",
              name: "layout.tsx",
              type: "file",
              rules:
                "Root layout must export RootLayout, include <html lang>, providers (QueryClient, Auth), and global CSS. No feature imports.",
              description:
                "Root layout — wraps all routes with providers and metadata.",
              exampleCode: `import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = { title: "My App", description: "CleanForge standard" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`,
            },
            {
              id: "next-app-page",
              name: "page.tsx",
              type: "file",
              rules:
                "Page component must be async Server Component when fetching, keep UI thin and delegate logic to features/ hooks.",
              description:
                "Landing / dashboard page for route /. Server Component entry.",
              exampleCode: `import { Suspense } from "react";
import { DashboardStats } from "@/features/dashboard/components/stats-section";

export default function HomePage() {
  // Rule: no direct DB calls — use features/ hooks
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardStats />
      </Suspense>
    </main>
  );
}`,
            },
            {
              id: "next-app-globals",
              name: "globals.css",
              type: "file",
              rules:
                "Tailwind v4 entry only. Define @theme and CSS variables here. No component styles.",
              description: "Global Tailwind styles and CSS variables.",
              exampleCode: `@import "tailwindcss";
@theme {
  --color-primary: #4f46e5;
  --color-background: #fbfbff;
}
* { border-color: hsl(var(--border)); }
body { font-family: var(--font-inter), system-ui, sans-serif; }`,
            },
          ],
        },
        {
          id: "next-features",
          name: "features",
          type: "folder",
          rules:
            "Self-contained business modules. Each feature owns components/, hooks/, schemas/, types/. No cross-feature imports — use lib/ for shared. Naming kebab-case.",
          naming: "kebab-case",
          description:
            "Domain features — auth, payment, dashboard. Isolated, reusable, testable.",
          children: [
            {
              id: "next-feat-auth",
              name: "auth",
              type: "folder",
              rules:
                "Auth domain: login, session, guards. Hooks use TanStack Query; schemas use Zod; components use shadcn/ui.",
              naming: "kebab-case",
              description:
                "Authentication feature — login flow, session, protected routes.",
              children: [
                {
                  id: "next-auth-comp",
                  name: "components",
                  type: "folder",
                  rules:
                    "Auth UI only. Each file is one component, kebab-case, uses shadcn Button/Input. No data fetching inside component; use hooks/.",
                  naming: "kebab-case",
                  description: "UI components for auth — forms, cards, guards.",
                  children: [
                    {
                      id: "next-auth-form-file",
                      name: "auth-form.tsx",
                      type: "file",
                      rules:
                        "Form component must use react-hook-form + zodResolver(authSchema). Keep submit logic in hook.",
                      description:
                        "Auth form — login/register UI with validation.",
                      exampleCode: `"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, type AuthInput } from "../schemas/auth-schema";
import { useAuthMutation } from "../hooks/use-auth-mutation";
import { Button } from "@/components/ui/button";

export const AuthForm = () => {
  const { register, handleSubmit } = useForm<AuthInput>({ resolver: zodResolver(authSchema) });
  const { mutate, isPending } = useAuthMutation();
  return (
    <form onSubmit={handleSubmit((v) => mutate(v))} className="space-y-4">
      <input {...register("email")} placeholder="email" className="w-full rounded-xl border px-3 py-2" />
      <Button type="submit" disabled={isPending} className="w-full rounded-full">Sign in</Button>
    </form>
  );
};`,
                    },
                  ],
                },
                {
                  id: "next-auth-hooks",
                  name: "hooks",
                  type: "folder",
                  rules:
                    "Auth data layer: TanStack Query hooks only. Query keys prefixed with ['auth']. No JSX.",
                  naming: "kebab-case",
                  description: "Data hooks for auth — queries & mutations.",
                  children: [
                    {
                      id: "next-auth-hook-file",
                      name: "use-auth-mutation.ts",
                      type: "file",
                      rules:
                        "Mutation hook must handle error toast, invalidate ['auth'] on success, use baseApiToken.",
                      description: "Mutation hook for login/register.",
                      exampleCode: `import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseApiToken } from "@/lib/base-api";

export const useAuthMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      baseApiToken.post("/api/auth/login", payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["auth"] }),
  });
};`,
                    },
                  ],
                },
                {
                  id: "next-auth-schemas",
                  name: "schemas",
                  type: "folder",
                  rules:
                    "Zod schemas only. Export schema + inferred type. No side effects.",
                  naming: "kebab-case",
                  description: "Validation schemas for auth inputs.",
                  children: [
                    {
                      id: "next-auth-schema-file",
                      name: "auth-schema.ts",
                      type: "file",
                      rules:
                        "Schema must use z.object with email/password, min 8 chars for password. Export type via z.infer.",
                      description: "Zod schema for auth form.",
                      exampleCode: `import { z } from "zod";
export const authSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 chars"),
});
export type AuthInput = z.infer<typeof authSchema>;`,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "next-components",
          name: "components",
          type: "folder",
          rules:
            "Shared design-system only. Reusable across features. Built with shadcn/ui + Tailwind. No feature logic.",
          naming: "kebab-case",
          description: "Shared UI library — primitives and layout.",
          children: [
            {
              id: "next-ui",
              name: "ui",
              type: "folder",
              rules:
                "shadcn primitives only: button, input, dialog, card. Each file one primitive, forwardRef, cva.",
              naming: "kebab-case",
              description: "Primitive UI components from shadcn/ui.",
              children: [
                {
                  id: "next-ui-button",
                  name: "button.tsx",
                  type: "file",
                  rules:
                    "Button uses cva variants, forwardRef, supports loading state. No business logic.",
                  description: "Reusable Button primitive.",
                  exampleCode: `import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center rounded-full text-sm font-medium", {
  variants: { variant: { default: "bg-violet-600 text-white", outline: "border" } },
});
export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>>(
  ({ className, variant, ...props }, ref) => <button ref={ref} className={cn(buttonVariants({ variant }), className)} {...props} />
);
Button.displayName = "Button";`,
                },
              ],
            },
            {
              id: "next-layout",
              name: "layout",
              type: "folder",
              rules:
                "Layout shells: header, sidebar, mesh-gradient-bg. No data fetching; props-driven.",
              naming: "kebab-case",
              description: "Global layout components.",
              children: [
                {
                  id: "next-header",
                  name: "header.tsx",
                  type: "file",
                  rules:
                    "Header is client component with sticky top, backdrop-blur, shows breadcrumb + user menu.",
                  description: "Top header with breadcrumb and actions.",
                  exampleCode: `"use client";
export const Header = ({ title }: { title: string }) => (
  <header className="sticky top-0 z-30 bg-white/40 backdrop-blur-xl border-b border-white/40 px-4 py-3">
    <h1 className="text-lg font-semibold">{title}</h1>
  </header>
);`,
                },
              ],
            },
          ],
        },
        {
          id: "next-lib",
          name: "lib",
          type: "folder",
          rules:
            "Shared utilities, clients, and helpers. No React components. Pure functions and singletons.",
          naming: "kebab-case",
          description: "Utilities and shared clients.",
          children: [
            {
              id: "next-utils",
              name: "utils.ts",
              type: "file",
              rules:
                "Export cn helper (clsx + tailwind-merge) and format helpers. No side effects.",
              description: "Tailwind merge helper.",
              exampleCode: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));`,
            },
          ],
        },
      ],
    },
  },
  {
    id: "golang",
    name: "Go",
    category: "backend",
    description:
      "Standard Go project layout, internal/pkg packages, domain-driven architecture",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "N/A (Backend)",
      styling: "N/A",
      principles: [
        "Clean Architecture",
        "Hexagonal / Ports & Adapters",
        "Dependency Inversion",
      ],
    },
    initialTree: {
      id: "root-go",
      name: "root",
      type: "folder",
      rules:
        "Go layout root — cmd/ for binaries, internal/ private, pkg/ public, configs hidden from import.",
      naming: "kebab-case",
      description:
        "Standard Go project root (golang-standards/project-layout).",
      children: [
        {
          id: "go-cmd",
          name: "cmd",
          type: "folder",
          rules:
            "Binary entry points only. Each subfolder builds one binary. No library code.",
          description: "Application entry points.",
          children: [
            {
              id: "go-cmd-server",
              name: "server",
              type: "folder",
              rules:
                "HTTP/gRPC server binary. Main calls internal/app bootstrap.",
              description: "Server binary.",
              children: [
                {
                  id: "go-main",
                  name: "main.go",
                  type: "file",
                  rules:
                    "Main must parse config, init repo/usecase/delivery, start server with graceful shutdown.",
                  description: "Server entrypoint.",
                  exampleCode: `package main

import (
  "log"
  "net/http"
  "github.com/yourapp/internal/delivery/http"
  "github.com/yourapp/internal/repository"
  "github.com/yourapp/internal/usecase"
)

func main() {
  repo := repository.NewUserRepo()
  uc := usecase.NewUserUsecase(repo)
  handler := http.NewHandler(uc)
  log.Println("listening :8080")
  log.Fatal(http.ListenAndServe(":8080", handler.Router()))
}`,
                },
              ],
            },
          ],
        },
        {
          id: "go-internal",
          name: "internal",
          type: "folder",
          rules:
            "Private code — cannot be imported externally. Contains domain, usecase, delivery, repository.",
          description: "Private application code.",
          children: [
            {
              id: "go-domain",
              name: "domain",
              type: "folder",
              rules:
                "Entities + repository interfaces only. No DB or framework imports. Pure Go structs.",
              description: "Core domain entities and ports.",
              children: [
                {
                  id: "go-domain-user",
                  name: "user.go",
                  type: "file",
                  rules:
                    "Entity struct with JSON tags, plus UserRepository interface. No implementation.",
                  description: "User entity and repository port.",
                  exampleCode: `package domain

import "context"

type User struct {
  ID    string \`json:"id"\`
  Email string \`json:"email"\`
  Name  string \`json:"name"\`
}

type UserRepository interface {
  FindByID(ctx context.Context, id string) (*User, error)
  Create(ctx context.Context, u *User) error
}`,
                },
              ],
            },
            {
              id: "go-usecase",
              name: "usecase",
              type: "folder",
              rules:
                "Business logic depends on domain ports, not concrete repos. One file per domain.",
              description: "Use cases / application services.",
              children: [
                {
                  id: "go-usecase-user",
                  name: "user-usecase.go",
                  type: "file",
                  rules:
                    "Struct holds repo interface, methods validate business rules before repo call.",
                  description: "User use case — business rules.",
                  exampleCode: `package usecase

import (
  "context"
  "errors"
  "github.com/yourapp/internal/domain"
)

type UserUsecase struct{ repo domain.UserRepository }

func NewUserUsecase(r domain.UserRepository) *UserUsecase { return &UserUsecase{repo: r} }

func (u *UserUsecase) GetUser(ctx context.Context, id string) (*domain.User, error) {
  if id == "" { return nil, errors.New("id required") }
  return u.repo.FindByID(ctx, id)
}`,
                },
              ],
            },
            {
              id: "go-delivery",
              name: "delivery",
              type: "folder",
              rules:
                "Delivery adapters: http, grpc, worker. Parses request, calls usecase, writes response.",
              description: "Delivery layer — HTTP handlers.",
              children: [
                {
                  id: "go-http",
                  name: "http",
                  type: "folder",
                  rules:
                    "REST handlers, router, middleware. No business logic.",
                  description: "HTTP handlers and router.",
                  children: [
                    {
                      id: "go-handler",
                      name: "user-handler.go",
                      type: "file",
                      rules:
                        "Handler struct holds usecase, methods handle HTTP, validate request, return JSON.",
                      description: "HTTP handler for user.",
                      exampleCode: `package http

import (
  "encoding/json"
  "net/http"
  "github.com/yourapp/internal/usecase"
)

type UserHandler struct{ uc *usecase.UserUsecase }

func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
  id := r.URL.Query().Get("id")
  user, err := h.uc.GetUser(r.Context(), id)
  if err != nil { http.Error(w, err.Error(), 400); return }
  json.NewEncoder(w).Encode(user)
}`,
                    },
                  ],
                },
              ],
            },
            {
              id: "go-repository",
              name: "repository",
              type: "folder",
              rules:
                "Concrete DB implementations of domain ports. One file per domain, uses sql.DB or GORM.",
              description: "Repository implementations.",
              children: [
                {
                  id: "go-repo-user",
                  name: "user-repo.go",
                  type: "file",
                  rules:
                    "Implements domain.UserRepository with Postgres. No business logic.",
                  description: "Postgres user repo.",
                  exampleCode: `package repository

import (
  "context"
  "database/sql"
  "github.com/yourapp/internal/domain"
)

type userRepo struct{ db *sql.DB }

func NewUserRepo(db *sql.DB) domain.UserRepository { return &userRepo{db: db} }

func (r *userRepo) FindByID(ctx context.Context, id string) (*domain.User, error) {
  row := r.db.QueryRowContext(ctx, "SELECT id, email, name FROM users WHERE id=$1", id)
  var u domain.User
  if err := row.Scan(&u.ID, &u.Email, &u.Name); err != nil { return nil, err }
  return &u, nil
}`,
                },
              ],
            },
          ],
        },
        {
          id: "go-pkg",
          name: "pkg",
          type: "folder",
          rules:
            "Public reusable libraries safe for external import. No internal/ imports.",
          description: "Public packages.",
          children: [
            {
              id: "go-pkg-logger",
              name: "logger.go",
              type: "file",
              rules:
                "Shared logger wrapper around slog, JSON output, level via env.",
              description: "Shared logger.",
              exampleCode: `package pkg

import "log/slog"

var Log = slog.Default()`,
            },
          ],
        },
        {
          id: "go-mod",
          name: "go.mod",
          type: "file",
          rules:
            "Module name must be lowercase, go version pinned. No indirect pinning manually.",
          description: "Go module definition.",
          exampleCode: `module github.com/yourapp

go 1.22

require (
  github.com/labstack/echo/v4 v4.11.0
)`,
        },
      ],
    },
  },
  {
    id: "react",
    name: "React (Vite)",
    category: "frontend",
    description:
      "Vite + React SPA, modular features, custom hooks, atomic components",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "TanStack Query + Zustand",
      styling: "Tailwind CSS",
      principles: [
        "Feature-driven",
        "Component colocation",
        "Separation of concerns",
      ],
    },
    initialTree: {
      id: "root-react",
      name: "src",
      type: "folder",
      rules:
        "React SPA root via Vite. features/ isolated, components/ shared, hooks/ global.",
      naming: "kebab-case",
      description: "Client-side React root.",
      children: [
        {
          id: "react-assets",
          name: "assets",
          type: "folder",
          rules:
            "Static assets only: svg, png, fonts. No code. Import via alias @/assets.",
          description: "Static images and fonts.",
          children: [
            {
              id: "react-logo",
              name: "logo.svg",
              type: "file",
              rules:
                "SVG must be optimized, viewBox set, no hardcoded fill that blocks theming.",
              description: "App logo.",
              exampleCode: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="currentColor" /></svg>`,
            },
          ],
        },
        {
          id: "react-features",
          name: "features",
          type: "folder",
          rules:
            "Domain features — each subfolder owns components, hooks, schemas. No cross-import.",
          description: "Feature modules with components and hooks.",
          children: [
            {
              id: "react-feat-auth",
              name: "auth",
              type: "folder",
              rules: "Auth feature: login form, guards, session hooks.",
              description: "Auth feature.",
              children: [
                {
                  id: "react-auth-comp-file",
                  name: "auth-card.tsx",
                  type: "file",
                  rules:
                    "Card component, no data fetch, props-driven, Tailwind.",
                  description: "Auth card UI.",
                  exampleCode: `export const AuthCard = ({ title }: { title: string }) => (
  <div className="rounded-2xl border bg-white p-4">
    <h3 className="font-semibold">{title}</h3>
  </div>
);`,
                },
                {
                  id: "react-auth-hook-file",
                  name: "use-auth.ts",
                  type: "file",
                  rules: "Hook wraps TanStack Query for session, key ['auth'].",
                  description: "Auth hook.",
                  exampleCode: `import { useQuery } from "@tanstack/react-query";
export const useAuth = () => useQuery({ queryKey: ["auth"], queryFn: () => fetch("/api/auth/me").then(r=>r.json()) });`,
                },
              ],
            },
          ],
        },
        {
          id: "react-components",
          name: "components",
          type: "folder",
          rules: "Shared UI: button, input, modal. No feature logic.",
          description: "Shared reusable UI.",
          children: [
            {
              id: "react-ui",
              name: "ui",
              type: "folder",
              rules: "Primitive atoms, shadcn style, forwardRef.",
              description: "Primitive components.",
              children: [
                {
                  id: "react-ui-button",
                  name: "button.tsx",
                  type: "file",
                  rules:
                    "Button with variants via cva, loading prop supported.",
                  description: "Button primitive.",
                  exampleCode: `import { cn } from "@/lib/utils";
export const Button = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={cn("rounded-full bg-violet-600 px-4 py-2 text-white", className)} {...props} />
);`,
                },
              ],
            },
          ],
        },
        {
          id: "react-hooks",
          name: "hooks",
          type: "folder",
          rules:
            "Global hooks: use-debounce, use-media-query. No feature-specific hooks.",
          description: "Global custom hooks.",
          children: [
            {
              id: "react-hook-debounce",
              name: "use-debounce.ts",
              type: "file",
              rules:
                "Generic debounce hook, generic <T>, delay param default 300ms.",
              description: "Debounce hook.",
              exampleCode: `import { useEffect, useState } from "react";
export function useDebounce<T>(value: T, delay=300){ const [v,setV]=useState(value); useEffect(()=>{const id=setTimeout(()=>setV(value),delay); return()=>clearTimeout(id)},[value,delay]); return v; }`,
            },
          ],
        },
        {
          id: "react-routes",
          name: "routes",
          type: "folder",
          rules: "React Router config, lazy imports, protected wrappers.",
          description: "Router configuration.",
          children: [
            {
              id: "react-routes-index",
              name: "index.tsx",
              type: "file",
              rules:
                "Export router with createBrowserRouter, wrap protected routes with <RequireAuth>.",
              description: "Route definitions.",
              exampleCode: `import { createBrowserRouter } from "react-router-dom";
export const router = createBrowserRouter([{ path: "/", element: <div>Home</div> }]);`,
            },
          ],
        },
        {
          id: "react-app",
          name: "App.tsx",
          type: "file",
          rules:
            "Root App renders RouterProvider, QueryClientProvider, no logic.",
          description: "Root App component.",
          exampleCode: `import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
export default function App(){ return <RouterProvider router={router} />; }`,
        },
        {
          id: "react-main",
          name: "main.tsx",
          type: "file",
          rules: "Vite entry: createRoot, render App, import ./index.css.",
          description: "Vite entrypoint.",
          exampleCode: `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);`,
        },
      ],
    },
  },
  {
    id: "vue",
    name: "Vue (Vite/Nuxt)",
    category: "frontend",
    description:
      "Vue 3 Composition API, Pinia stores, composables, modular views",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "Pinia",
      styling: "Tailwind CSS",
      principles: [
        "Composition API",
        "Composables isolation",
        "Clean SFC components",
      ],
    },
    initialTree: {
      id: "root-vue",
      name: "src",
      type: "folder",
      rules:
        "Vue 3 Composition API root. components/, composables/, stores/, views/ isolated.",
      naming: "kebab-case",
      description: "Vue 3 project root.",
      children: [
        {
          id: "vue-components",
          name: "components",
          type: "folder",
          rules: "Reusable SFCs, props+emit only, no Pinia inside component.",
          description: "Shared Vue components.",
          children: [
            {
              id: "vue-common",
              name: "common",
              type: "folder",
              rules: "Primitives: AppButton.vue, AppInput.vue — pure UI.",
              description: "Shared primitives.",
              children: [
                {
                  id: "vue-button",
                  name: "AppButton.vue",
                  type: "file",
                  rules:
                    "SFC with <script setup>, defineProps<Props>, Tailwind, emit click.",
                  description: "Button component.",
                  exampleCode: `<script setup lang="ts">
defineProps<{ label: string }>()
</script>
<template><button class="rounded-full bg-violet-600 px-4 py-2 text-white">{{ label }}</button></template>`,
                },
              ],
            },
          ],
        },
        {
          id: "vue-composables",
          name: "composables",
          type: "folder",
          rules:
            "Composable functions useX, setup reactive state with ref/computed, no component logic.",
          description: "Reusable composables.",
          children: [
            {
              id: "vue-use-auth",
              name: "use-auth.ts",
              type: "file",
              rules:
                "Composable returns isAuthenticated + login(), uses Pinia store.",
              description: "Auth composable.",
              exampleCode: `import { ref } from "vue";
export function useAuth(){ const isAuth = ref(false); const login = () => isAuth.value = true; return { isAuth, login }; }`,
            },
          ],
        },
        {
          id: "vue-stores",
          name: "stores",
          type: "folder",
          rules: "Pinia stores: defineStore, state/getters/actions typed.",
          description: "Pinia state modules.",
          children: [
            {
              id: "vue-auth-store",
              name: "auth.ts",
              type: "file",
              rules:
                "defineStore('auth', setup) with ref state and actions, persist via pinia-plugin-persistedstate.",
              description: "Auth store.",
              exampleCode: `import { defineStore } from "pinia";
import { ref } from "vue";
export const useAuthStore = defineStore("auth", () => {
  const token = ref("");
  const setToken = (v:string) => token.value = v;
  return { token, setToken };
});`,
            },
          ],
        },
        {
          id: "vue-views",
          name: "views",
          type: "folder",
          rules:
            "Route views: HomeView.vue maps to / , each view imports components + composables.",
          description: "Page views for router.",
          children: [
            {
              id: "vue-home-view",
              name: "HomeView.vue",
              type: "file",
              rules:
                "SFC view with <script setup>, fetch via composable, layout via components.",
              description: "Home view.",
              exampleCode: `<script setup lang="ts">
import AppButton from "@/components/common/AppButton.vue";
</script>
<template><div><h1>Home</h1><AppButton label="Click" /></div></template>`,
            },
          ],
        },
        {
          id: "vue-app",
          name: "App.vue",
          type: "file",
          rules: "Root SFC, <RouterView />, global styles import.",
          description: "Root Vue component.",
          exampleCode: `<script setup lang="ts"></script>
<template><RouterView /></template>`,
        },
        {
          id: "vue-main",
          name: "main.ts",
          type: "file",
          rules: "CreateApp, use Pinia + Router, mount #app.",
          description: "Entrypoint.",
          exampleCode: `import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
createApp(App).use(createPinia()).use(router).mount("#app");`,
        },
      ],
    },
  },
  {
    id: "express",
    name: "Express.js",
    category: "backend",
    description:
      "Node.js REST API, layered controllers, services, repositories, middlewares",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "N/A (Backend)",
      styling: "N/A",
      principles: [
        "Layered Architecture (Controller -> Service -> Model)",
        "Centralized error handling",
      ],
    },
    initialTree: {
      id: "root-express",
      name: "src",
      type: "folder",
      rules:
        "Express layered architecture: routes -> controllers -> services -> models. Middleware cross-cutting.",
      naming: "kebab-case",
      description: "Express server source.",
      children: [
        {
          id: "exp-controllers",
          name: "controllers",
          type: "folder",
          rules:
            "Thin handlers: parse req, call service, send res. No DB access.",
          description: "HTTP handlers.",
          children: [
            {
              id: "exp-user-ctrl",
              name: "user-controller.ts",
              type: "file",
              rules:
                "Class or functions, validates via zod, calls UserService, returns 200/400 JSON.",
              description: "User controller.",
              exampleCode: `import { Request, Response } from "express";
import { userService } from "../services/user-service";

export const getUser = async (req: Request, res: Response) => {
  const user = await userService.findById(req.params.id);
  if(!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
};`,
            },
          ],
        },
        {
          id: "exp-services",
          name: "services",
          type: "folder",
          rules:
            "Business logic only. Throws errors, controllers map to HTTP. No req/res.",
          description: "Business services.",
          children: [
            {
              id: "exp-user-svc",
              name: "user-service.ts",
              type: "file",
              rules:
                "Functions call models, enforce business rules, throw domain errors.",
              description: "User service.",
              exampleCode: `import { UserModel } from "../models/user-model";
export const userService = {
  findById: (id: string) => UserModel.findById(id),
};`,
            },
          ],
        },
        {
          id: "exp-models",
          name: "models",
          type: "folder",
          rules: "ORM schemas: Prisma or Mongoose. Export model + types.",
          description: "Database schemas.",
          children: [
            {
              id: "exp-user-model",
              name: "user-model.ts",
              type: "file",
              rules:
                "Prisma schema or Mongoose schema file. No business logic.",
              description: "User model.",
              exampleCode: `import { prisma } from "../lib/prisma";
export const UserModel = { findById: (id:string) => prisma.user.findUnique({ where: { id } }) };`,
            },
          ],
        },
        {
          id: "exp-routes",
          name: "routes",
          type: "folder",
          rules:
            "Express Router definitions only. Wire controller + middleware.",
          description: "Route declarations.",
          children: [
            {
              id: "exp-user-route",
              name: "user-route.ts",
              type: "file",
              rules:
                "Router with GET /users/:id -> controller, apply auth middleware.",
              description: "User routes.",
              exampleCode: `import { Router } from "express";
import { getUser } from "../controllers/user-controller";
import { authMiddleware } from "../middlewares/auth-middleware";
export const userRouter = Router();
userRouter.get("/:id", authMiddleware, getUser);`,
            },
          ],
        },
        {
          id: "exp-middlewares",
          name: "middlewares",
          type: "folder",
          rules:
            "Middleware: auth, error, validation. Call next() or res.status().",
          description: "Middlewares.",
          children: [
            {
              id: "exp-auth-mw",
              name: "auth-middleware.ts",
              type: "file",
              rules:
                "Verify JWT from Authorization header, attach user to req.",
              description: "Auth middleware.",
              exampleCode: `import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace("Bearer ","");
  if(!token) return res.status(401).json({ error: "Unauthorized" });
  try{ (req as any).user = jwt.verify(token, process.env.JWT_SECRET!); next(); } catch{ res.status(401).json({ error: "Invalid token"})}
};`,
            },
          ],
        },
        {
          id: "exp-app",
          name: "app.ts",
          type: "file",
          rules:
            "Create express app, use json, cors, routes, error handler. No listen.",
          description: "Express app config.",
          exampleCode: `import express from "express";
import { userRouter } from "./routes/user-route";
export const app = express();
app.use(express.json());
app.use("/api/users", userRouter);
app.use((err:any, _req:any, res:any, _next:any) => res.status(500).json({ error: err.message }));`,
        },
        {
          id: "exp-server",
          name: "server.ts",
          type: "file",
          rules: "Import app, listen with PORT, handle graceful shutdown.",
          description: "HTTP listener.",
          exampleCode: `import { app } from "./app";
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Listening \${PORT}\`));`,
        },
      ],
    },
  },
  {
    id: "nestjs",
    name: "NestJS",
    category: "backend",
    description:
      "Enterprise TypeScript framework, modular architecture, dependency injection",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "N/A (Backend)",
      styling: "N/A",
      principles: [
        "Modular Architecture",
        "Dependency Injection",
        "Decorators & DTO Validation",
      ],
    },
    initialTree: {
      id: "root-nestjs",
      name: "src",
      type: "folder",
      rules:
        "NestJS modular: each domain is a Module with controller/service/module. Common for shared.",
      naming: "kebab-case",
      description: "NestJS application source.",
      children: [
        {
          id: "nest-modules",
          name: "modules",
          type: "folder",
          rules: "Each folder is a Nest Module encapsulating one domain.",
          description: "Feature modules.",
          children: [
            {
              id: "nest-mod-auth",
              name: "auth",
              type: "folder",
              rules:
                "Auth module: controller handles routes, service does logic, DTO validates, module wires providers.",
              description: "Auth feature module.",
              children: [
                {
                  id: "nest-auth-ctrl",
                  name: "auth.controller.ts",
                  type: "file",
                  rules:
                    "Decorate with @Controller('auth'), methods with @Post/@Get, use DTO + @UseGuards.",
                  description: "Auth controller — HTTP routes.",
                  exampleCode: `import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./login.dto";

@Controller("auth")
export class AuthController {
  constructor(private svc: AuthService){}
  @Post("login")
  login(@Body() dto: LoginDto){ return this.svc.login(dto); }
}`,
                },
                {
                  id: "nest-auth-srv",
                  name: "auth.service.ts",
                  type: "file",
                  rules:
                    "Injectable service with business logic, throws UnauthorizedException on fail.",
                  description: "Auth service.",
                  exampleCode: `import { Injectable } from "@nestjs/common";
@Injectable()
export class AuthService {
  async login(dto: any){ return { token: "jwt" }; }
}`,
                },
                {
                  id: "nest-auth-mod",
                  name: "auth.module.ts",
                  type: "file",
                  rules:
                    "Module declares controller + providers, exports service if needed by others.",
                  description: "Auth module definition.",
                  exampleCode: `import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
@Module({ controllers: [AuthController], providers: [AuthService] })
export class AuthModule {}`,
                },
                {
                  id: "nest-auth-dto",
                  name: "login.dto.ts",
                  type: "file",
                  rules:
                    "DTO with class-validator decorators, one class per file, export.",
                  description: "Login DTO.",
                  exampleCode: `import { IsEmail, IsString, MinLength } from "class-validator";
export class LoginDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
}`,
                },
              ],
            },
          ],
        },
        {
          id: "nest-common",
          name: "common",
          type: "folder",
          rules:
            "Shared guards, interceptors, pipes, filters. Reusable across modules.",
          description: "Cross-cutting concerns.",
          children: [
            {
              id: "nest-guard",
              name: "jwt-guard.ts",
              type: "file",
              rules:
                "Guard implements CanActivate, verifies JWT, attaches user.",
              description: "JWT guard.",
              exampleCode: `import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(ctx: ExecutionContext){ const req=ctx.switchToHttp().getRequest(); return !!req.headers.authorization; }
}`,
            },
          ],
        },
        {
          id: "nest-app-module",
          name: "app.module.ts",
          type: "file",
          rules: "Root module imports all feature modules + global providers.",
          description: "Root module.",
          exampleCode: `import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
@Module({ imports: [AuthModule] })
export class AppModule {}`,
        },
        {
          id: "nest-main",
          name: "main.ts",
          type: "file",
          rules:
            "Bootstrap via NestFactory, global pipe ValidationPipe with whitelist, enable CORS.",
          description: "Bootstrap.",
          exampleCode: `import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
async function bootstrap(){
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000);
}
bootstrap();`,
        },
      ],
    },
  },
  {
    id: "laravel",
    name: "Laravel",
    category: "backend",
    description:
      "PHP Modern Framework, MVC architecture, Eloquent ORM, Service-Repository pattern",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "PascalCase",
      stateManagement: "N/A",
      styling: "Blade / Tailwind CSS",
      principles: [
        "MVC Pattern",
        "Service-Repository pattern",
        "Form Request validation",
      ],
    },
    initialTree: {
      id: "root-laravel",
      name: "app",
      type: "folder",
      rules:
        "Laravel app/ holds HTTP, Models, Services. Follows PSR-4, PascalCase classes.",
      naming: "PascalCase",
      description: "Core PHP application logic.",
      children: [
        {
          id: "lar-http",
          name: "Http",
          type: "folder",
          rules:
            "HTTP layer: Controllers handle request, delegate to Services, return Resources.",
          description: "HTTP layer.",
          children: [
            {
              id: "lar-controllers",
              name: "Controllers",
              type: "folder",
              rules:
                "Resource controllers extend Controller, methods index/show/store/update/destroy, type-hint Request.",
              description: "Controllers.",
              children: [
                {
                  id: "lar-user-ctrl",
                  name: "UserController.php",
                  type: "file",
                  rules:
                    "Controller injects Service, returns JsonResource, validates via FormRequest.",
                  description: "User resource controller.",
                  exampleCode: `<?php
namespace App\\Http\\Controllers;
use App\\Http\\Requests\\StoreUserRequest;
use App\\Services\\UserService;

class UserController extends Controller {
  public function __construct(private UserService $service) {}
  public function store(StoreUserRequest $r){ return response()->json($this->service->create($r->validated()), 201); }
}`,
                },
              ],
            },
            {
              id: "lar-requests",
              name: "Requests",
              type: "folder",
              rules:
                "FormRequest per action, rules() + authorize(), injected into controller.",
              description: "Form requests.",
              children: [
                {
                  id: "lar-store-req",
                  name: "StoreUserRequest.php",
                  type: "file",
                  rules:
                    "Extends FormRequest, authorize true, rules with required|email|unique.",
                  description: "Validation for store user.",
                  exampleCode: `<?php
namespace App\\Http\\Requests;
use Illuminate\\Foundation\\Http\\FormRequest;
class StoreUserRequest extends FormRequest {
  public function authorize(): bool { return true; }
  public function rules(): array { return ["name"=>"required", "email"=>"required|email|unique:users"]; }
}`,
                },
              ],
            },
            {
              id: "lar-middleware",
              name: "Middleware",
              type: "folder",
              rules: "Middleware handle() checks auth/role, call $next.",
              description: "HTTP middleware.",
              children: [
                {
                  id: "lar-auth-mw",
                  name: "AuthMiddleware.php",
                  type: "file",
                  rules: "Check Bearer token, abort 401 if invalid.",
                  description: "Auth middleware.",
                  exampleCode: `<?php
namespace App\\Http\\Middleware;
use Closure;
class AuthMiddleware {
  public function handle($req, Closure $next){ if(!$req->bearerToken()) abort(401); return $next($req); }
}`,
                },
              ],
            },
          ],
        },
        {
          id: "lar-models",
          name: "Models",
          type: "folder",
          rules:
            "Eloquent models extend Model, guarded/fillable, relationships typed.",
          description: "Eloquent ORM entities.",
          children: [
            {
              id: "lar-user-model",
              name: "User.php",
              type: "file",
              rules: "Model with fillable, casts, hasMany, use HasFactory.",
              description: "User model.",
              exampleCode: `<?php
namespace App\\Models;
use Illuminate\\Database\\Eloquent\\Model;
class User extends Model {
  protected $fillable = ["name","email"];
  protected $casts = ["email_verified_at"=>"datetime"];
}`,
            },
          ],
        },
        {
          id: "lar-services",
          name: "Services",
          type: "folder",
          rules:
            "Service classes with business logic, injected into controllers, no HTTP.",
          description: "Service layer.",
          children: [
            {
              id: "lar-user-svc",
              name: "UserService.php",
              type: "file",
              rules:
                "Service methods create/find, uses Model, throws domain exceptions.",
              description: "User service.",
              exampleCode: `<?php
namespace App\\Services;
use App\\Models\\User;
class UserService {
  public function create(array $data): User { return User::create($data); }
}`,
            },
          ],
        },
      ],
    },
  },
  {
    id: "fastapi",
    name: "FastAPI",
    category: "backend",
    description:
      "Modern Python API, Pydantic schemas, dependency injection, async routers",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "N/A",
      styling: "N/A",
      principles: [
        "Pydantic Data Validation",
        "Dependency Injection",
        "Async I/O",
      ],
    },
    initialTree: {
      id: "root-fastapi",
      name: "app",
      type: "folder",
      rules:
        "FastAPI package: api/ routers, core/ config, models/ ORM, schemas/ Pydantic, services/ logic.",
      naming: "kebab-case",
      description: "FastAPI application package.",
      children: [
        {
          id: "fa-api",
          name: "api",
          type: "folder",
          rules:
            "Routers only. Each file defines APIRouter, endpoints call services.",
          description: "API routers.",
          children: [
            {
              id: "fa-v1",
              name: "v1",
              type: "folder",
              rules: "v1 prefix, include endpoints routers.",
              description: "v1 routes.",
              children: [
                {
                  id: "fa-endpoints",
                  name: "endpoints",
                  type: "folder",
                  rules:
                    "Per-resource endpoint file, defines @router.get/post.",
                  description: "Resource endpoints.",
                  children: [
                    {
                      id: "fa-user-ep",
                      name: "user.py",
                      type: "file",
                      rules:
                        "APIRouter prefix /users, async def endpoints, Depends for auth, return schema.",
                      description: "User endpoints.",
                      exampleCode: `from fastapi import APIRouter, Depends
from app.schemas.user import UserOut
from app.services.user import get_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{user_id}", response_model=UserOut)
async def read_user(user_id: int):
    return await get_user(user_id)`,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "fa-core",
          name: "core",
          type: "folder",
          rules: "Config, security, DB session. No business logic.",
          description: "Core config & security.",
          children: [
            {
              id: "fa-config",
              name: "config.py",
              type: "file",
              rules: "Pydantic Settings from env, single instance.",
              description: "App config.",
              exampleCode: `from pydantic_settings import BaseSettings
class Settings(BaseSettings):
    database_url: str
    secret_key: str
settings = Settings()`,
            },
          ],
        },
        {
          id: "fa-models",
          name: "models",
          type: "folder",
          rules: "SQLAlchemy models, Base declarative, table names plural.",
          description: "ORM models.",
          children: [
            {
              id: "fa-user-model",
              name: "user.py",
              type: "file",
              rules:
                "Declarative Base, __tablename__ = 'users', column types mapped.",
              description: "User model.",
              exampleCode: `from sqlalchemy import Column, Integer, String
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)`,
            },
          ],
        },
        {
          id: "fa-schemas",
          name: "schemas",
          type: "folder",
          rules: "Pydantic schemas: Create/Out pair, from_attributes True.",
          description: "Pydantic schemas.",
          children: [
            {
              id: "fa-user-schema",
              name: "user.py",
              type: "file",
              rules: "BaseModel with email validator, Config from_attributes.",
              description: "User schemas.",
              exampleCode: `from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    name: str

class UserOut(UserCreate):
    id: int
    class Config: from_attributes = True`,
            },
          ],
        },
        {
          id: "fa-services",
          name: "services",
          type: "folder",
          rules: "Business logic, async, raises HTTPException on error.",
          description: "Services.",
          children: [
            {
              id: "fa-user-svc",
              name: "user.py",
              type: "file",
              rules: "Functions query DB via SQLAlchemy, map to schema.",
              description: "User service.",
              exampleCode: `from fastapi import HTTPException
async def get_user(user_id: int):
    # query DB
    if not user_id:
        raise HTTPException(400, "id required")
    return {"id": user_id, "email": "a@b.com", "name": "Demo"}`,
            },
          ],
        },
        {
          id: "fa-main",
          name: "main.py",
          type: "file",
          rules: "Create FastAPI app, include routers, CORS, startup events.",
          description: "Entrypoint.",
          exampleCode: `from fastapi import FastAPI
from app.api.v1.endpoints.user import router as user_router

app = FastAPI(title="My API")
app.include_router(user_router, prefix="/api/v1")

@app.get("/health")
async def health(): return {"status": "ok"}`,
        },
      ],
    },
  },
  {
    id: "django",
    name: "Django",
    category: "fullstack",
    description:
      "High-level Python web framework, modular apps, Django REST Framework, ORM",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "N/A",
      styling: "Django Templates / Tailwind",
      principles: [
        "Don't Repeat Yourself (DRY)",
        "Pluggable apps architecture",
        "Fat models, skinny views",
      ],
    },
    initialTree: {
      id: "root-django",
      name: "project",
      type: "folder",
      rules:
        "Django project with apps/ pluggable, config/ settings, manage.py CLI.",
      naming: "kebab-case",
      description: "Django multi-app workspace.",
      children: [
        {
          id: "dj-apps",
          name: "apps",
          type: "folder",
          rules:
            "Each subfolder is a Django app with models/views/urls/serializers. Isolated.",
          description: "Pluggable apps.",
          children: [
            {
              id: "dj-accounts",
              name: "accounts",
              type: "folder",
              rules:
                "Auth app: CustomUser, ViewSet, urls, serializers. Uses DRF.",
              description: "Accounts app.",
              children: [
                {
                  id: "dj-acc-models",
                  name: "models.py",
                  type: "file",
                  rules:
                    "Define CustomUser(AbstractUser), fields, __str__, Meta.",
                  description: "User models.",
                  exampleCode: `from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    bio = models.TextField(blank=True)
    def __str__(self): return self.username`,
                },
                {
                  id: "dj-acc-views",
                  name: "views.py",
                  type: "file",
                  rules:
                    "ModelViewSet with queryset, serializer_class, permission_classes.",
                  description: "ViewSets.",
                  exampleCode: `from rest_framework import viewsets
from .models import CustomUser
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer`,
                },
                {
                  id: "dj-acc-urls",
                  name: "urls.py",
                  type: "file",
                  rules:
                    "Router register ViewSet, urlpatterns includes router.urls.",
                  description: "Route patterns.",
                  exampleCode: `from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register(r"users", UserViewSet)
urlpatterns = [path("", include(router.urls))]`,
                },
                {
                  id: "dj-acc-serializers",
                  name: "serializers.py",
                  type: "file",
                  rules:
                    "ModelSerializer with Meta model/fields, validate methods.",
                  description: "DRF serializers.",
                  exampleCode: `from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id","username","email","bio"]`,
                },
              ],
            },
          ],
        },
        {
          id: "dj-config",
          name: "config",
          type: "folder",
          rules: "Settings, wsgi, asgi, root urls. No business logic.",
          description: "Project config.",
          children: [
            {
              id: "dj-settings",
              name: "settings.py",
              type: "file",
              rules:
                "INSTALLED_APPS includes apps.accounts, REST_FRAMEWORK config, DATABASES.",
              description: "Settings.",
              exampleCode: `INSTALLED_APPS = ["django.contrib.admin","rest_framework","apps.accounts"]
REST_FRAMEWORK = {"DEFAULT_AUTHENTICATION_CLASSES": ["rest_framework.authentication.TokenAuthentication"]}`,
            },
          ],
        },
        {
          id: "dj-manage",
          name: "manage.py",
          type: "file",
          rules: "Standard manage.py, set DJANGO_SETTINGS_MODULE, no edits.",
          description: "CLI runner.",
          exampleCode: `#!/usr/bin/env python
import os, sys
if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)`,
        },
      ],
    },
  },
  {
    id: "flutter",
    name: "Flutter",
    category: "mobile",
    description:
      "Cross-platform mobile & web, BLoC/Riverpod state, clean feature architecture",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "Bloc / Riverpod",
      styling: "Material 3 / Cupertino widgets",
      principles: [
        "Clean Architecture (Data, Domain, Presentation)",
        "Immutability",
        "Feature First",
      ],
    },
    initialTree: {
      id: "root-flutter",
      name: "lib",
      type: "folder",
      rules:
        "lib/ is Dart root. core/ shared, features/ with data/domain/presentation, main.dart entry.",
      naming: "kebab-case",
      description: "Dart source root.",
      children: [
        {
          id: "fl-core",
          name: "core",
          type: "folder",
          rules:
            "Shared: theme, constants, network (Dio), error handling, utils. No feature code.",
          description: "Core shared utilities.",
          children: [
            {
              id: "fl-core-theme",
              name: "theme.dart",
              type: "file",
              rules: "ThemeData with ColorScheme, TextTheme, use Material3.",
              description: "App theme.",
              exampleCode: `import 'package:flutter/material.dart';
final appTheme = ThemeData(
  colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
  useMaterial3: true,
);`,
            },
          ],
        },
        {
          id: "fl-features",
          name: "features",
          type: "folder",
          rules:
            "Per-feature clean arch: data/ (datasource, model), domain/ (entity, repo interface, usecase), presentation/ (bloc, page, widgets).",
          description: "Feature modules.",
          children: [
            {
              id: "fl-feat-home",
              name: "home",
              type: "folder",
              rules: "Home feature follows data/domain/presentation split.",
              description: "Home domain.",
              children: [
                {
                  id: "fl-home-data",
                  name: "data",
                  type: "folder",
                  rules:
                    "Data layer: remote datasource (Dio), local (SharedPrefs), models with fromJson.",
                  description: "Data sources and models.",
                  children: [
                    {
                      id: "fl-home-model",
                      name: "home-model.dart",
                      type: "file",
                      rules:
                        "Model with fromJson/toJson, extends Entity, json_serializable.",
                      description: "Home model.",
                      exampleCode: `class HomeModel {
  final String id;
  HomeModel({required this.id});
  factory HomeModel.fromJson(Map<String,dynamic> j) => HomeModel(id: j["id"]);
}`,
                    },
                  ],
                },
                {
                  id: "fl-home-domain",
                  name: "domain",
                  type: "folder",
                  rules:
                    "Domain: entities (Equatable), repo abstract, usecase callable.",
                  description: "Entities and repos.",
                  children: [
                    {
                      id: "fl-home-entity",
                      name: "home-entity.dart",
                      type: "file",
                      rules: "Entity with Equatable, props, no JSON.",
                      description: "Home entity.",
                      exampleCode: `import 'package:equatable/equatable.dart';
class HomeEntity extends Equatable {
  final String id;
  const HomeEntity(this.id);
  @override List<Object> get props => [id];
}`,
                    },
                  ],
                },
                {
                  id: "fl-home-pres",
                  name: "presentation",
                  type: "folder",
                  rules:
                    "Presentation: bloc/cubit, pages, widgets. Bloc handles events -> states.",
                  description: "Widgets and Bloc.",
                  children: [
                    {
                      id: "fl-home-bloc",
                      name: "home-bloc.dart",
                      type: "file",
                      rules:
                        "Bloc with Event/State, on<LoadHome> calls usecase, emit loading/success.",
                      description: "Home Bloc.",
                      exampleCode: `import 'package:flutter_bloc/flutter_bloc.dart';
class HomeBloc extends Bloc<HomeEvent, HomeState> {
  HomeBloc(): super(HomeInitial()){
    on<LoadHome>((e, emit) async { emit(HomeLoading()); emit(HomeLoaded()); });
  }
}`,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "fl-main",
          name: "main.dart",
          type: "file",
          rules:
            "runApp with BlocProvider, MaterialApp theme, home page. No logic.",
          description: "Entrypoint.",
          exampleCode: `import 'package:flutter/material.dart';
import 'core/theme.dart';
void main() => runApp(MaterialApp(theme: appTheme, home: Scaffold(body: Center(child: Text("Home")))));`,
        },
      ],
    },
  },
  {
    id: "custom",
    name: "Custom (Blank / Zero)",
    category: "custom",
    description:
      "Start completely from scratch with your own framework, rules, and root folder.",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "Custom",
      styling: "Custom",
      principles: ["Clean Architecture", "Modular Structure"],
    },
    initialTree: {
      id: "root-blank",
      name: "root",
      type: "folder",
      rules:
        "Blank root for custom projects. Add folders/files via Inspector or MCP scaffold_feature. Define your own conventions.",
      naming: "kebab-case",
      description: "Empty project root — configure from scratch.",
      children: [],
    },
  },
];

export const getFrameworkTemplate = (idOrName: string): FrameworkOption => {
  const normalized = idOrName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const found = POPULAR_FRAMEWORKS.find(
    (f) =>
      f.id === normalized ||
      f.name.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized,
  );
  if (found) return found;

  return {
    id: "custom",
    name: idOrName || "Custom Tool",
    category: "custom",
    description: `Custom architecture for ${idOrName || "your project"}`,
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "Custom",
      styling: "Custom",
      principles: ["Clean Architecture"],
    },
    initialTree: {
      id: `root-${Date.now()}`,
      name: "src",
      type: "folder",
      rules: `Project root for ${idOrName || "custom"}.`,
      naming: "kebab-case",
      description: `Custom root for ${idOrName}`,
      children: [],
    },
  };
};

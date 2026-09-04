import type { FolderNode, NamingConvention } from "@/types/standard";

export interface FrameworkOption {
  id: string; // e.g. "nextjs", "golang", "react", "vue", "express", "nestjs", "laravel", "fastapi", "django", "flutter", "custom"
  name: string; // Display name e.g. "Next.js", "Go", "React", etc.
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
    description: "App Router, feature-based modules, TanStack Query/Zustand, Tailwind CSS",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "TanStack Query + Zustand",
      styling: "Tailwind CSS + shadcn/ui",
      principles: ["Feature-based", "App Router isolation", "No cross-feature imports"],
    },
    initialTree: {
      id: "root-nextjs",
      name: "src",
      type: "folder",
      rules: "Application root directory. Feature-driven modular structure.",
      naming: "kebab-case",
      description: "Root source folder",
      children: [
        {
          id: "next-app",
          name: "app",
          type: "folder",
          rules: "Next.js App Router routes, page layouts, and route handlers only.",
          naming: "kebab-case",
          children: [
            { id: "next-app-layout", name: "layout.tsx", type: "file", rules: "Root layout with providers" },
            { id: "next-app-page", name: "page.tsx", type: "file", rules: "Landing or main page" },
            { id: "next-app-globals", name: "globals.css", type: "file", rules: "Tailwind root styles" },
          ],
        },
        {
          id: "next-features",
          name: "features",
          type: "folder",
          rules: "Self-contained business modules. Each feature contains components, hooks, schemas, and types.",
          naming: "kebab-case",
          children: [
            {
              id: "next-feat-auth",
              name: "auth",
              type: "folder",
              rules: "Authentication domain logic",
              children: [
                { id: "next-auth-comp", name: "components", type: "folder", rules: "Feature UI components" },
                { id: "next-auth-hooks", name: "hooks", type: "folder", rules: "React queries & mutations" },
                { id: "next-auth-schemas", name: "schemas", type: "folder", rules: "Zod validation schemas" },
              ],
            },
          ],
        },
        {
          id: "next-components",
          name: "components",
          type: "folder",
          rules: "Shared design-system UI components (shadcn/ui, layout wrappers).",
          naming: "kebab-case",
          children: [
            { id: "next-ui", name: "ui", type: "folder", rules: "Primitive atoms/shadcn components" },
            { id: "next-layout", name: "layout", type: "folder", rules: "Global header, sidebar, navigation" },
          ],
        },
        {
          id: "next-lib",
          name: "lib",
          type: "folder",
          rules: "Shared clients, query clients, and pure utility functions.",
          naming: "kebab-case",
          children: [{ id: "next-utils", name: "utils.ts", type: "file", rules: "Tailwind cn helper" }],
        },
      ],
    },
  },
  {
    id: "golang",
    name: "Go",
    category: "backend",
    description: "Standard Go project layout, internal/pkg packages, domain-driven architecture",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "N/A (Backend)",
      styling: "N/A",
      principles: ["Clean Architecture", "Hexagonal / Ports & Adapters", "Dependency Inversion"],
    },
    initialTree: {
      id: "root-go",
      name: "root",
      type: "folder",
      rules: "Standard Go project layout root.",
      naming: "kebab-case",
      children: [
        {
          id: "go-cmd",
          name: "cmd",
          type: "folder",
          rules: "Main application entry points.",
          children: [
            {
              id: "go-cmd-server",
              name: "server",
              type: "folder",
              rules: "HTTP server binary entry point",
              children: [{ id: "go-main", name: "main.go", type: "file", rules: "Main entrypoint" }],
            },
          ],
        },
        {
          id: "go-internal",
          name: "internal",
          type: "folder",
          rules: "Private application and library code. Cannot be imported by external packages.",
          children: [
            {
              id: "go-domain",
              name: "domain",
              type: "folder",
              rules: "Core enterprise business entities and repository interfaces.",
            },
            {
              id: "go-usecase",
              name: "usecase",
              type: "folder",
              rules: "Business logic and application services.",
            },
            {
              id: "go-delivery",
              name: "delivery",
              type: "folder",
              rules: "HTTP handlers, gRPC services, and middleware controllers.",
              children: [{ id: "go-http", name: "http", type: "folder", rules: "REST route handlers" }],
            },
            {
              id: "go-repository",
              name: "repository",
              type: "folder",
              rules: "Database implementations (Postgres, GORM, Redis).",
            },
          ],
        },
        {
          id: "go-pkg",
          name: "pkg",
          type: "folder",
          rules: "Public libraries and reusable utilities safe for external packages.",
        },
        { id: "go-mod", name: "go.mod", type: "file", rules: "Go dependencies definition" },
      ],
    },
  },
  {
    id: "react",
    name: "React (Vite)",
    category: "frontend",
    description: "Vite + React SPA, modular features, custom hooks, atomic components",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "TanStack Query + Zustand",
      styling: "Tailwind CSS",
      principles: ["Feature-driven", "Component colocation", "Separation of concerns"],
    },
    initialTree: {
      id: "root-react",
      name: "src",
      type: "folder",
      rules: "Client-side React application root.",
      naming: "kebab-case",
      children: [
        {
          id: "react-assets",
          name: "assets",
          type: "folder",
          rules: "Static images, icons, and fonts.",
        },
        {
          id: "react-features",
          name: "features",
          type: "folder",
          rules: "Domain features (dashboard, auth, settings) with components and hooks.",
        },
        {
          id: "react-components",
          name: "components",
          type: "folder",
          rules: "Shared reusable UI buttons, inputs, modals.",
          children: [{ id: "react-ui", name: "ui", type: "folder", rules: "Primitive components" }],
        },
        {
          id: "react-hooks",
          name: "hooks",
          type: "folder",
          rules: "Global custom React hooks.",
        },
        {
          id: "react-routes",
          name: "routes",
          type: "folder",
          rules: "React Router route configuration and protected route guards.",
        },
        { id: "react-app", name: "App.tsx", type: "file", rules: "Root App component" },
        { id: "react-main", name: "main.tsx", type: "file", rules: "Vite DOM entrypoint" },
      ],
    },
  },
  {
    id: "vue",
    name: "Vue (Vite/Nuxt)",
    category: "frontend",
    description: "Vue 3 Composition API, Pinia stores, composables, modular views",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "Pinia",
      styling: "Tailwind CSS",
      principles: ["Composition API", "Composables isolation", "Clean SFC components"],
    },
    initialTree: {
      id: "root-vue",
      name: "src",
      type: "folder",
      rules: "Vue 3 project root directory.",
      naming: "kebab-case",
      children: [
        {
          id: "vue-components",
          name: "components",
          type: "folder",
          rules: "Reusable Vue Single File Components (SFC).",
          children: [{ id: "vue-common", name: "common", type: "folder", rules: "Shared primitives" }],
        },
        {
          id: "vue-composables",
          name: "composables",
          type: "folder",
          rules: "Reusable stateful business logic functions (useAuth, useFetch).",
        },
        {
          id: "vue-stores",
          name: "stores",
          type: "folder",
          rules: "Pinia centralized state management modules.",
        },
        {
          id: "vue-views",
          name: "views",
          type: "folder",
          rules: "Page views mapped to Vue Router routes.",
        },
        { id: "vue-app", name: "App.vue", type: "file", rules: "Root Vue component" },
        { id: "vue-main", name: "main.ts", type: "file", rules: "Vue app instantiation entrypoint" },
      ],
    },
  },
  {
    id: "express",
    name: "Express.js",
    category: "backend",
    description: "Node.js REST API, layered controllers, services, repositories, middlewares",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "N/A (Backend)",
      styling: "N/A",
      principles: ["Layered Architecture (Controller -> Service -> Model)", "Centralized error handling"],
    },
    initialTree: {
      id: "root-express",
      name: "src",
      type: "folder",
      rules: "Express.js server source code.",
      naming: "kebab-case",
      children: [
        {
          id: "exp-controllers",
          name: "controllers",
          type: "folder",
          rules: "HTTP request handlers parsing req and sending res.",
        },
        {
          id: "exp-services",
          name: "services",
          type: "folder",
          rules: "Core business logic decoupled from HTTP framework.",
        },
        {
          id: "exp-models",
          name: "models",
          type: "folder",
          rules: "Database schemas (Prisma, Mongoose, or TypeORM).",
        },
        {
          id: "exp-routes",
          name: "routes",
          type: "folder",
          rules: "Express Router endpoint declarations.",
        },
        {
          id: "exp-middlewares",
          name: "middlewares",
          type: "folder",
          rules: "Auth guards, rate limiters, validation, and error handlers.",
        },
        { id: "exp-app", name: "app.ts", type: "file", rules: "Express app configuration" },
        { id: "exp-server", name: "server.ts", type: "file", rules: "HTTP listener entrypoint" },
      ],
    },
  },
  {
    id: "nestjs",
    name: "NestJS",
    category: "backend",
    description: "Enterprise TypeScript framework, modular architecture, dependency injection",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "N/A (Backend)",
      styling: "N/A",
      principles: ["Modular Architecture", "Dependency Injection", "Decorators & DTO Validation"],
    },
    initialTree: {
      id: "root-nestjs",
      name: "src",
      type: "folder",
      rules: "NestJS application source.",
      naming: "kebab-case",
      children: [
        {
          id: "nest-modules",
          name: "modules",
          type: "folder",
          rules: "Feature modules containing controller, service, and DTOs.",
          children: [
            {
              id: "nest-mod-auth",
              name: "auth",
              type: "folder",
              rules: "Authentication feature module",
              children: [
                { id: "nest-auth-ctrl", name: "auth.controller.ts", type: "file", rules: "HTTP routes" },
                { id: "nest-auth-srv", name: "auth.service.ts", type: "file", rules: "Auth business logic" },
                { id: "nest-auth-mod", name: "auth.module.ts", type: "file", rules: "Nest module definition" },
              ],
            },
          ],
        },
        {
          id: "nest-common",
          name: "common",
          type: "folder",
          rules: "Cross-cutting guards, decorators, interceptors, and filters.",
        },
        { id: "nest-app-module", name: "app.module.ts", type: "file", rules: "Root module" },
        { id: "nest-main", name: "main.ts", type: "file", rules: "NestFactory bootstrap" },
      ],
    },
  },
  {
    id: "laravel",
    name: "Laravel",
    category: "backend",
    description: "PHP Modern Framework, MVC architecture, Eloquent ORM, Service-Repository pattern",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "PascalCase",
      stateManagement: "N/A",
      styling: "Blade / Tailwind CSS",
      principles: ["MVC Pattern", "Service-Repository pattern", "Form Request validation"],
    },
    initialTree: {
      id: "root-laravel",
      name: "app",
      type: "folder",
      rules: "Core PHP application logic.",
      naming: "PascalCase",
      children: [
        {
          id: "lar-http",
          name: "Http",
          type: "folder",
          rules: "Controllers, Middleware, and Form Requests.",
          children: [
            { id: "lar-controllers", name: "Controllers", type: "folder", rules: "Resource controllers" },
            { id: "lar-requests", name: "Requests", type: "folder", rules: "Form validation rules" },
            { id: "lar-middleware", name: "Middleware", type: "folder", rules: "HTTP filters" },
          ],
        },
        {
          id: "lar-models",
          name: "Models",
          type: "folder",
          rules: "Eloquent ORM entities.",
        },
        {
          id: "lar-services",
          name: "Services",
          type: "folder",
          rules: "Dedicated business service layer decoupled from controllers.",
        },
      ],
    },
  },
  {
    id: "fastapi",
    name: "FastAPI",
    category: "backend",
    description: "Modern Python API, Pydantic schemas, dependency injection, async routers",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "N/A",
      styling: "N/A",
      principles: ["Pydantic Data Validation", "Dependency Injection", "Async I/O"],
    },
    initialTree: {
      id: "root-fastapi",
      name: "app",
      type: "folder",
      rules: "FastAPI python application package.",
      naming: "kebab-case",
      children: [
        {
          id: "fa-api",
          name: "api",
          type: "folder",
          rules: "API endpoints and router registrations.",
          children: [
            {
              id: "fa-v1",
              name: "v1",
              type: "folder",
              rules: "API v1 route handlers",
              children: [{ id: "fa-endpoints", name: "endpoints", type: "folder", rules: "Resource endpoints" }],
            },
          ],
        },
        {
          id: "fa-core",
          name: "core",
          type: "folder",
          rules: "Application config, security, database sessions, and constants.",
        },
        {
          id: "fa-models",
          name: "models",
          type: "folder",
          rules: "SQLAlchemy or SQLModel ORM models.",
        },
        {
          id: "fa-schemas",
          name: "schemas",
          type: "folder",
          rules: "Pydantic request and response schemas.",
        },
        {
          id: "fa-services",
          name: "services",
          type: "folder",
          rules: "Business logic and third-party integrations.",
        },
        { id: "fa-main", name: "main.py", type: "file", rules: "FastAPI app entrypoint" },
      ],
    },
  },
  {
    id: "django",
    name: "Django",
    category: "fullstack",
    description: "High-level Python web framework, modular apps, Django REST Framework, ORM",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "N/A",
      styling: "Django Templates / Tailwind",
      principles: ["Don't Repeat Yourself (DRY)", "Pluggable apps architecture", "Fat models, skinny views"],
    },
    initialTree: {
      id: "root-django",
      name: "project",
      type: "folder",
      rules: "Django multi-app project workspace.",
      naming: "kebab-case",
      children: [
        {
          id: "dj-apps",
          name: "apps",
          type: "folder",
          rules: "Pluggable Django business apps.",
          children: [
            {
              id: "dj-accounts",
              name: "accounts",
              type: "folder",
              rules: "Authentication and user management app",
              children: [
                { id: "dj-acc-models", name: "models.py", type: "file", rules: "Database tables" },
                { id: "dj-acc-views", name: "views.py", type: "file", rules: "View logic / API ViewSets" },
                { id: "dj-acc-urls", name: "urls.py", type: "file", rules: "Route patterns" },
              ],
            },
          ],
        },
        {
          id: "dj-config",
          name: "config",
          type: "folder",
          rules: "Settings, wsgi, asgi, and root url routing.",
        },
        { id: "dj-manage", name: "manage.py", type: "file", rules: "Django CLI runner script" },
      ],
    },
  },
  {
    id: "flutter",
    name: "Flutter",
    category: "mobile",
    description: "Cross-platform mobile & web, BLoC/Riverpod state, clean feature architecture",
    defaultNaming: "kebab-case",
    defaultRules: {
      namingConvention: "kebab-case",
      stateManagement: "Bloc / Riverpod",
      styling: "Material 3 / Cupertino widgets",
      principles: ["Clean Architecture (Data, Domain, Presentation)", "Immutability", "Feature First"],
    },
    initialTree: {
      id: "root-flutter",
      name: "lib",
      type: "folder",
      rules: "Dart source root directory for Flutter.",
      naming: "kebab-case",
      children: [
        {
          id: "fl-core",
          name: "core",
          type: "folder",
          rules: "Shared themes, constants, network clients, and errors.",
        },
        {
          id: "fl-features",
          name: "features",
          type: "folder",
          rules: "Feature modules organized into presentation, domain, and data layers.",
          children: [
            {
              id: "fl-feat-home",
              name: "home",
              type: "folder",
              rules: "Home screen domain",
              children: [
                { id: "fl-home-data", name: "data", type: "folder", rules: "Data sources and models" },
                { id: "fl-home-domain", name: "domain", type: "folder", rules: "Entities and repositories" },
                { id: "fl-home-pres", name: "presentation", type: "folder", rules: "Widgets and Bloc/Cubit" },
              ],
            },
          ],
        },
        { id: "fl-main", name: "main.dart", type: "file", rules: "Flutter runApp entrypoint" },
      ],
    },
  },
  {
    id: "custom",
    name: "Custom (Blank / Zero)",
    category: "custom",
    description: "Start completely from scratch with your own framework, rules, and root folder.",
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
      rules: "Custom project root. Add folders and files using the inspector.",
      naming: "kebab-case",
      description: "Blank project root",
      children: [],
    },
  },
];

export const getFrameworkTemplate = (idOrName: string): FrameworkOption => {
  const normalized = idOrName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const found = POPULAR_FRAMEWORKS.find(
    (f) => f.id === normalized || f.name.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized,
  );
  if (found) return found;

  // If custom
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
      children: [],
    },
  };
};

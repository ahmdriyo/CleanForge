import type { FolderNode } from "@/types/standard";

export const dummyFolderTree: FolderNode = {
  id: "root",
  name: "src",
  type: "folder",
  rules: "Root source directory. All application code lives here. Keep it clean and feature-based.",
  naming: "kebab-case",
  description: "Root source folder",
  children: [
    {
      id: "features",
      name: "features",
      type: "folder",
      rules: "Each feature in its own folder. No cross-feature imports without explicit export.",
      naming: "kebab-case",
      description: "Feature-based modules",
      exampleCode: `// features/auth/index.ts\nexport * from "./components/login-form";\nexport * from "./hooks/use-auth";`,
      children: [
        {
          id: "features-auth",
          name: "auth",
          type: "folder",
          rules: "Auth feature isolated. Contains components, hooks, schemas for authentication.",
          naming: "kebab-case",
          description: "Authentication feature",
          exampleCode: `// features/auth/components/login-form.tsx\nexport const LoginForm = () => {\n  return <form>...</form>;\n};`,
          children: [
            { id: "auth-components", name: "components", type: "folder", rules: "UI components for auth only", naming: "kebab-case", exampleCode: `// login-form.tsx\nexport const LoginForm = () => <form />;` },
            { id: "auth-hooks", name: "hooks", type: "folder", rules: "Custom hooks for auth logic", naming: "kebab-case", exampleCode: `// use-auth.ts\nexport const useAuth = () => useQuery(...);` },
          ],
        },
        {
          id: "features-forge",
          name: "forge",
          type: "folder",
          rules: "Forge Studio feature. Handles standard editing and MCP generation.",
          naming: "kebab-case",
          description: "Forge feature",
          exampleCode: `// features/forge/components/visual-tree.tsx\nexport const VisualTree = () => {...};`,
          children: [
            { id: "forge-components", name: "components", type: "folder", rules: "Forge UI components", naming: "kebab-case", exampleCode: `// visual-tree.tsx` },
            { id: "forge-sections", name: "sections", type: "folder", rules: "Split by section for readability", naming: "kebab-case", exampleCode: `// forge-header-section.tsx` },
          ],
        },
      ],
    },
    {
      id: "components",
      name: "components",
      type: "folder",
      rules: "Only reusable UI components. No business logic. Use shadcn/ui as base.",
      naming: "kebab-case",
      description: "Shared UI components",
      exampleCode: `// components/ui/button.tsx\nimport { cn } from "@/lib/utils";\nexport const Button = () => <button />;`,
      children: [
        { id: "components-ui", name: "ui", type: "folder", rules: "shadcn/ui components only", naming: "kebab-case", exampleCode: `// button.tsx` },
        { id: "components-layout", name: "layout", type: "folder", rules: "Layout components: sidebar, header", naming: "kebab-case", exampleCode: `// sidebar.tsx` },
      ],
    },
    {
      id: "server",
      name: "server",
      type: "folder",
      rules: "Backend logic. Separated by layer: infra, repository, service, auth.",
      naming: "kebab-case",
      description: "Server layer",
      exampleCode: `// server/service/gemini-service.ts\nexport const callGemini = async () => {};`,
      children: [
        { id: "server-infra", name: "infra", type: "folder", rules: "Infrastructure: Firebase Admin, Secret Manager", naming: "kebab-case", exampleCode: `// firebase-admin.ts` },
        { id: "server-repo", name: "repository", type: "folder", rules: "Data access layer for Firestore", naming: "kebab-case", exampleCode: `// standard-repository.ts` },
        { id: "server-service", name: "service", type: "folder", rules: "Business logic services", naming: "kebab-case", exampleCode: `// mcp-service.ts` },
        { id: "server-auth", name: "auth", type: "folder", rules: "Auth verification", naming: "kebab-case", exampleCode: `// verify-id-token.ts` },
      ],
    },
  ],
};

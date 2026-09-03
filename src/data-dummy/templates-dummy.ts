import type { Template } from "@/types/standard";
import { dummyFolderTree } from "./forge-dummy";

export const dummyTemplates: Template[] = [
  {
    id: "nextjs-clean",
    name: "Next.js Clean Architecture",
    framework: "Next.js 15",
    structurePreview: "src/features/auth, src/features/forge, src/components/ui",
    description: "App Router, feature-based, Zustand, Tailwind v4 + shadcn. The most popular for vibe coding.",
    icon: "nextjs",
    accent: "violet",
    rules: "kebab-case, App Router, Feature-based",
    folderStructure: dummyFolderTree,
  },
  {
    id: "nestjs-modular",
    name: "NestJS Modular",
    framework: "NestJS",
    structurePreview: "src/modules/user, src/modules/auth, src/common",
    description: "Modular NestJS with clean architecture, Prisma, and scalable service layer.",
    icon: "nestjs",
    accent: "indigo",
    rules: "kebab-case, Modular, Clean Arch",
    folderStructure: dummyFolderTree,
  },
  {
    id: "go-clean",
    name: "Go Clean Architecture",
    framework: "Go",
    structurePreview: "internal/user, internal/auth, pkg/utils",
    description: "Hexagonal architecture for Go. Domain, use-case, and handler separation.",
    icon: "go",
    accent: "teal",
    rules: "kebab-case, Hexagonal, DDD",
    folderStructure: dummyFolderTree,
  },
];

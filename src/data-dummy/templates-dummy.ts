import type { Template } from "@/types/standard";
import { POPULAR_FRAMEWORKS } from "@/const/framework-templates";

export const dummyTemplates: Template[] = POPULAR_FRAMEWORKS.filter((f) => f.id !== "custom").map(
  (f) => ({
    id: `${f.id}-template`,
    name: `${f.name} Clean Architecture`,
    framework: f.name,
    structurePreview: f.initialTree.children?.slice(0, 3).map((c) => `${f.initialTree.name}/${c.name}`).join(", ") || "",
    description: f.description,
    icon: f.id,
    accent: "violet",
    rules: `${f.defaultNaming}, ${f.defaultRules.principles.slice(0, 2).join(", ")}`,
    folderStructure: f.initialTree,
  })
);

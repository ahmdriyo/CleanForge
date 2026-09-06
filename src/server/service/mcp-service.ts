import { getStandardById } from "@/server/repository/standard-repository";
import type { FolderNode } from "@/types/standard";
import type { McpToolDefinition } from "@/types/mcp.type";

/**
 * MCP Service — 4 tools, read-only, based on user's standard
 */

export const getMcpToolDefinitions = (): McpToolDefinition[] => [
  {
    name: "get_my_project_standard",
    description:
      "CRITICAL FIRST STEP for vibe coding: Get the COMPLETE project standard before generating ANY code. Returns folderStructure (recursive with rules/naming/exampleCode/description per node), flatList, filePaths, textTree, globalRules, and vibeCodingInstructions. AI MUST call this tool first and strictly follow its structure, naming, and exampleCode when scaffolding. This is 1:1 with Forge Visual Tree + Inspector.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: "get_folder_rules",
    description:
      "Get detailed rules for a specific folder/file path from the standard. Returns rules, namingConvention, exampleCode (ready-to-copy boilerplate), description, and children list. Use after get_my_project_standard when you need deep dive into one folder before generating files there.",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description:
            "Folder/file path e.g. src/features/auth, app/Http/Controllers, lib/features/home — supports any root (src, app, lib, root, internal, project) with or without root prefix",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "scaffold_feature",
    description:
      "Vibe-code a new feature strictly following the standard. Returns framework-aware suggestedPaths (with full file list) and step-by-step instructions referencing globalRules. Call get_my_project_standard first to know root/features location, then use this to scaffold.",
    inputSchema: {
      type: "object",
      properties: {
        featureName: {
          type: "string",
          description:
            "Feature name in kebab-case e.g. payment-gateway, user-profile. Will be used as folder name.",
        },
      },
      required: ["featureName"],
    },
  },
  {
    name: "validate_structure",
    description:
      "Validate if a proposed file path complies with the standard (kebab-case, correct root, parent folder exists). Call before writing files to avoid violating the standard.",
    inputSchema: {
      type: "object",
      properties: {
        proposedPath: {
          type: "string",
          description:
            "Proposed file path e.g. src/features/payment/payment-card.tsx or internal/domain/payment.go",
        },
      },
      required: ["proposedPath"],
    },
  },
];

/**
 * Framework-agnostic path resolver
 * Supports any root name: src, app, lib, root, internal, project, etc.
 * Accepts paths like "src/features/auth/components", "features/auth", "internal/domain", "app/Http/Controllers"
 * Also handles leading slash and exact root match.
 */
const findNodeByPath = (root: FolderNode, path: string): FolderNode | null => {
  if (!path) return null;
  const normalized = path.replace(/^\/+/, "").replace(/\/+$/, "");
  if (!normalized) return root;
  // Exact root match (e.g., "src", "app", "lib", "root")
  if (normalized === root.name) return root;

  let parts = normalized.split("/").filter(Boolean);
  // If first segment equals root name, strip it (e.g., "src/features/auth" with root "src" -> ["features","auth"])
  if (parts[0] === root.name) parts = parts.slice(1);
  if (parts.length === 0) return root;

  let current: FolderNode | undefined = root;
  for (const part of parts) {
    if (!current?.children) return null;
    current = current.children.find((c) => c.name === part);
    if (!current) return null;
  }
  return current || null;
};

const treeToText = (node: FolderNode, depth = 0): string => {
  const indent = "  ".repeat(depth);
  const typeLabel = node.type === "folder" ? "/" : "";
  const naming = node.naming ? ` (${node.naming})` : "";
  const rules = node.rules ? ` — ${node.rules}` : "";
  const desc = node.description ? ` [${node.description}]` : "";
  let out = `${indent}${node.name}${typeLabel}${naming}${rules}${desc}\n`;
  if (node.children) {
    for (const child of node.children) {
      out += treeToText(child, depth + 1);
    }
  }
  return out;
};

const collectFlatList = (
  node: FolderNode,
  parentPath: string,
  acc: Array<{
    path: string;
    type: "folder" | "file";
    rules?: string;
    naming?: string;
    description?: string;
    exampleCode?: string;
  }>,
) => {
  const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
  acc.push({
    path: currentPath,
    type: node.type,
    rules: node.rules,
    naming: node.naming,
    description: node.description,
    exampleCode: node.exampleCode,
  });
  if (node.children) {
    for (const child of node.children) {
      collectFlatList(child, currentPath, acc);
    }
  }
};

const collectFilePaths = (
  node: FolderNode,
  parentPath: string,
  acc: string[],
) => {
  const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
  if (node.type === "file") acc.push(currentPath);
  if (node.children) {
    for (const child of node.children)
      collectFilePaths(child, currentPath, acc);
  }
};

const countNodes = (node: FolderNode): { files: number; folders: number } => {
  let files = node.type === "file" ? 1 : 0;
  let folders = node.type === "folder" ? 1 : 0;
  if (node.children)
    for (const c of node.children) {
      const sub = countNodes(c);
      files += sub.files;
      folders += sub.folders;
    }
  return { files, folders };
};

export const callMcpTool = async (args: {
  uid: string;
  standardId: string;
  tool: string;
  arguments: Record<string, unknown>;
}): Promise<{ success: boolean; data?: unknown; error?: string }> => {
  const standard = await getStandardById(args.uid, args.standardId);
  if (!standard) return { success: false, error: "Standard not found" };

  switch (args.tool) {
    case "get_my_project_standard": {
      const root = standard.folderStructure;
      const flat: Array<{
        path: string;
        type: "folder" | "file";
        rules?: string;
        naming?: string;
        description?: string;
        exampleCode?: string;
      }> = [];
      collectFlatList(root, "", flat);
      const filePaths: string[] = [];
      collectFilePaths(root, "", filePaths);
      const counts = countNodes(root);
      const vibeCodingInstructions = `You are CleanForge vibe-coding agent for "${standard.name}" (${standard.framework}).\n\nMANDATORY RULES — you MUST follow the project standard below when generating ANY code:\n1. Always scaffold inside "${root.name}/" root. Total ${counts.folders} folders / ${counts.files} files defined.\n2. Naming: ${standard.globalRules.namingConvention} globally (${standard.globalRules.principles.join(", ")}). Styling: ${standard.globalRules.styling}. State: ${standard.globalRules.stateManagement}.\n3. Never create files outside the allowed tree. Call validate_structure before writing.\n4. For each folder, obey its rules + exampleCode + description from flatList/textTree.\n5. Prefer scaffold_feature for new features — it returns exact paths.\n6. No cross-feature imports; keep features isolated.\n7. Use kebab-case file names, ${standard.globalRules.namingConvention} where specified.\n\nTEXT TREE (enriched with rules):\n${treeToText(standard.folderStructure)}\n\nGLOBAL RULES JSON:\n${JSON.stringify(standard.globalRules, null, 2)}`;
      return {
        success: true,
        data: {
          standard: {
            id: standard.id,
            name: standard.name,
            framework: standard.framework,
            description: standard.description,
            folderStructure: standard.folderStructure,
            globalRules: standard.globalRules,
            textTree: treeToText(standard.folderStructure),
            vibeCodingInstructions,
            flatList: flat,
            filePaths,
            stats: {
              totalNodes: flat.length,
              totalFolders: counts.folders,
              totalFiles: counts.files,
            },
            updatedAt: standard.updatedAt,
            createdAt: standard.createdAt,
          },
        },
      };
    }
    case "get_folder_rules": {
      const path = args.arguments.path as string;
      if (!path) return { success: false, error: "path is required" };
      const node = findNodeByPath(standard.folderStructure, path);
      if (!node)
        return {
          success: false,
          error: `Folder not found: ${path}. Try get_my_project_standard to see flatList of valid paths.`,
        };
      const children =
        node.children?.map((c) => ({
          name: c.name,
          type: c.type,
          path: `${path.replace(/\/$/, "")}/${c.name}`,
          naming: c.naming,
          hasExample: !!c.exampleCode,
        })) || [];
      return {
        success: true,
        data: {
          path,
          name: node.name,
          type: node.type,
          rules: node.rules || "",
          naming: node.naming || standard.globalRules.namingConvention,
          exampleCode: node.exampleCode || "",
          description: node.description || "",
          children,
          childrenCount: children.length,
          // Vibe helper — copy-paste ready instruction for this folder
          instruction: `Create files in "${path}" using ${node.naming || standard.globalRules.namingConvention}. Rules: ${node.rules || "follow globalRules"}. ${node.description || ""} ${node.exampleCode ? "\nExample boilerplate:\n" + node.exampleCode.slice(0, 800) : ""}`,
        },
      };
    }
    case "scaffold_feature": {
      const featureName = args.arguments.featureName as string;
      if (!featureName)
        return { success: false, error: "featureName is required" };
      if (!/^[a-z0-9-]+$/.test(featureName)) {
        return { success: false, error: "Use kebab-case for featureName" };
      }
      const rootName = standard.folderStructure.name;
      const findFeaturesParent = (n: FolderNode): string | null => {
        if (!n.children) return null;
        for (const c of n.children)
          if (
            c.name === "features" ||
            c.name === "modules" ||
            c.name === "apps" ||
            c.name === "internal"
          ) {
            if (c.name === "features") return `${rootName}/features`;
            if (c.name === "internal")
              return `${rootName}/internal/${featureName}`;
          }
        return null;
      };
      let base = `${rootName}/features/${featureName}`;
      const detected = findFeaturesParent(standard.folderStructure);
      if (detected) {
        if (detected.includes("internal")) base = detected;
        else base = `${detected}/${featureName}`;
      }
      const isInternalBase = base === `${rootName}/internal/${featureName}`;
      // Find exampleCode templates from standard to make scaffold output copy-paste ready for vibe coding
      const flatForExamples: Array<{ path: string; exampleCode?: string }> = [];
      const _collect = (n: FolderNode, p: string) => {
        const cur = p ? `${p}/${n.name}` : n.name;
        if (n.exampleCode)
          flatForExamples.push({ path: cur, exampleCode: n.exampleCode });
        n.children?.forEach((c) => _collect(c, cur));
      };
      _collect(standard.folderStructure, "");
      const sampleExample =
        flatForExamples
          .find((f) => f.exampleCode)
          ?.exampleCode?.slice(0, 400) || "";
      return {
        success: true,
        data: {
          featureName,
          framework: standard.framework,
          root: rootName,
          suggestedPaths: isInternalBase
            ? [
                `${base}/domain/${featureName}.go`,
                `${base}/usecase/${featureName}.go`,
                `${base}/delivery/http/${featureName}_handler.go`,
              ]
            : [
                `${base}/components/${featureName}-card.tsx`,
                `${base}/hooks/use-${featureName}-query.ts`,
                `${base}/schemas/${featureName}-schema.ts`,
                `${base}/types/${featureName}.ts`,
              ],
          instructions: `VIBE CODING STEPS for "${featureName}" in ${standard.framework}:\n1. Call get_my_project_standard & get_folder_rules for "${base}" to read rules.\n2. Create folders exactly as suggestedPaths (kebab-case, ${standard.globalRules.namingConvention}).\n3. For each file, use exampleCode pattern from those folder rules (Inspector boilerplate). Root is "${rootName}". Styling: ${standard.globalRules.styling}. Principles: ${standard.globalRules.principles.join(", ")}.\n4. Validate each path via validate_structure before writing.\n5. Keep imports isolated per feature (no cross-feature).`,
          exampleBoilerplateHint: sampleExample
            ? `Reference boilerplate from standard (truncated):\n${sampleExample}`
            : "Use naming " + standard.globalRules.namingConvention,
        },
      };
    }
    case "validate_structure": {
      const proposedPath = args.arguments.proposedPath as string;
      if (!proposedPath)
        return { success: false, error: "proposedPath is required" };
      const fileName = proposedPath.split("/").pop() || "";
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
      if (nameWithoutExt && !/^[a-z0-9-.]+$/.test(nameWithoutExt)) {
        return {
          success: true,
          data: {
            valid: false,
            reason: "Use kebab-case for file name (e.g., contoh-file.ts)",
          },
        };
      }
      const rootName = standard.folderStructure.name;
      if (!proposedPath.startsWith(`${rootName}/`)) {
        return {
          success: true,
          data: {
            valid: false,
            reason: `Path must start with "${rootName}/" per this standard (${standard.framework}) — got "${proposedPath}"`,
          },
        };
      }
      // Also verify path does not escape allowed structure: check parent exists in tree (soft check)
      const parentPath = proposedPath.substring(
        0,
        proposedPath.lastIndexOf("/"),
      );
      const parentNode = parentPath
        ? findNodeByPath(standard.folderStructure, parentPath)
        : standard.folderStructure;
      if (!parentNode) {
        return {
          success: true,
          data: {
            valid: false,
            reason: `Parent folder "${parentPath}" not found in standard — create it first via scaffold_feature`,
          },
        };
      }
      return {
        success: true,
        data: {
          valid: true,
          reason: "Path complies with standard",
          parentRules: parentNode.rules || "",
        },
      };
    }
    default:
      return { success: false, error: `Unknown tool: ${args.tool}` };
  }
};

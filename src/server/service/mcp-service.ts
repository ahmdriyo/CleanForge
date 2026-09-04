import { getStandardById } from "@/server/repository/standard-repository";
import type { FolderNode } from "@/types/standard";
import type { McpToolDefinition } from "@/types/mcp.type";

/**
 * MCP Service — 4 tools, read-only, based on user's standard
 */

export const getMcpToolDefinitions = (): McpToolDefinition[] => [
  {
    name: "get_my_project_standard",
    description: "Get the full project standard including folder structure and global rules",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_folder_rules",
    description: "Get rules, naming convention and example code for a specific folder path",
    inputSchema: {
      type: "object",
      properties: { path: { type: "string", description: "Folder path e.g. src/features/auth" } },
      required: ["path"],
    },
  },
  {
    name: "scaffold_feature",
    description: "Suggest file paths and instructions to scaffold a new feature following the standard",
    inputSchema: {
      type: "object",
      properties: { featureName: { type: "string", description: "Feature name in kebab-case" } },
      required: ["featureName"],
    },
  },
  {
    name: "validate_structure",
    description: "Validate if a proposed file path complies with the standard",
    inputSchema: {
      type: "object",
      properties: { proposedPath: { type: "string", description: "Proposed file path e.g. src/features/payment/payment-card.tsx" } },
      required: ["proposedPath"],
    },
  },
];

const findNodeByPath = (root: FolderNode, path: string): FolderNode | null => {
  const parts = path.replace(/^src\//, "").split("/").filter(Boolean);
  let current: FolderNode | undefined = root;
  // root is src, so traverse
  if (path === "src" || path === "src/") return root;
  for (const part of parts) {
    if (!current?.children) return null;
    current = current.children.find((c) => c.name === part);
    if (!current) return null;
  }
  return current || null;
};

const treeToText = (node: FolderNode, depth = 0): string => {
  const indent = "  ".repeat(depth);
  let out = `${indent}${node.name}${node.type === "folder" ? "/" : ""}${node.naming ? ` (${node.naming})` : ""}\n`;
  if (node.children) {
    for (const child of node.children) {
      out += treeToText(child, depth + 1);
    }
  }
  return out;
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
          },
        },
      };
    }
    case "get_folder_rules": {
      const path = args.arguments.path as string;
      if (!path) return { success: false, error: "path is required" };
      const node = findNodeByPath(standard.folderStructure, path);
      if (!node) return { success: false, error: `Folder not found: ${path}` };
      return {
        success: true,
        data: {
          path,
          rules: node.rules || "",
          naming: node.naming || standard.globalRules.namingConvention,
          exampleCode: node.exampleCode || "",
          description: node.description || "",
        },
      };
    }
    case "scaffold_feature": {
      const featureName = args.arguments.featureName as string;
      if (!featureName) return { success: false, error: "featureName is required" };
      if (!/^[a-z0-9-]+$/.test(featureName)) {
        return { success: false, error: "Use kebab-case for featureName" };
      }
      const base = `src/features/${featureName}`;
      return {
        success: true,
        data: {
          featureName,
          suggestedPaths: [
            `${base}/components/${featureName}-card.tsx`,
            `${base}/hooks/use-${featureName}-query.ts`,
            `${base}/schemas/${featureName}-schema.ts`,
          ],
          instructions: `Create feature in ${base}/ with components/, hooks/, schemas/. Use ${standard.globalRules.namingConvention} and ${standard.globalRules.styling}.`,
        },
      };
    }
    case "validate_structure": {
      const proposedPath = args.arguments.proposedPath as string;
      if (!proposedPath) return { success: false, error: "proposedPath is required" };
      // kebab-case check: filename part must be kebab-case
      const fileName = proposedPath.split("/").pop() || "";
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
      if (nameWithoutExt && !/^[a-z0-9-.]+$/.test(nameWithoutExt)) {
        return { success: true, data: { valid: false, reason: "Use kebab-case for file name (e.g., contoh-file.ts)" } };
      }
      // Must be under src/features or src/components or src/server per standard
      if (!proposedPath.startsWith("src/features/") && !proposedPath.startsWith("src/components/") && !proposedPath.startsWith("src/server/")) {
        return { success: true, data: { valid: false, reason: "Path must be in src/features/, src/components/, or src/server/ per standard" } };
      }
      return { success: true, data: { valid: true, reason: "Path complies with standard" } };
    }
    default:
      return { success: false, error: `Unknown tool: ${args.tool}` };
  }
};

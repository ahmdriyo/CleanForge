export type Framework =
  | "nextjs"
  | "golang"
  | "go"
  | "react"
  | "vue"
  | "express"
  | "nestjs"
  | "laravel"
  | "fastapi"
  | "django"
  | "flutter"
  | "custom"
  | (string & {});

export type NamingConvention = "kebab-case" | "PascalCase" | "camelCase";

export interface FolderNode {
  id: string;
  name: string;
  type: "folder" | "file";
  rules?: string;
  naming?: NamingConvention;
  exampleCode?: string;
  description?: string;
  children?: FolderNode[];
}

export interface Standard {
  id: string;
  name: string;
  framework: Framework;
  description: string;
  folderStructure: FolderNode;
  globalRules: {
    namingConvention: NamingConvention;
    stateManagement: string;
    styling: string;
    principles: string[];
  };
  mcpStatus: "active" | "inactive" | "draft";
  mcpEndpoint: string;
  mcpToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  hasApply?: boolean;
}

export interface Template {
  id: string;
  name: string;
  framework: string;
  structurePreview: string;
  description: string;
  icon: string;
  accent: string;
  rules: string;
  folderStructure: FolderNode;
}

export interface McpEndpoint {
  id: string;
  name: string;
  standardId: string;
  standardName: string;
  endpoint: string;
  token: string;
  status: "active" | "inactive";
  usageCount: number;
  createdAt: string;
}

export interface DocSection {
  id: string;
  title: string;
  content: string;
  code?: string;
}

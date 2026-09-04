/**
 * MCP Types — synced FE/BE
 * Firestore: users/{uid}/standards/{standardId} + users/{uid}/mcps/{mcpId}
 * SSE Bearer JWT
 */

export interface McpTokenPayload {
  uid: string;
  standardId: string;
  iat: number;
  exp: number;
}

export interface GenerateMcpRequest {
  standardId: string;
}

export interface GenerateMcpResponse {
  endpoint: string;
  endpointFull: string;
  token: string; // plaintext once
  expiresAt: string;
}

export interface McpListResponse {
  mcps: import("./standard").McpEndpoint[];
}

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export type McpToolName =
  | "get_my_project_standard"
  | "get_folder_rules"
  | "scaffold_feature"
  | "validate_structure";

export interface McpToolCallRequest {
  tool: McpToolName;
  arguments: Record<string, unknown>;
}

export interface McpToolCallResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

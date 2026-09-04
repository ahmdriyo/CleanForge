import { McpService } from "@/services/mcp.service";
import { useQuery } from "@tanstack/react-query";
import type { McpEndpoint } from "@/types/standard";
import type { ApiResponse } from "@/types/api.type";

export const MCP_QUERY_KEYS = {
  all: ["mcps"] as const,
};

export const useMcps = () => {
  return useQuery({
    queryKey: MCP_QUERY_KEYS.all,
    queryFn: () => McpService.getMcps(),
    select: (res: ApiResponse<McpEndpoint[]>) => (res.success ? res.data : []),
  });
};

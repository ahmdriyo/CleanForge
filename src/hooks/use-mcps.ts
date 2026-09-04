import { McpService } from "@/services/mcp.service";
import { useQuery } from "@tanstack/react-query";

export const MCP_QUERY_KEYS = {
  all: ["mcps"] as const,
};

export const useMcps = () => {
  return useQuery({
    queryKey: MCP_QUERY_KEYS.all,
    queryFn: () => McpService.getMcps(),
    select: (res: any) => res.data,
  });
};

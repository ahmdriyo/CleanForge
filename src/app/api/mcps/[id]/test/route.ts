import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/verify-id-token";
import { getMcpById, incrementMcpUsage } from "@/server/repository/mcp-repository";
import { getStandardById } from "@/server/repository/standard-repository";
import { getMcpToolDefinitions, callMcpTool } from "@/server/service/mcp-service";
import { isExpired } from "@/server/auth/verify-mcp-token";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  try {
    const mcp = await getMcpById(auth.uid, id);
    if (!mcp) return NextResponse.json({ success: false, message: "MCP not found" }, { status: 404 });

    // Also verify standard exists and belongs to user
    const standard = await getStandardById(auth.uid, mcp.standardId);
    if (!standard) return NextResponse.json({ success: false, message: "Standard not found" }, { status: 404 });

    // Check expiry (prefer standard's mcpExpiresAt, fallback to mcp expiresAt)
    const expiresAt = (standard as unknown as { mcpExpiresAt?: string | null }).mcpExpiresAt ?? mcp.expiresAt ?? null;
    if (expiresAt && isExpired(expiresAt)) {
      return NextResponse.json({ success: false, message: "MCP expired — please regenerate" }, { status: 400 });
    }

    // Increment usage
    await incrementMcpUsage(auth.uid, mcp.id);

    // Real test: call get_my_project_standard + list tools
    const tools = getMcpToolDefinitions();
    const callResult = await callMcpTool({ uid: auth.uid, standardId: mcp.standardId, tool: "get_my_project_standard", arguments: {} });

    return NextResponse.json({
      success: true,
      data: {
        tools,
        sampleData: callResult.success ? callResult.data : null,
        endpoint: mcp.endpoint,
        standardName: mcp.standardName,
        requireToken: mcp.requireToken ?? false,
        expiresAt,
      },
      message: callResult.success ? "Connection OK — tools/list" : "MCP reachable but tool failed",
    });
  } catch (e) {
    console.error("POST /api/mcps/[id]/test error", e);
    return NextResponse.json({ success: false, message: "Failed to test MCP" }, { status: 500 });
  }
}

import { getMcpTokenFromHeader, verifyMcpJwt, isExpired, hashToken } from "@/server/auth/verify-mcp-token";
import { getMcpToolDefinitions, callMcpTool } from "@/server/service/mcp-service";
import { adminDb } from "@/server/infra/firebase-admin";

// Helper to create SSE response
const createSseResponse = (data: unknown) => {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  return new Response(payload, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};

const checkMcpAccess = async (
  uid: string,
  standardId: string,
  req: Request,
): Promise<{ ok: true } | { ok: false; response: Response }> => {
  // Load standard to check requireToken + expiresAt
  const ref = adminDb.doc(`users/${uid}/standards/${standardId}`);
  const doc = await ref.get();
  if (!doc.exists) {
    return {
      ok: false,
      response: Response.json({ success: false, message: "Standard not found" }, { status: 404 }),
    };
  }
  const data = doc.data() as { mcpExpiresAt?: string | null; mcpRequireToken?: boolean; mcpToken?: string | null };
  const expiresAt = data.mcpExpiresAt ?? null;
  const requireToken = data.mcpRequireToken ?? false;

  // Check expiry first
  if (expiresAt && isExpired(expiresAt)) {
    return {
      ok: false,
      response: Response.json({ success: false, message: "MCP endpoint expired — regenerate with new expiry" }, { status: 401 }),
    };
  }

  if (!requireToken) {
    // No token required — allow access
    return { ok: true };
  }

  const token = getMcpTokenFromHeader(req);
  if (!token) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ success: false, message: "Missing Authorization: Bearer <JWT>" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    };
  }

  const payload = await verifyMcpJwt(token);
  if (!payload || payload.uid !== uid || payload.standardId !== standardId) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ success: false, message: "Invalid or expired MCP token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    };
  }
  // Revocation check: token hash must match stored hash
  const storedHash = data.mcpToken ?? null;
  if (storedHash) {
    const incomingHash = hashToken(token);
    if (incomingHash !== storedHash) {
      return {
        ok: false,
        response: new Response(JSON.stringify({ success: false, message: "MCP token revoked — regenerate required" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }),
      };
    }
  }
  return { ok: true };
};

export async function GET(req: Request, { params }: { params: Promise<{ uid: string; standardId: string }> }) {
  const { uid, standardId } = await params;

  const access = await checkMcpAccess(uid, standardId, req);
  if (!access.ok) return access.response;

  const url = new URL(req.url);
  const method = url.searchParams.get("method");

  // Default: behavior depends on Accept
  // - SSE clients (Cursor/Claude mcp-remote) send Accept: text/event-stream -> return tools/list SSE (spec)
  // - Browser / fetch without SSE -> return FULL standard enriched + tools so MCP URL looks 1:1 with Project Structure
  if (!method || method === "tools/list") {
    const tools = getMcpToolDefinitions();
    const isSse = req.headers.get("accept")?.includes("text/event-stream");
    if (isSse) {
      // For SSE clients that only do GET tools/list, keep spec-compliant
      // But also support ?full=1 to get enriched in same SSE stream
      if (url.searchParams.get("full") === "1") {
        const stdResult = await callMcpTool({ uid, standardId, tool: "get_my_project_standard", arguments: {} });
        return createSseResponse({ jsonrpc: "2.0", result: { tools, standard: stdResult.success ? stdResult.data : null } });
      }
      return createSseResponse({ jsonrpc: "2.0", result: { tools } });
    }
    // Non-SSE (browser, curl -H "Accept: application/json"): return enriched complete data so URL appears complete
    // This satisfies requirement: MCP Endpoint data selengkap Project Structure
    if (!method) {
      const stdResult = await callMcpTool({ uid, standardId, tool: "get_my_project_standard", arguments: {} });
      if (stdResult.success) {
        return Response.json({
          jsonrpc: "2.0",
          result: {
            tools,
            standard: stdResult.data,
            hint: "Full Project Structure — same as Forge Visual Tree + Inspector. Use ?method=get_my_project_standard&raw=1 for raw, or POST tools/call for MCP clients.",
          },
        });
      }
    }
    return Response.json({ jsonrpc: "2.0", result: { tools } });
  }

  // Direct tool call via GET query for browser debugging — makes MCP URL appear "complete"
  // e.g. /mcp/uid/id?method=get_my_project_standard
  //      /mcp/uid/id?method=get_folder_rules&path=src/features/auth
  //      /mcp/uid/id?method=scaffold_feature&featureName=payment
  if (["get_my_project_standard", "get_folder_rules", "scaffold_feature", "validate_structure"].includes(method)) {
    const args: Record<string, unknown> = {};
    url.searchParams.forEach((value, key) => {
      if (key !== "method") args[key] = value;
    });
    const result = await callMcpTool({ uid, standardId, tool: method, arguments: args });
    if (!result.success) {
      if (req.headers.get("accept")?.includes("text/event-stream")) {
        return createSseResponse({ jsonrpc: "2.0", error: { code: -32603, message: result.error } });
      }
      return Response.json({ jsonrpc: "2.0", error: { code: -32603, message: result.error } }, { status: 400 });
    }
    if (req.headers.get("accept")?.includes("text/event-stream")) {
      return createSseResponse({ jsonrpc: "2.0", result: { content: [{ type: "text", text: JSON.stringify(result.data, null, 2) }] } });
    }
    // For direct browser view, return raw data (no JSON-RPC wrapper) when ?raw=1 or Accept: application/json without SSE
    if (url.searchParams.get("raw") === "1") {
      return Response.json(result.data);
    }
    return Response.json({ jsonrpc: "2.0", result: { content: [{ type: "text", text: JSON.stringify(result.data, null, 2) }], data: result.data } });
  }

  return Response.json({ error: "Unsupported method", hint: "Use ?method=tools/list or ?method=get_my_project_standard&raw=1" }, { status: 400 });
}

export async function POST(req: Request, { params }: { params: Promise<{ uid: string; standardId: string }> }) {
  const { uid, standardId } = await params;

  const access = await checkMcpAccess(uid, standardId, req);
  if (!access.ok) return access.response;

  try {
    const body = await req.json();
    const { method, params: callParams, id } = body;

    if (method === "initialize") {
      return Response.json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "cleanforge-mcp", version: "1.0.0" },
        },
      });
    }

    if (method === "tools/list") {
      const tools = getMcpToolDefinitions();
      return Response.json({ jsonrpc: "2.0", id, result: { tools } });
    }

    if (method === "tools/call") {
      const { name, arguments: args } = callParams || {};
      const result = await callMcpTool({ uid, standardId, tool: name, arguments: args || {} });
      if (!result.success) {
        return Response.json({ jsonrpc: "2.0", id, error: { code: -32603, message: result.error } });
      }
      return Response.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: JSON.stringify(result.data, null, 2) }],
        },
      });
    }

    // MCP lifecycle notifications — must return 202 Accepted, not 404
    if (method === "notifications/initialized" || (method && method.startsWith("notifications/"))) {
      // No response body for notifications
      return new Response(null, { status: 202 });
    }

    if (method === "ping") {
      return Response.json({ jsonrpc: "2.0", id, result: {} });
    }

    return Response.json({ jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } }, { status: 404 });
  } catch (e) {
    console.error("MCP POST error", e);
    return Response.json({ jsonrpc: "2.0", error: { code: -32603, message: "Internal error" } }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/verify-id-token";
import { getStandardById, getMcpConfig } from "@/server/repository/standard-repository";
import { generateMcpToken } from "@/server/service/token-service";
import { isExpired } from "@/server/auth/verify-mcp-token";
import { findMcpByStandardId } from "@/server/repository/mcp-repository";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth.error;
  const { id } = await params;
  try {
    const standard = await getStandardById(auth.uid, id);
    if (!standard) return NextResponse.json({ success: false, message: "Standard not found" }, { status: 404 });

    const mcpConfig = await getMcpConfig(auth.uid, id);
    if (!mcpConfig || !mcpConfig.endpoint) {
      return NextResponse.json({ success: true, data: null });
    }

    const host = req.headers.get("host") || "cleanforge.run.app";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const endpointFull = `${protocol}://${host}${mcpConfig.endpoint}`;
    const expired = isExpired(mcpConfig.expiresAt);

    // also try to enrich from mcps denormalized doc for usageCount etc
    const mcpDoc = await findMcpByStandardId(auth.uid, id);

    return NextResponse.json({
      success: true,
      data: {
        endpoint: mcpConfig.endpoint,
        endpointFull,
        expiresAt: mcpConfig.expiresAt,
        requireToken: mcpConfig.requireToken,
        isExpired: expired,
        isActive: !expired && !!mcpConfig.endpoint,
        hasToken: !!mcpConfig.tokenHash,
        // denormalized extras
        status: mcpDoc?.status || (expired ? "expired" : "active"),
        usageCount: mcpDoc?.usageCount || 0,
        mcpId: mcpDoc?.id || null,
      },
    });
  } catch (e) {
    console.error("GET /api/standards/[id]/generate-mcp error", e);
    return NextResponse.json({ success: false, message: "Failed to fetch MCP" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  try {
    const standard = await getStandardById(auth.uid, id);
    if (!standard) return NextResponse.json({ success: false, message: "Standard not found" }, { status: 404 });

    let body: { expiresInDays?: number | null; requireToken?: boolean } = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    // Default per spec: 1 day, no token
    const expiresInDays = body.expiresInDays !== undefined ? body.expiresInDays : 1;
    const requireToken = body.requireToken ?? false;

    // Validate expiresInDays: allowed null (never), or positive integer
    if (expiresInDays !== null && expiresInDays !== undefined) {
      if (typeof expiresInDays !== "number" || expiresInDays <= 0) {
        return NextResponse.json({ success: false, message: "expiresInDays must be positive number or null" }, { status: 400 });
      }
    }

    const host = req.headers.get("host") || "cleanforge.run.app";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const endpointPath = `/mcp/${auth.uid}/${id}`;
    const endpointFull = `${protocol}://${host}${endpointPath}`;

    const result = await generateMcpToken({
      uid: auth.uid,
      standardId: id,
      standardName: standard.name,
      endpointPath,
      endpointFull,
      expiresInDays,
      requireToken,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (e) {
    console.error("POST /api/standards/[id]/generate-mcp error", e);
    return NextResponse.json({ success: false, message: "Failed to generate MCP" }, { status: 500 });
  }
}

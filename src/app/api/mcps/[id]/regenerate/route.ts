import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/verify-id-token";
import { getMcpById } from "@/server/repository/mcp-repository";
import { getStandardById } from "@/server/repository/standard-repository";
import { generateMcpToken } from "@/server/service/token-service";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  try {
    const mcp = await getMcpById(auth.uid, id);
    if (!mcp) return NextResponse.json({ success: false, message: "MCP not found" }, { status: 404 });

    const standard = await getStandardById(auth.uid, mcp.standardId);
    if (!standard) return NextResponse.json({ success: false, message: "Standard not found" }, { status: 404 });

    let body: { expiresInDays?: number | null; requireToken?: boolean } = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const expiresInDays = body.expiresInDays !== undefined ? body.expiresInDays : (mcp.expiresAt ? undefined : 1);
    // If expiresInDays undefined and mcp has previous expiry, compute remaining? For simplicity if not provided, keep previous requireToken and recompute expires with 1 day
    // Actually we want to respect passed values; if not passed, preserve previous settings but regenerate token with same expiry duration (default 1 if never)
    let finalExpires: number | null | undefined = body.expiresInDays;
    let finalRequire = body.requireToken;

    if (finalExpires === undefined) {
      // preserve: if previously never (null), keep null; else 1
      const prevExpiresAt = mcp.expiresAt;
      if (prevExpiresAt === null || prevExpiresAt === undefined) {
        finalExpires = null;
      } else {
        // keep same duration? simplest default 1 day
        finalExpires = 1;
      }
    }
    if (finalRequire === undefined) {
      finalRequire = mcp.requireToken ?? false;
    }

    if (finalExpires !== null && finalExpires !== undefined && (typeof finalExpires !== "number" || finalExpires <= 0)) {
      return NextResponse.json({ success: false, message: "expiresInDays must be positive number or null" }, { status: 400 });
    }

    const host = req.headers.get("host") || "cleanforge.run.app";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const endpointPath = `/mcp/${auth.uid}/${mcp.standardId}`;
    const endpointFull = `${protocol}://${host}${endpointPath}`;

    const result = await generateMcpToken({
      uid: auth.uid,
      standardId: mcp.standardId,
      standardName: standard.name,
      endpointPath,
      endpointFull,
      expiresInDays: finalExpires as number | null,
      requireToken: finalRequire,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (e) {
    console.error("POST /api/mcps/[id]/regenerate error", e);
    return NextResponse.json({ success: false, message: "Failed to regenerate MCP" }, { status: 500 });
  }
}

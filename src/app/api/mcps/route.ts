import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/verify-id-token";
import { getMcps } from "@/server/repository/mcp-repository";
import { isExpired } from "@/server/auth/verify-mcp-token";

export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    const mcps = await getMcps(auth.uid);
    // Enrich status with expiry check (never expires if null)
    const enriched = mcps.map((m) => {
      if (m.expiresAt && isExpired(m.expiresAt)) {
        return { ...m, status: "expired" as const };
      }
      return m;
    });
    return NextResponse.json({ success: true, data: enriched });
  } catch (e) {
    console.error("GET /api/mcps error", e);
    return NextResponse.json({ success: false, message: "Failed to fetch MCPs" }, { status: 500 });
  }
}

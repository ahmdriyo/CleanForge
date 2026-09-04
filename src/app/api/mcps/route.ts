import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/verify-id-token";
import { getMcps } from "@/server/repository/mcp-repository";

export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    const mcps = await getMcps(auth.uid);
    return NextResponse.json({ success: true, data: mcps });
  } catch (e) {
    console.error("GET /api/mcps error", e);
    return NextResponse.json({ success: false, message: "Failed to fetch MCPs" }, { status: 500 });
  }
}

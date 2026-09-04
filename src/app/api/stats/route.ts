import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/verify-id-token";
import { getStandards } from "@/server/repository/standard-repository";
import { getMcps } from "@/server/repository/mcp-repository";

export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    const [standards, mcps] = await Promise.all([getStandards(auth.uid), getMcps(auth.uid)]);
    const activeMcps = mcps.filter((m) => m.status === "active").length;
    const totalFeatures = standards.reduce((acc, s) => acc + (s.folderStructure.children?.length || 0), 0);
    const avgFeatures = standards.length ? Number((totalFeatures / standards.length).toFixed(1)) : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalStandards: standards.length,
        activeMcps,
        templatesUsed: 3,
        avgFeatures,
      },
    });
  } catch (e) {
    console.error("GET /api/stats error", e);
    return NextResponse.json({ success: false, message: "Failed to fetch stats" }, { status: 500 });
  }
}

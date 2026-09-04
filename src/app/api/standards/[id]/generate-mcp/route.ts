import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/verify-id-token";
import { getStandardById } from "@/server/repository/standard-repository";
import { generateMcpToken } from "@/server/service/token-service";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  try {
    const standard = await getStandardById(auth.uid, id);
    if (!standard) return NextResponse.json({ success: false, message: "Standard not found" }, { status: 404 });

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
    });

    return NextResponse.json({ success: true, data: result });
  } catch (e) {
    console.error("POST /api/standards/[id]/generate-mcp error", e);
    return NextResponse.json({ success: false, message: "Failed to generate MCP" }, { status: 500 });
  }
}

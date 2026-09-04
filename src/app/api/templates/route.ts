import { NextResponse } from "next/server";
import { getTemplates } from "@/server/repository/template-repository";

export async function GET() {
  try {
    const templates = await getTemplates();
    return NextResponse.json({ success: true, data: templates });
  } catch (e) {
    console.error("GET /api/templates error", e);
    return NextResponse.json({ success: false, message: "Failed to fetch templates" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/verify-id-token";
import { getJournals, getJournalByStandardId } from "@/server/repository/journal-repository";

export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    const { searchParams } = new URL(req.url);
    const standardId = searchParams.get("standardId");

    if (standardId) {
      const journal = await getJournalByStandardId(auth.uid, standardId);
      return NextResponse.json({ success: true, data: journal ? [journal] : [] });
    }

    const journals = await getJournals(auth.uid);
    return NextResponse.json({ success: true, data: journals });
  } catch (e) {
    console.error("GET /api/journals error", e);
    return NextResponse.json({ success: false, message: "Failed to fetch journals" }, { status: 500 });
  }
}

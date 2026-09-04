import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/verify-id-token";
import { adminDb } from "@/server/infra/firebase-admin";

export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    const userDoc = await adminDb.doc(`users/${auth.uid}`).get();
    const data = userDoc.exists ? userDoc.data() : null;
    return NextResponse.json({
      success: true,
      data: {
        uid: auth.uid,
        email: auth.email,
        ...data,
      },
    });
  } catch (e) {
    console.error("GET /api/auth/me error", e);
    return NextResponse.json({ success: false, message: "Failed to fetch user" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { verifyIdToken } from "@/server/auth/verify-id-token";
import { adminDb } from "@/server/infra/firebase-admin";
import { z } from "zod";

const schema = z.object({ idToken: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, message: "Invalid token" }, { status: 400 });

    const verified = await verifyIdToken(parsed.data.idToken);
    if (!verified) return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });

    const ref = adminDb.doc(`users/${verified.uid}`);
    const snap = await ref.get();
    if (!snap.exists) {
      await ref.set({
        uid: verified.uid,
        email: verified.email,
        provider: "google",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      await ref.update({ updatedAt: new Date().toISOString() });
    }

    const res = NextResponse.json({ success: true, data: { uid: verified.uid, email: verified.email } });
    res.cookies.set("accessToken", parsed.data.idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return res;
  } catch (e) {
    console.error("POST /api/auth/google error", e);
    return NextResponse.json({ success: false, message: "Failed to verify Google token" }, { status: 500 });
  }
}

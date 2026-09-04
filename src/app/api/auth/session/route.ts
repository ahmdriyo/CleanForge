import { NextResponse } from "next/server";
import { verifyIdToken } from "@/server/auth/verify-id-token";
import { adminDb } from "@/server/infra/firebase-admin";
import { z } from "zod";

const sessionSchema = z.object({
  idToken: z.string().min(1, "ID token required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = sessionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 400 });
    }

    const verified = await verifyIdToken(parsed.data.idToken);
    if (!verified) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    // Create or update user doc in Firestore (isolated)
    const userRef = adminDb.doc(`users/${verified.uid}`);
    const snap = await userRef.get();
    if (!snap.exists) {
      await userRef.set({
        uid: verified.uid,
        email: verified.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      await userRef.update({ updatedAt: new Date().toISOString() });
    }

    const res = NextResponse.json({
      success: true,
      data: { uid: verified.uid, email: verified.email },
      message: "Session verified",
    });

    // Set httpOnly cookie for server-side auth (optional, for API routes that read cookie)
    res.cookies.set("accessToken", parsed.data.idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return res;
  } catch (e) {
    console.error("POST /api/auth/session error", e);
    return NextResponse.json({ success: false, message: "Failed to verify session" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

export async function GET() {
  // Runtime config — read from server env (set via --set-env-vars, not build-time inlining)
  // Support both NEXT_PUBLIC_* and non-prefixed for flexibility
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || "",
  };

  // Never expose dummy
  if (!config.apiKey || config.apiKey === "dummy") {
    return NextResponse.json({ error: "Firebase config not set" }, { status: 500 });
  }

  return NextResponse.json(config);
}

import { adminAuth } from "@/server/infra/firebase-admin";
import type { VerifyTokenResult } from "@/types/auth.type";

/**
 * Verify Firebase ID Token from Authorization: Bearer <token>
 */
export const verifyIdToken = async (token: string): Promise<VerifyTokenResult | null> => {
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email ?? null };
  } catch {
    return null;
  }
};

export const getTokenFromHeader = (req: Request): string | null => {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
};

export const requireAuth = async (req: Request): Promise<{ uid: string; email: string | null } | { error: Response }> => {
  const token = getTokenFromHeader(req);
  if (!token) {
    return {
      error: Response.json({ success: false, message: "Unauthorized" }, { status: 401 }),
    };
  }
  const verified = await verifyIdToken(token);
  if (!verified) {
    return {
      error: Response.json({ success: false, message: "Invalid or expired token" }, { status: 401 }),
    };
  }
  return verified;
};

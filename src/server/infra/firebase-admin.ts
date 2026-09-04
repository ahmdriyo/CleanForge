import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  // Prefer separate env vars (easier for Secret Manager / Vercel)
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (projectId && clientEmail && privateKeyRaw) {
    const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else {
    // Fallback: GOOGLE_APPLICATION_CREDENTIALS as JSON string or file path
    const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (serviceAccount) {
      try {
        const credentials = JSON.parse(serviceAccount);
        initializeApp({ credential: cert(credentials) });
      } catch {
        // If not JSON, try as file path via applicationDefault or cert from env
        try {
          initializeApp();
        } catch {
          initializeApp();
        }
      }
    } else {
      // Final fallback: Cloud Run ambient service account
      initializeApp();
    }
  }
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();

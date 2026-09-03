import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (serviceAccount) {
    try {
      const credentials = JSON.parse(serviceAccount);
      initializeApp({ credential: cert(credentials) });
    } catch {
      // fallback to applicationDefault (gcloud ambient)
      initializeApp();
    }
  } else {
    initializeApp();
  }
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();

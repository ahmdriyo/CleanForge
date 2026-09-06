// Firebase Client — reads runtime config from window.__FIREBASE_CONFIG__ (injected by layout.tsx)
// Fallback to build-time NEXT_PUBLIC_* for local dev where window config not yet set
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

declare global {
  interface Window {
    __FIREBASE_CONFIG__?: {
      apiKey?: string;
      authDomain?: string;
      projectId?: string;
      storageBucket?: string;
      messagingSenderId?: string;
      appId?: string;
    };
  }
}

const getFirebaseConfig = () => {
  // 1) Try runtime injection (Cloud Run — fixes key=dummy when build had dummy)
  if (typeof window !== "undefined" && window.__FIREBASE_CONFIG__?.apiKey && window.__FIREBASE_CONFIG__.apiKey !== "dummy") {
    return {
      apiKey: window.__FIREBASE_CONFIG__.apiKey!,
      authDomain: window.__FIREBASE_CONFIG__.authDomain!,
      projectId: window.__FIREBASE_CONFIG__.projectId!,
      storageBucket: window.__FIREBASE_CONFIG__.storageBucket,
      messagingSenderId: window.__FIREBASE_CONFIG__.messagingSenderId,
      appId: window.__FIREBASE_CONFIG__.appId,
    };
  }
  // 2) Fallback to build-time env (local dev)
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
};

let firebaseConfig = getFirebaseConfig();

let app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig as never);
export let auth = getAuth(app);
export let db = getFirestore(app);

// If still dummy on client (build had dummy, window injection was empty), fetch runtime config from server
// This handles the case where Next.js inlined NEXT_PUBLIC as "dummy" at build time
if (typeof window !== "undefined" && (!firebaseConfig.apiKey || firebaseConfig.apiKey === "dummy")) {
  // Avoid infinite reload loop
  const hasRetried = sessionStorage.getItem("__firebase_retry__") === "1";
  fetch("/api/firebase-config")
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data?.apiKey && data.apiKey !== "dummy") {
        window.__FIREBASE_CONFIG__ = data;
        const currentApiKey = (app.options as unknown as { apiKey?: string })?.apiKey;
        if (!currentApiKey || currentApiKey === "dummy") {
          if (!hasRetried) {
            sessionStorage.setItem("__firebase_retry__", "1");
            // Reload so that next load will have correct window.__FIREBASE_CONFIG__ before initializeApp
            window.location.reload();
          } else {
            // Fallback: try to reinit without reload (for subsequent attempts)
            import("firebase/app").then(({ deleteApp, initializeApp: init }) => {
              deleteApp(app)
                .catch(() => {})
                .finally(() => {
                  const newApp = init(data as never);
                  auth = getAuth(newApp);
                  db = getFirestore(newApp);
                  window.dispatchEvent(new CustomEvent("firebase:ready"));
                });
            });
          }
        }
      }
    })
    .catch(() => {});
} else if (typeof window !== "undefined") {
  // Clear retry flag when we have good config
  try { sessionStorage.removeItem("__firebase_retry__"); } catch {}
}

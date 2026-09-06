"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  idToken: string | null;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  idToken: null,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIdToken(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
      }
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          setIdToken(token);
          // Sync to server (create Firestore user doc + httpOnly cookie)
          await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: token }),
          });
        } catch {
          setIdToken(null);
        }
      } else {
        setIdToken(null);
        // Clear cookie on logout
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, idToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

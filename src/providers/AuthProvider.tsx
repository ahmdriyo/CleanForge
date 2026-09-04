"use client";

import { createContext, ReactNode, useContext } from "react";

/**
 * AuthProvider — placeholder for Firebase Auth context.
 * Will hold user, loading, login/logout in the future.
 * Currently a thin pass-through to keep provider tree stable
 * and allow future auth logic without touching layout.
 */
type AuthContextValue = Record<string, never>;

const AuthContext = createContext<AuthContextValue>({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // TODO: wire Firebase Auth (onAuthStateChanged, ID token refresh) here
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

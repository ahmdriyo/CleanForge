/**
 * Auth Types — synced FE/BE
 * Used by Firebase Auth + Bearer JWT middleware
 */

export interface AuthUser {
  uid: string;
  email: string | null;
  name: string | null;
  emailVerified: boolean;
  photoURL?: string | null;
}

export interface AuthPayload {
  uid: string;
  email?: string;
  role?: string;
}

export interface VerifyTokenResult {
  uid: string;
  email: string | null;
}

export interface ApiAuthHeader {
  authorization?: string;
}

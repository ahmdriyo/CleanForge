"use server";
import { cookies } from "next/headers";

export async function getToken() {
  return (await cookies()).get("accessToken")?.value ?? null;
}

export async function getRefreshToken() {
  return (await cookies()).get("refreshToken")?.value ?? null;
}

export async function saveTokens(accessToken: string, refreshToken: string) {
  (await cookies()).set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 1,
  });

  (await cookies()).set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearTokens() {
  (await cookies()).delete("accessToken");
  (await cookies()).delete("refreshToken");
}

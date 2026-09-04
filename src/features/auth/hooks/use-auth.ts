"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";

export const AUTH_QUERY_KEYS = {
  me: ["auth", "me"] as const,
};

export const useAuthMe = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me,
    queryFn: () => AuthService.me(),
    retry: false,
  });
};

export const useAuthSession = () => {
  return useMutation({
    mutationFn: (idToken: string) => AuthService.session(idToken),
  });
};

export const useAuthLogout = () => {
  return useMutation({
    mutationFn: () => AuthService.logout(),
  });
};

export const useAuthGoogle = () => {
  return useMutation({
    mutationFn: (idToken: string) => AuthService.google(idToken),
  });
};

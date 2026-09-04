import axios from "axios";
import { clearTokens, getToken } from "../utils/action";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const baseApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 100000,
  headers: { "Content-Type": "application/json" },
});

baseApi.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err);
    return Promise.reject(err);
  },
);

export const baseApiToken = axios.create({
  baseURL: API_BASE_URL,
  timeout: 100000,
  headers: { "Content-Type": "application/json" },
});

export const baseCustomerApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 100000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

baseCustomerApi.interceptors.request.use(
  (config) => {
    if (
      typeof FormData !== "undefined" &&
      config.data instanceof FormData &&
      config.headers
    ) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }
    return config;
  },
  (err) => Promise.reject(err),
);

baseApiToken.interceptors.request.use(
  async (config) => {
    if (
      typeof FormData !== "undefined" &&
      config.data instanceof FormData &&
      config.headers
    ) {
      // Let browser set multipart boundary automatically for FormData payloads.
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }

    // Try Firebase ID token from localStorage/sessionStorage first (client-side Firebase Auth), fallback to cookie token
    let token: string | null = null;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    }
    if (!token) {
      try {
        token = await getToken();
      } catch {
        token = null;
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err),
);

baseApiToken.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      try {
        await clearTokens();
      } catch {}
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
        // Only redirect if not already on auth page
        if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/register")) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(err);
  },
);

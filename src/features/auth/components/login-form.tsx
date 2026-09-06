"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/auth-schema";
import { auth } from "@/lib/firebase/client";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

export const LoginForm = () => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      const idToken = await cred.user.getIdToken();

      // Sync to server (creates Firestore user doc + httpOnly cookie)
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      // Also persist for baseApiToken interceptor (fallback)
      if (values.rememberMe) {
        localStorage.setItem("accessToken", idToken);
      } else {
        sessionStorage.setItem("accessToken", idToken);
      }

      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to sign in";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const idToken = await cred.user.getIdToken();

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to sync Google session");
      }

      localStorage.setItem("accessToken", idToken);
      toast.success("Signed in with Google");
      router.push("/dashboard");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Google sign-in failed";
      // Surface Firestore permission errors clearly
      if (msg.includes("Missing or insufficient permissions")) {
        toast.error("Firestore permission denied — please try again. If persists, contact admin.");
      } else {
        toast.error(msg);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
        <span className="font-semibold tracking-tight text-violet-950">
          CleanForge
        </span>
      </div>

      <div className="text-center lg:text-left mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Welcome Back
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Sign in to access your Standard Forge
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-slate-700">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-9 bg-white border-violet-100 rounded-xl focus-visible:ring-violet-500"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-xs font-medium text-slate-700"
          >
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="password"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              className="pl-9 pr-9 bg-white border-violet-100 rounded-xl focus-visible:ring-violet-500"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPass ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-violet-200 text-violet-600 focus:ring-violet-500"
              {...register("rememberMe")}
            />{" "}
            Remember me
          </label>
          <Link
            href="#"
            className="font-medium text-violet-700 hover:text-violet-900"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#e5318a] hover:bg-[#d81b60] text-white py-6 shadow-lg shadow-pink-500/20"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
        </Button>

        <div className="relative flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-xs text-slate-400">Or Continue With</span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full rounded-full bg-white border border-slate-200 py-6 hover:bg-slate-50"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <span className="flex items-center gap-2 font-medium text-slate-700">
              <FcGoogle className="w-5 h-5" /> Google
            </span>
          )}
        </Button>

        <p className="text-center text-xs text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-slate-900 hover:text-violet-700"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

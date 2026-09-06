"use client";

import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Mail, Shield, User, Crown, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

export const ProfilePage = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to logout");
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Profile</h1>
          <p className="text-sm text-slate-500">View your profile and account info</p>
        </div>
        <Card className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[20px] p-8 text-center">
          <p className="text-slate-500">Please sign in to view your profile</p>
          <Button className="mt-4 rounded-full bg-violet-600 hover:bg-violet-700" onClick={() => (window.location.href = "/login")}>
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Profile</h1>
        <p className="text-sm text-slate-500">View and manage your account</p>
      </div>

      {/* Profile Card */}
      <Card className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(59,130,246,0.12)]">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {(user.displayName?.[0] || user.email?.[0] || "U").toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-lg">{user.displayName || "Unnamed User"}</h3>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded-full text-xs">
                <Shield className="w-3 h-3 mr-1" /> Verified
              </Badge>
              <Badge variant="outline" className="rounded-full text-xs bg-white">
                UID: {user.uid.slice(0, 8)}...
              </Badge>
              {user.providerData?.[0]?.providerId === "google.com" && (
                <Badge className="bg-white border border-slate-200 rounded-full text-xs">Google</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white/60 rounded-xl border border-white/70 p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <User className="w-3 h-3" /> User ID
            </div>
            <div className="font-mono text-xs text-slate-700 mt-1 break-all">{user.uid}</div>
          </div>
          <div className="bg-white/60 rounded-xl border border-white/70 p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3 h-3" /> Email
            </div>
            <div className="text-sm text-slate-700 mt-1">{user.email}</div>
            <div className="text-xs text-slate-400">Provider: {user.providerData?.[0]?.providerId || "password"}</div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="rounded-full flex-1" onClick={() => toast("Edit profile coming soon")}>
            Edit Profile
          </Button>
          <Button className="rounded-full bg-red-600 hover:bg-red-700 text-white flex-1" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </Card>

      {/* Settings Options */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[20px] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium text-slate-900 text-sm">Preferences</h4>
              <p className="text-xs text-slate-500">Theme, notifications, language</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full rounded-full" onClick={() => toast("Preferences coming soon")}>
            Manage
          </Button>
        </Card>

        <Card className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[20px] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium text-slate-900 text-sm">Help & Feedback</h4>
              <p className="text-xs text-slate-500">Docs, support, feedback</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full rounded-full" onClick={() => (window.location.href = "/docs")}>
            Open Docs
          </Button>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-[20px] p-6 text-white border-0">
        <h4 className="font-semibold">Need help?</h4>
        <p className="text-sm text-violet-100 mt-1">Check our documentation or contact support for assistance with your standards and MCP endpoints.</p>
        <Button variant="secondary" size="sm" className="mt-4 rounded-full bg-white text-violet-700 hover:bg-violet-50" onClick={() => (window.location.href = "/docs")}>
          View Documentation
        </Button>
      </Card>
    </div>
  );
};

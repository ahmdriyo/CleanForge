"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Clock,
  Layers,
  Hammer,
  ShieldCheck,
  FlaskConical,
  Plug,
  LayoutTemplate,
  Store,
  BookOpen,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { CleanIcon } from "@/components/icons/clean-icon";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/analytics", icon: BarChart3, badge: "Soon" },
      { label: "Activity", href: "/activity", icon: Clock, badge: "Soon" },
    ],
  },
  {
    title: "FORGE",
    items: [
      { label: "My Standards", href: "/standards", icon: Layers },
      { label: "Forge Studio", href: "/forge/new", icon: Hammer },
      { label: "Validations", href: "/validations", icon: ShieldCheck, badge: "Soon" },
      { label: "Playground", href: "/playground", icon: FlaskConical, badge: "Soon" },
    ],
  },
  {
    title: "MCP & TEMPLATES",
    items: [
      { label: "My MCPs", href: "/mcps", icon: Plug },
      { label: "Templates", href: "/templates", icon: LayoutTemplate },
      { label: "Marketplace", href: "/marketplace", icon: Store, badge: "Soon" },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Documentation", href: "/docs", icon: BookOpen },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden lg:flex w-[280px] shrink-0 flex-col bg-white/55 backdrop-blur-2xl border-r border-white/60 h-screen sticky top-0 overflow-hidden shadow-[4px_0_32px_rgba(59,130,246,0.08)]">
      <div className="px-6 py-5 border-b border-white/60">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 text-white">
            <CleanIcon size={22} className="text-white" />
          </div>
          <div>
            <div className="text-[15px] font-semibold tracking-tight text-slate-900">CleanForge</div>
            <div className="text-[11px] font-medium tracking-widest text-slate-400 uppercase">Standard Forge</div>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-hidden px-4 py-5 space-y-5">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 px-3">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname?.startsWith(item.href)) ||
                  (item.label === "Forge Studio" && pathname?.startsWith("/forge"));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-full text-[13px] transition-all duration-200",
                      isActive
                        ? "bg-violet-100 text-violet-900 font-medium shadow-sm border border-violet-200/50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/75"
                    )}
                  >
                    <item.icon className="w-[18px] h-[18px] shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-medium bg-violet-100 text-violet-700 border border-violet-200 rounded-full px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/60">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm hover:bg-white/90 transition text-left">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {(user?.displayName?.[0] || user?.email?.[0] || "A").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{user?.displayName || user?.email?.split("@")[0] || "Alex Morgan"}</div>
                  <div className="text-xs text-slate-500 truncate">{user?.email || "alex@cleanforge.dev"}</div>
                </div>
              </button>
            }
          />
          <DropdownMenuContent side="top" align="start" className="w-64 bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl mb-2 ml-2">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.displayName || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" /> View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};

export const MobileSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  return (
    <div className="lg:hidden flex flex-col h-full bg-[#fbfbff]">
      <div className="px-6 py-6 border-b border-violet-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white">
          <CleanIcon size={22} className="text-white" />
        </div>
        <div>
          <div className="text-[15px] font-semibold text-slate-900">CleanForge</div>
          <div className="text-[11px] tracking-widest uppercase text-slate-400">Standard Forge</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 px-3">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-full text-sm",
                      isActive
                        ? "bg-violet-100 text-violet-900 font-medium border border-violet-200/50"
                        : "text-slate-500 hover:text-slate-900 hover:bg-white/65"
                    )}
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] bg-violet-100 text-violet-700 border border-violet-200 rounded-full px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-violet-100">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white border border-violet-100">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
            {(user?.displayName?.[0] || user?.email?.[0] || "A").toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">{user?.displayName || user?.email?.split("@")[0] || "User"}</div>
            <div className="text-xs text-slate-500 truncate">{user?.email || "Not signed in"}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button onClick={() => router.push("/profile")} className="flex items-center justify-center gap-1.5 py-2 rounded-full bg-white border border-violet-100 text-xs font-medium text-slate-700">
            <User className="w-3.5 h-3.5" /> Profile
          </button>
          <button onClick={logout} className="flex items-center justify-center gap-1.5 py-2 rounded-full bg-red-50 border border-red-200 text-xs font-medium text-red-600">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

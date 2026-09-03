"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

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
      { label: "Settings", href: "/settings", icon: Settings, badge: "Soon" },
    ],
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-[280px] shrink-0 flex-col bg-white/30 backdrop-blur-xl border-r border-white/40 h-screen sticky top-0 overflow-hidden">
      <div className="px-6 py-6 border-b border-white/20">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Hammer className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[15px] font-semibold tracking-tight text-slate-900">CleanForge</div>
            <div className="text-[11px] font-medium tracking-widest text-slate-400 uppercase">Standard Forge</div>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7 scrollbar-thin">
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
                      "flex items-center gap-3 px-3 py-2.5 rounded-full text-sm transition-all duration-200",
                      isActive
                        ? "bg-violet-100 text-violet-900 font-medium shadow-sm border border-violet-200/50"
                        : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
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

      <div className="p-4 border-t border-white/20">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/40 backdrop-blur border border-white/40">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">Alex Morgan</div>
            <div className="text-xs text-slate-500 truncate">alex@cleanforge.dev</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export const MobileSidebar = () => {
  const pathname = usePathname();
  return (
    <div className="lg:hidden flex flex-col h-full bg-[#fbfbff]">
      <div className="px-6 py-6 border-b border-violet-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <Hammer className="w-5 h-5 text-white" />
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
                        : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
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
    </div>
  );
};

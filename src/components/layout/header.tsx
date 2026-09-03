"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Bell, Search } from "lucide-react";
import { MobileSidebar } from "./sidebar";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/standards": "My Standards",
  "/forge": "Forge Studio",
  "/mcps": "My MCPs",
  "/templates": "Templates",
  "/docs": "Documentation",
  "/analytics": "Analytics",
  "/activity": "Activity",
  "/validations": "Validations",
  "/playground": "Playground",
  "/marketplace": "Marketplace",
  "/settings": "Settings",
};

export const Header = () => {
  const pathname = usePathname();
  const breadcrumb = breadcrumbMap[pathname || ""] || breadcrumbMap["/" + pathname?.split("/")[1]] || "Dashboard";

  return (
    <header className="sticky top-0 z-30 bg-white/40 backdrop-blur-xl border-b border-white/40">
      <div className="flex items-center gap-4 px-4 lg:px-8 py-3">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="lg:hidden rounded-full bg-white/50 border border-white/40">
                <Menu className="w-5 h-5" />
              </Button>
            }
          />
          <SheetContent side="left" className="p-0 w-[280px] bg-[#fbfbff] border-white/40">
            <MobileSidebar />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">Home</span>
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-900">{breadcrumb}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-white/50 backdrop-blur border border-white/40 text-slate-500 hover:text-slate-900 hover:bg-white/70">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-white/50 backdrop-blur border border-white/40 text-slate-500 hover:text-slate-900 hover:bg-white/70">
            <Bell className="w-4 h-4" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shadow-md">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

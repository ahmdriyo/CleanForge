"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, Settings, LogOut } from "lucide-react";
import { MobileSidebar } from "./sidebar";
import { useAuth } from "@/providers/AuthProvider";

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
  const router = useRouter();
  const { user, logout } = useAuth();
  const breadcrumb =
    breadcrumbMap[pathname || ""] ||
    breadcrumbMap["/" + pathname?.split("/")[1]] ||
    "Dashboard";

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-white/70 shadow-sm">
      <div className="flex items-center gap-4 px-4 lg:px-8 py-3">
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full bg-white/75 border border-white/60"
              >
                <Menu className="w-5 h-5" />
              </Button>
            }
          />
          <SheetContent
            side="left"
            className="p-0 w-[280px] bg-[#fbfbff] border-white/60"
          >
            <MobileSidebar />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">Home</span>
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-900">{breadcrumb}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shadow-md hover:opacity-90 transition">
                  {(
                    user?.displayName?.[0] ||
                    user?.email?.[0] ||
                    "A"
                  ).toUpperCase()}
                </button>
              }
            />
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.displayName || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user?.email || "Not signed in"}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" /> View Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

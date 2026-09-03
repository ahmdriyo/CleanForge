"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Layers, Menu } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Tech Stack", href: "#tech-stack" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  // smooth scroll handled by CSS, but close sheet on click
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-[#fbfbff]/80 backdrop-blur-md border-b border-violet-100"
    >
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 h-[64px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-950 to-indigo-900 flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="text-[16px] font-semibold tracking-tight text-violet-950">CleanForge</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-slate-600 hover:text-violet-900 transition">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" className="rounded-full text-slate-600 hover:text-violet-900 hover:bg-violet-50">
              Login
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="rounded-full bg-gradient-to-br from-violet-950 via-indigo-900 to-violet-800 text-white backdrop-blur-md border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_8px_32px_rgba(46,16,101,0.2)] hover:from-violet-900 hover:to-indigo-800 px-6">
              Start Forging Free
            </Button>
          </Link>
        </div>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="w-5 h-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-[280px] bg-[#fbfbff]">
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((l) => (
                  <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700">
                    {l.label}
                  </a>
                ))}
                <div className="flex flex-col gap-3 pt-6 border-t border-violet-100">
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full rounded-full border-violet-200">
                      Login
                    </Button>
                  </Link>
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    <Button className="w-full rounded-full bg-gradient-to-br from-violet-950 to-indigo-900 text-white">Start Forging Free</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};

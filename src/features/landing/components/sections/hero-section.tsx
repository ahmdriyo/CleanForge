"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroIllustration } from "../hero-illustration";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#fbfbff] scroll-mt-20"
    >
      {/* Enhanced colorful gradients - more violet, pink, cyan, indigo */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,_#ffffff_0%,_#f3e8ff_30%,_#ddd6fe_55%,_#fbfbff_85%)] opacity-90" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_45%_at_100%_0%,_#c4b5fd_0%,_transparent_55%)] opacity-40" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_35%_at_0%_20%,_#f9a8d4_0%,_transparent_50%)] opacity-30" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_45%_40%_at_80%_70%,_#a5f3fc_0%,_transparent_55%)] opacity-25" />

      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 pt-16 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-violet-100 text-violet-900 border border-violet-200 rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest"
        >
          CLEANFORGE — MCP FORGE FOR VIBE CODERS
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-violet-950 leading-[0.95]"
        >
          Clean Code, <br />
          <span className="bg-gradient-to-r from-violet-900 via-indigo-700 to-violet-800 bg-clip-text text-transparent">
            Every Vibe
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-base md:text-lg font-normal leading-relaxed max-w-2xl mx-auto text-violet-950/70"
        >
          Don&apos;t let AI ruin your project structure. Your private Standard
          Journal — brainstorm with Gemini, generate a private MCP that enforces
          clean code to every AI Agent.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link href="/dashboard">
              <Button className="rounded-full bg-gradient-to-br from-violet-950 via-indigo-900 to-violet-800 text-white backdrop-blur-md border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_8px_32px_rgba(46,16,101,0.2)] hover:from-violet-900 hover:to-indigo-800 px-8 py-6 text-sm font-medium">
                Start Forging Free <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link href="#templates">
              <Button
                variant="outline"
                className="rounded-full bg-white border-violet-200 text-violet-900 hover:bg-violet-50 px-8 py-6 text-sm font-medium"
              >
                View Templates
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        <HeroIllustration />
      </div>
    </section>
  );
};

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroIllustration } from "../hero-illustration";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  return (
    <section id="hero" className="relative overflow-hidden bg-[#fbfbff] scroll-mt-20">
      {/* Radial Background Gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,_#ffffff_0%,_#f3e8ff_35%,_#ede9fe_60%,_#fbfbff_85%)] opacity-80" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_100%_0%,_#ede9fe_0%,_transparent_60%)] opacity-60" />

      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 pt-16 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-900 border border-violet-200 rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          NEW • CLEANFORGE — MCP FORGE FOR VIBE CODERS
        </div>

        <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-violet-950 leading-[0.95]">
          Clean Code, <br />
          <span className="bg-gradient-to-r from-violet-900 via-indigo-700 to-violet-800 bg-clip-text text-transparent">Every Vibe</span>
        </h1>

        <p className="mt-6 text-base md:text-lg font-normal leading-relaxed text-slate-600 max-w-2xl mx-auto text-violet-950/70">
          Don&apos;t let AI ruin your project structure. Your private Standard Journal — brainstorm with Gemini, generate a private MCP that enforces clean code to every AI Agent.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button className="rounded-full bg-gradient-to-br from-violet-950 via-indigo-900 to-violet-800 text-white backdrop-blur-md border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_8px_32px_rgba(46,16,101,0.2)] hover:from-violet-900 hover:to-indigo-800 px-8 py-6 text-sm font-medium">
              Start Forging Free <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link href="#templates">
            <Button variant="outline" className="rounded-full bg-white border-violet-200 text-violet-900 hover:bg-violet-50 px-8 py-6 text-sm font-medium">
              View Templates
            </Button>
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-violet-200 border-2 border-white" />
            <div className="w-6 h-6 rounded-full bg-indigo-200 border-2 border-white" />
            <div className="w-6 h-6 rounded-full bg-violet-300 border-2 border-white" />
          </div>
          <span>Trusted by vibe coders worldwide</span>
        </div>

        <HeroIllustration />
      </div>
    </section>
  );
};

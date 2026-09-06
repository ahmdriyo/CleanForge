"use client";

import { Hammer } from "lucide-react";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex p-3 lg:p-4 bg-[#f0f0ff] gap-3 lg:gap-4">
      {/* Left branding panel - violet gradient with glass bubble like reference */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-600 via-indigo-500 to-violet-800 flex-col justify-between p-10">
        {/* Soft radial highlights */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_600px_at_20%_20%,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_600px_500px_at_80%_80%,_#a5f3fc_0%,_transparent_60%)] opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_400px_300px_at_50%_40%,_#f9a8d4_0%,_transparent_60%)] opacity-25" />

        {/* Top logo */}
        <div className="relative flex items-center gap-2 text-white/90">
          <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center">
            <Hammer className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold tracking-tight">CleanForge</span>
        </div>

        {/* Center bubble + big text like SMART AI */}
        <div className="relative flex-1 flex flex-col items-center justify-center mt-30">
          {/* Big faded watermark text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[88px] xl:text-[110px] font-bold tracking-tighter text-white/10 leading-none">
              CLEAN
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none translate-y-14">
            <span className="text-[88px] xl:text-[110px] font-bold tracking-tighter text-white/10 leading-none">
              FORGE
            </span>
          </div>

          {/* Glass bubble */}
          <div className="relative w-[220px] h-[220px] mb-90 rounded-full bg-gradient-to-br from-pink-300 via-violet-400 to-indigo-500 shadow-[0_32px_80px_rgba(0,0,0,0.25),inset_0_1px_0_0_rgba(255,255,255,0.4)] border border-white/30 flex items-center justify-center overflow-hidden">
            {/* Highlight */}
            <div className="absolute top-6 left-10 w-20 h-20 rounded-full bg-white/30 blur-xl" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 h-20 rounded-full bg-cyan-300/50 blur-xl" />
            {/* Inner glass bar like reference */}
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[240px] h-[28px] bg-white/70 backdrop-blur-xl rounded-full shadow-lg border border-white/50 -rotate-3" />
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[240px] h-[28px] bg-white/40 backdrop-blur-xl rounded-full -rotate-3 translate-x-2 translate-y-1" />
          </div>
        </div>

        {/* Bottom copy */}
        <div className="relative">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Forge Your Standards
          </h2>
          <p className="text-sm leading-relaxed text-violet-100 mt-2 max-w-md">
            Capture your clean architecture once. Enforce it to every AI Agent
            via private MCP — consistent, secure, and yours.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 bg-[#fbfbff] lg:bg-white rounded-[28px] shadow-sm border border-violet-100/50 flex flex-col">
        {children}
      </div>
    </div>
  );
};

"use client";

import { Folder, Sparkles, Plug } from "lucide-react";
import { motion } from "framer-motion";

export const HeroIllustration = () => {
  return (
    <div className="relative mx-auto w-full max-w-[560px] h-[360px] mt-12">
      {/* Base platform */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute inset-x-8 bottom-8 top-12 bg-gradient-to-br from-white to-violet-50 rounded-[32px] border border-violet-100 shadow-[0_24px_64px_rgba(46,16,101,0.08),0_8px_24px_rgba(46,16,101,0.06)]"
      />

      {/* Clay cubes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -6, 0] }}
        transition={{ opacity: { duration: 0.6, delay: 0.4 }, y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
        whileHover={{ y: -4 }}
        style={{ rotate: -3 }}
        className="absolute top-6 left-12 w-[140px] h-[140px] bg-white rounded-3xl shadow-xl border border-violet-100 flex flex-col items-center justify-center gap-2"
      >
        <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center">
          <Folder className="w-6 h-6 text-violet-900" />
        </div>
        <span className="text-xs font-medium text-slate-600">src/features</span>
        <span className="text-[11px] text-slate-400">kebab-case</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{ opacity: { duration: 0.6, delay: 0.6 }, y: { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 } }}
        whileHover={{ y: -4 }}
        style={{ rotate: 3 }}
        className="absolute top-16 right-16 w-[130px] h-[130px] bg-white rounded-3xl shadow-xl border border-violet-100 flex flex-col items-center justify-center gap-2"
      >
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-indigo-700" />
        </div>
        <span className="text-xs font-medium text-slate-600">Gemini Chat</span>
        <span className="text-[11px] text-slate-400">Multi-turn</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -5, 0] }}
        transition={{ opacity: { duration: 0.6, delay: 0.8 }, y: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 } }}
        whileHover={{ y: -4 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[150px] h-[130px] bg-gradient-to-br from-violet-950 to-indigo-900 rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center justify-center gap-2"
      >
        <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
          <Plug className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs font-medium text-white">MCP Endpoint</span>
        <span className="text-[11px] text-violet-200 font-mono">/mcp/.../sse</span>
      </motion.div>

      {/* Floating dots */}
      <motion.div
        className="absolute top-8 right-8 w-3 h-3 rounded-full bg-violet-200"
        animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-8 w-2 h-2 rounded-full bg-indigo-300"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
      <motion.div
        className="absolute bottom-32 left-8 w-2.5 h-2.5 rounded-full bg-violet-300"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
    </div>
  );
};

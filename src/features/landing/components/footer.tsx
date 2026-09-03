"use client";

import Link from "next/link";
import { Layers } from "lucide-react";
import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-[#fbfbff] border-t border-violet-100 py-12"
    >
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 flex flex-col md:flex-row gap-8 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-950 to-indigo-900 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-violet-950">CleanForge</span>
          </div>
          <p className="text-sm text-slate-500 mt-3">© 2026 CleanForge. Built for Gen AI Academy APAC.</p>
          <p className="text-xs text-slate-400 mt-1">#AccelerateAIwithCloudRun</p>
        </div>

        <div className="flex gap-12 text-sm">
          <div className="space-y-2">
            <div className="font-medium text-slate-900">Product</div>
            <a href="#features" className="block text-slate-500 hover:text-violet-900">Features</a>
            <a href="#templates" className="block text-slate-500 hover:text-violet-900">Templates</a>
            <a href="#how-it-works" className="block text-slate-500 hover:text-violet-900">How It Works</a>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-slate-900">Connect</div>
            <Link href="https://github.com" className="block text-slate-500 hover:text-violet-900">GitHub</Link>
            <a href="https://x.com" className="block text-slate-500 hover:text-violet-900">X</a>
            <a href="https://linkedin.com" className="block text-slate-500 hover:text-violet-900">LinkedIn</a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

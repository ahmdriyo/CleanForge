"use client";

import { FolderTree, MessageSquare, Lock, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: FolderTree, title: "Visual Folder Tree Editor", desc: "Drag, edit, and visualize your structure. Every folder has rules, naming, and example code.", badge: "kebab-case" },
  { icon: MessageSquare, title: "AI Consultant", desc: "Chat with Gemini, get suggestions, click Apply to Standard to update your tree instantly.", badge: "Gemini" },
  { icon: Lock, title: "Private MCP Endpoint", desc: "Secure, isolated per-user MCP URL. Your standards stay private, powered by Firebase Auth.", badge: "Private" },
  { icon: Shield, title: "Isolated & Secure", desc: "Zero cross-user leakage. Firestore rules + Secret Manager for keys, deployed on Cloud Run.", badge: "Secure" },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="relative bg-[#fbfbff] py-20 scroll-mt-20 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_20%_70%,_#f9a8d4_0%,_transparent_55%)] opacity-20" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_45%_40%_at_90%_30%,_#a5f3fc_0%,_transparent_55%)] opacity-20" />
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="text-xs font-semibold uppercase tracking-widest text-violet-700 mb-3">FEATURES</div>
          <h2 className="text-3xl font-semibold tracking-tight text-violet-950">Everything to Enforce Clean Code</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="bg-white rounded-[24px] border border-violet-100 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-50 to-white border border-violet-100 flex items-center justify-center text-violet-900">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 flex-1">{f.title}</h3>
                <span className="text-xs bg-violet-100 text-violet-700 border border-violet-200 rounded-full px-2.5 py-1">{f.badge}</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              {f.title.includes("Tree") && (
                <div className="mt-4 bg-slate-900 rounded-xl p-3 font-mono text-xs text-emerald-300">src/features/auth → kebab-case ✓</div>
              )}
              {f.title.includes("MCP") && (
                <div className="mt-4 bg-violet-50 border border-violet-200 rounded-xl p-3 font-mono text-xs text-violet-900 truncate">https://cleanforge.run.app/mcp/.../sse</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

"use client";

import { BookOpen, Sparkles, Plug } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { icon: BookOpen, title: "Journal Your Standard", desc: "Capture folder structure, naming rules, example code per-folder. Visual tree editor with kebab-case enforcement." },
  { icon: Sparkles, title: "Brainstorm with Gemini", desc: "Multi-turn chat with Gemini as your Clean Architecture Consultant. Refine and validate." },
  { icon: Plug, title: "Generate MCP Link", desc: "Get a private endpoint /mcp/{id}/sse for Cursor/Claude. Your AI now respects your standards." },
];

export const SolutionSection = () => {
  return (
    <section id="solution" className="relative bg-white border-y border-violet-100 py-20 scroll-mt-20 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_30%_50%,_#c4b5fd_0%,_transparent_60%)] opacity-15" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_30%_at_80%_20%,_#a5f3fc_0%,_transparent_50%)] opacity-20" />
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-violet-950">Your Private Standard Journal</h2>
          <p className="mt-3 text-slate-600">Journal, brainstorm, and enforce — all isolated per-user.</p>
        </motion.div>

        <div className="relative grid md:grid-cols-3 gap-8">
          <div className="hidden md:block absolute top-[28px] left-[18%] right-[18%] h-0.5 border-t-2 border-dashed border-violet-200" />
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              whileHover={{ y: -4 }}
              className="relative text-center"
            >
              <motion.div
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-violet-500/20"
                whileHover={{ scale: 1.05, rotate: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <s.icon className="w-7 h-7" />
              </motion.div>
              <div className="mt-4 text-xs font-semibold uppercase tracking-widest text-violet-700">STEP {i + 1}</div>
              <h3 className="font-semibold text-slate-900 mt-1">{s.title}</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

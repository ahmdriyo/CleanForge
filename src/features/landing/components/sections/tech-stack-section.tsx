"use client";

import { SiNextdotjs, SiFirebase } from "react-icons/si";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

const stacks = [
  { label: "Next.js 15", icon: SiNextdotjs },
  { label: "Firebase Auth", icon: SiFirebase },
  { label: "Firestore", icon: SiFirebase },
  { label: "Gemini API", icon: FcGoogle },
  { label: "Secret Manager", icon: FcGoogle },
  { label: "Cloud Run", icon: FcGoogle },
];

export const TechStackSection = () => {
  return (
    <section
      id="tech-stack"
      className="relative bg-white border-y border-violet-100 py-16 scroll-mt-20 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_30%_50%,_#c4b5fd_0%,_transparent_60%)] opacity-10" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_30%_at_70%_50%,_#a5f3fc_0%,_transparent_50%)] opacity-15" />
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-semibold tracking-tight text-violet-950"
        >
          Built on Google Ecosystem
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-sm text-slate-600 mt-2"
        >
          Production-ready, authenticated, isolated per-user, deployed on Cloud
          Run.
        </motion.p>

        <div className="flex flex-wrap gap-3 justify-center mt-8">
          {stacks.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 bg-white border border-violet-100 rounded-full px-4 py-2 text-sm font-medium text-violet-900 shadow-sm"
            >
              <s.icon className="w-4 h-4" />
              {s.label}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

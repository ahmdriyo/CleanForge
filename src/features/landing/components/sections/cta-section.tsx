"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const CtaSection = () => {
  return (
    <section id="cta" className="relative bg-gradient-to-br from-violet-950 via-indigo-900 to-violet-800 py-16 scroll-mt-20 overflow-hidden">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 70% 30%, #f9a8d4 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 20% 80%, #a5f3fc 0%, transparent 60%)",
        }}
        animate={{ opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative max-w-[1280px] mx-auto px-4 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold tracking-tight text-white"
        >
          Ready to Enforce Clean Code?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-3 text-violet-200"
        >
          Join CleanForge. Your standards, every vibe.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link href="/dashboard">
              <Button className="rounded-full bg-white text-violet-900 hover:bg-violet-50 shadow-lg px-8 py-6">Start Forging Free</Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link href="#features">
              <Button variant="outline" className="rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 px-8 py-6">
                See How It Works
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

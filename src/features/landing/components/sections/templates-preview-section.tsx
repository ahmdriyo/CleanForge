"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTemplatesQuery } from "@/features/landing/hooks/use-templates-query";
import { SiNextdotjs, SiNestjs, SiGo } from "react-icons/si";
import { Layers } from "lucide-react";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  nextjs: SiNextdotjs,
  nestjs: SiNestjs,
  go: SiGo,
};

export const TemplatesPreviewSection = () => {
  const { data } = useTemplatesQuery();

  return (
    <section
      id="templates"
      className="relative bg-white border-y border-violet-100 py-20 scroll-mt-20 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_20%_20%,_#c4b5fd_0%,_transparent_60%)] opacity-15" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_35%_at_80%_80%,_#f9a8d4_0%,_transparent_55%)] opacity-15" />
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-violet-950">
            Start with Proven Standards
          </h2>
          <p className="mt-3 text-slate-600">
            3 clean code templates ready to clone & customize.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {data?.map((tpl, i) => {
            const Icon = iconMap[tpl.icon] || Layers;
            return (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-3xl border border-violet-100 overflow-hidden hover:shadow-md transition flex flex-col"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium bg-slate-900 text-white rounded-full px-3 py-1">
                      {tpl.framework}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900">{tpl.name}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                    {tpl.description}
                  </p>
                  <div className="mt-4 bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <div className="text-[11px] uppercase tracking-widest text-slate-400 font-medium mb-1">
                      Structure
                    </div>
                    <div className="font-mono text-xs text-slate-600">
                      {tpl.structurePreview}
                    </div>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-violet-200 text-violet-900 hover:bg-violet-50"
                    >
                      Use Template
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link
            href="/dashboard"
            className="text-sm font-medium text-violet-700 hover:text-violet-900"
          >
            View All Templates →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

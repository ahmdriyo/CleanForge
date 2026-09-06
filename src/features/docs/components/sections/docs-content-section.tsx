"use client";

import { docsSections } from "@/data-dummy/docs-dummy";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const DocsContentSection = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>(docsSections[0]?.id ?? "");

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  };

  useEffect(() => {
    const ids = docsSections.map((s) => s.id);
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry most visible near top
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid lg:grid-cols-[240px_1fr] gap-6">
      <div className="bg-white/65 backdrop-blur-xl border border-white/60 rounded-[16px] p-4 h-fit sticky top-20">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">On this page</div>
        <div className="space-y-1">
          {docsSections.map((sec) => {
            const isActive = activeId === sec.id;
            return (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={() => setActiveId(sec.id)}
                className={`block text-sm py-1.5 px-3 rounded-full transition-colors border ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border-blue-200 font-medium shadow-sm"
                    : "text-slate-600 hover:text-blue-600 hover:bg-white/65 border-transparent"
                }`}
              >
                {sec.title}
              </a>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {docsSections.map((sec) => (
          <div key={sec.id} id={sec.id} className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-[20px] p-6 scroll-mt-20">
            <h3 className="font-semibold text-slate-900 mb-2">{sec.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">{sec.content}</p>
            {sec.code && (
              <div className="relative">
                <pre className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-emerald-300 overflow-auto">{sec.code}</pre>
                <Button size="sm" variant="outline" className="absolute top-2 right-2 h-7 rounded-full bg-white text-slate-700 text-xs" onClick={() => handleCopy(sec.code!, sec.id)}>
                  {copied === sec.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copied === sec.id ? "Copied" : "Copy"}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

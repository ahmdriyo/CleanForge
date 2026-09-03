"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { docsFaqs } from "@/data-dummy/docs-dummy";

export const DocsFaqSection = () => {
  return (
    <div className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-[20px] p-6">
      <h3 className="font-semibold text-slate-900 mb-4">FAQ</h3>
      <Accordion className="w-full">
        {docsFaqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-white/30">
            <AccordionTrigger className="text-sm text-slate-900 text-left">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-slate-600">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

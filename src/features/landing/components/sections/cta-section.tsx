import Link from "next/link";
import { Button } from "@/components/ui/button";

export const CtaSection = () => {
  return (
    <section id="cta" className="bg-gradient-to-br from-violet-950 via-indigo-900 to-violet-800 py-16 scroll-mt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
      <div className="relative max-w-[1280px] mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">Ready to Enforce Clean Code?</h2>
        <p className="mt-3 text-violet-200">Join CleanForge. Your standards, every vibe.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard">
            <Button className="rounded-full bg-white text-violet-900 hover:bg-violet-50 shadow-lg px-8 py-6">Start Forging Free</Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" className="rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 px-8 py-6">
              See How It Works
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

import { Folder, File, Layers, Sparkles, Plug } from "lucide-react";

export const HeroIllustration = () => {
  return (
    <div className="relative mx-auto w-full max-w-[560px] h-[360px] mt-12">
      {/* Base platform */}
      <div className="absolute inset-x-8 bottom-8 top-12 bg-gradient-to-br from-white to-violet-50 rounded-[32px] border border-violet-100 shadow-[0_24px_64px_rgba(46,16,101,0.08),0_8px_24px_rgba(46,16,101,0.06)]" />

      {/* Clay cubes */}
      <div className="absolute top-6 left-12 w-[140px] h-[140px] bg-white rounded-3xl shadow-xl border border-violet-100 flex flex-col items-center justify-center gap-2 -rotate-3 hover:rotate-0 transition-transform duration-300">
        <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center">
          <Folder className="w-6 h-6 text-violet-900" />
        </div>
        <span className="text-xs font-medium text-slate-600">src/features</span>
        <span className="text-[11px] text-slate-400">kebab-case</span>
      </div>

      <div className="absolute top-16 right-16 w-[130px] h-[130px] bg-white rounded-3xl shadow-xl border border-violet-100 flex flex-col items-center justify-center gap-2 rotate-3 hover:rotate-0 transition-transform duration-300">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-indigo-700" />
        </div>
        <span className="text-xs font-medium text-slate-600">Gemini Chat</span>
        <span className="text-[11px] text-slate-400">Multi-turn</span>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[150px] h-[130px] bg-gradient-to-br from-violet-950 to-indigo-900 rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center justify-center gap-2 hover:-translate-y-1 transition-transform duration-300">
        <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
          <Plug className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs font-medium text-white">MCP Endpoint</span>
        <span className="text-[11px] text-violet-200 font-mono">/mcp/.../sse</span>
      </div>

      {/* Floating dots */}
      <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-violet-200" />
      <div className="absolute bottom-20 right-8 w-2 h-2 rounded-full bg-indigo-300" />
      <div className="absolute bottom-32 left-8 w-2.5 h-2.5 rounded-full bg-violet-300" />
    </div>
  );
};

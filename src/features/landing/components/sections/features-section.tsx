import { FolderTree, MessageSquare, Lock, Shield } from "lucide-react";

const features = [
  { icon: FolderTree, title: "Visual Folder Tree Editor", desc: "Drag, edit, and visualize your structure. Every folder has rules, naming, and example code.", badge: "kebab-case" },
  { icon: MessageSquare, title: "AI Consultant", desc: "Chat with Gemini, get suggestions, click Apply to Standard to update your tree instantly.", badge: "Gemini" },
  { icon: Lock, title: "Private MCP Endpoint", desc: "Secure, isolated per-user MCP URL. Your standards stay private, powered by Firebase Auth.", badge: "Private" },
  { icon: Shield, title: "Isolated & Secure", desc: "Zero cross-user leakage. Firestore rules + Secret Manager for keys, deployed on Cloud Run.", badge: "Secure" },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="bg-[#fbfbff] py-20 scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-violet-700 mb-3">FEATURES</div>
          <h2 className="text-3xl font-semibold tracking-tight text-violet-950">Everything to Enforce Clean Code</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-[24px] border border-violet-100 p-6 hover:shadow-lg transition">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

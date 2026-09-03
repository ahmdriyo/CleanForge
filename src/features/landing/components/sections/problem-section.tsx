import { FolderX, Code2, AlertTriangle } from "lucide-react";

const problems = [
  { icon: FolderX, title: "Messy Structure", desc: "AI generates random folders every project, inconsistent and confusing." },
  { icon: Code2, title: "Not Clean Code", desc: "Mixed naming, tangled logic, no separation of concerns." },
  { icon: AlertTriangle, title: "Instant Tech Debt", desc: "Fast at first, painful to maintain forever." },
];

export const ProblemSection = () => {
  return (
    <section id="problem" className="bg-[#fbfbff] py-20 scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-violet-700 mb-3">THE PROBLEM</div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-violet-950">Vibe Coding is Fast. But Messy.</h2>
          <p className="mt-3 text-slate-600">Speed without standards creates chaos.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div key={p.title} className="bg-white border border-violet-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-900 mb-4">
                <p.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{p.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

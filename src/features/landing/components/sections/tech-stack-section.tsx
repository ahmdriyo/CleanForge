import { SiNextdotjs, SiFirebase, SiGoogle } from "react-icons/si";

const stacks = [
  { label: "Next.js 15", icon: SiNextdotjs },
  { label: "Firebase Auth", icon: SiFirebase },
  { label: "Firestore", icon: SiFirebase },
  { label: "Gemini API", icon: SiGoogle },
  { label: "Secret Manager", icon: SiGoogle },
  { label: "Cloud Run", icon: SiGoogle },
];

export const TechStackSection = () => {
  return (
    <section id="tech-stack" className="bg-white border-y border-violet-100 py-16 scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-violet-950">Built on Google Ecosystem</h2>
        <p className="text-sm text-slate-600 mt-2">Production-ready, authenticated, isolated per-user, deployed on Cloud Run.</p>

        <div className="flex flex-wrap gap-3 justify-center mt-8">
          {stacks.map((s) => (
            <div key={s.label} className="flex items-center gap-2 bg-white border border-violet-100 rounded-full px-4 py-2 text-sm font-medium text-violet-900 shadow-sm">
              <s.icon className="w-4 h-4" />
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

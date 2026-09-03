import { LucideIcon } from "lucide-react";

export const PlaceholderCard = ({
  icon: Icon,
  title,
  description,
  specific,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  specific: string;
}) => {
  return (
    <div className="bg-white/40 backdrop-blur-xl border border-dashed border-white/50 rounded-[24px] p-12 text-center max-w-2xl mx-auto mt-12 shadow-[0_8px_32px_rgba(31,38,135,0.07)]">
      <div className="w-16 h-16 bg-white/60 rounded-3xl border border-white/50 flex items-center justify-center text-violet-600 mx-auto mb-4 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 border border-violet-200 rounded-full text-xs font-medium px-3 py-1 mb-3">
        Coming Soon
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-2">{description}</p>
      <p className="text-xs text-slate-400 mb-6">{specific}</p>
      <div className="flex justify-center gap-3">
        <a href="/dashboard" className="inline-flex items-center justify-center rounded-full bg-violet-600 text-white text-sm font-medium px-6 py-2.5 hover:bg-violet-700 transition">
          Go back to Dashboard
        </a>
        <button disabled className="inline-flex items-center justify-center rounded-full bg-white/50 border border-white/40 text-slate-400 text-sm font-medium px-6 py-2.5 opacity-50 cursor-not-allowed">
          Notify Me
        </button>
      </div>
    </div>
  );
};

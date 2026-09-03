import Link from "next/link";
import { LayoutTemplate, BookOpen } from "lucide-react";

export const QuickActionsSection = () => {
  return (
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      <Link href="/templates" className="group bg-white/40 backdrop-blur-xl border border-white/40 rounded-[20px] p-5 hover:bg-white/60 hover:border-white/60 transition cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md">
            <LayoutTemplate className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-medium text-slate-900">Clone Template</div>
            <div className="text-sm text-slate-500">Start from a proven clean architecture</div>
          </div>
        </div>
      </Link>
      <Link href="/docs" className="group bg-white/40 backdrop-blur-xl border border-white/40 rounded-[20px] p-5 hover:bg-white/60 hover:border-white/60 transition cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-white/50 flex items-center justify-center shadow-sm">
            <BookOpen className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <div className="font-medium text-slate-900">Go to Documentation</div>
            <div className="text-sm text-slate-500">Learn how to connect your MCP</div>
          </div>
        </div>
      </Link>
    </div>
  );
};

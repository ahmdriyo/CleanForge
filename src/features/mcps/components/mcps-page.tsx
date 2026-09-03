import { McpsListSection } from "./sections/mcps-list-section";

export const McpsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My MCPs</h1>
        <p className="text-sm text-slate-500">Manage your private MCP endpoints</p>
      </div>
      <McpsListSection />
    </div>
  );
};

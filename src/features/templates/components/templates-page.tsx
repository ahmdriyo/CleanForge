import { TemplateGridSection } from "./sections/template-grid-section";

export const TemplatesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Browse Templates</h1>
        <p className="text-sm text-slate-500">Start with proven clean standards</p>
      </div>
      <TemplateGridSection />
    </div>
  );
};

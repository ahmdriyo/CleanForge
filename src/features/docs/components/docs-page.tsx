import { DocsContentSection } from "./sections/docs-content-section";
import { DocsFaqSection } from "./sections/docs-faq-section";

export const DocsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Documentation</h1>
        <p className="text-sm text-slate-500">Learn how to connect your MCP to any AI Agent</p>
      </div>
      <DocsContentSection />
      <DocsFaqSection />
    </div>
  );
};

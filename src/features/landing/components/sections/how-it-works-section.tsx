export const HowItWorksSection = () => {
  const steps = [
    { n: "01", title: "Login with Firebase Auth", desc: "Secure sign-in, isolated private space." },
    { n: "02", title: "Create Standard in Visual Editor", desc: "Define folder tree, naming, example code." },
    { n: "03", title: "Chat & Refine with Gemini", desc: "Brainstorm architecture, apply to standard." },
    { n: "04", title: "Generate MCP & Paste to Cursor", desc: "Copy private endpoint to your AI Agent." },
  ];

  return (
    <section id="how-it-works" className="bg-[#fbfbff] py-20 scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-violet-700 mb-3">HOW IT WORKS</div>
          <h2 className="text-3xl font-semibold tracking-tight text-violet-950">From Idea to MCP in 4 Steps</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="text-5xl font-bold text-violet-100">{s.n}</div>
              <h3 className="font-semibold text-slate-900 mt-2">{s.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-violet-950 rounded-2xl p-6 text-violet-100">
          <div className="text-xs uppercase tracking-widest text-violet-300 mb-2">MCP Tool Preview</div>
          <pre className="font-mono text-sm overflow-auto">{`// AI Agent will call:\n{\n  "tool": "get_my_project_standard",\n  "result": {\n    "folderStructure": "src/features/...",\n    "naming": "kebab-case"\n  }\n}`}</pre>
        </div>
      </div>
    </section>
  );
};

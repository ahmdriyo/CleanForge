export const MeshGradientBg = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#c7d2fe] overflow-hidden">
      {/* Base soft blue */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#dbeafe] via-[#e0e7ff] to-[#bfdbfe]" />
      {/* Strong blue aurora blobs - like reference image */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 0% 100%, #3b82f6 0%, transparent 55%),
            radial-gradient(ellipse 70% 60% at 100% 0%, #93c5fd 0%, transparent 50%),
            radial-gradient(ellipse 80% 50% at 100% 85%, #60a5fa 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 50% 0%, #ffffff 0%, transparent 60%)
          `,
          filter: "blur(70px)",
        }}
      />
      {/* Center light wash - keeps cards readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_600px_at_50%_30%,_rgba(255,255,255,0.85)_0%,_transparent_65%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent" />
    </div>
  );
};

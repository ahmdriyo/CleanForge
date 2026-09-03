export const MeshGradientBg = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#fbfbff] overflow-hidden">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 10%, #dbeafe 25%, transparent 60%),
            radial-gradient(ellipse 70% 50% at 80% 20%, #ede9fe 25%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 50% 90%, #ecfeff 20%, transparent 60%)
          `,
          filter: "blur(60px)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f8fafc]/50" />
    </div>
  );
};

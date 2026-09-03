"use client";

import { motion } from "framer-motion";

export const LandingBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#fbfbff]">
      {/* Base ice white */}
      <div className="absolute inset-0 bg-[#fbfbff]" />
      {/* Colorful mesh blobs */}
      <motion.div
        className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, #c4b5fd 0%, #a78bfa 25%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[10%] -right-40 w-[600px] h-[600px] rounded-full opacity-25"
        style={{
          background: "radial-gradient(circle, #818cf8 0%, #6366f1 30%, transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-[40%] left-[20%] w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #f9a8d4 0%, #f472b6 25%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 25, 0], y: [0, -15, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-[5%] right-[15%] w-[650px] h-[550px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #a5f3fc 0%, #67e8f9 25%, #22d3ee 40%, transparent 70%)",
          filter: "blur(65px)",
        }}
        animate={{ x: [0, -15, 0], y: [0, -20, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-[60%] -left-20 w-[550px] h-[500px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #ede9fe 0%, #ddd6fe 30%, transparent 70%)",
          filter: "blur(55px)",
        }}
        animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[40%] w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #fde68a 0%, #fcd34d 30%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{ x: [0, -10, 0], y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />
      {/* Hero radial wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,_rgba(255,255,255,0.9)_0%,_transparent_60%)]" />
    </div>
  );
};

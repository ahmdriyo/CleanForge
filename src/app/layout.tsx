import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainProviders from "@/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CleanForge — Clean Code, Every Vibe",
  description:
    "Private Standard Journal. Brainstorm with Gemini. Generate MCP that enforces your clean code to every AI Agent.",
  keywords: ["MCP", "Clean Code", "Next.js", "Gen AI Academy", "Cloud Run"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#fbfbff]">
        <MainProviders>{children}</MainProviders>
      </body>
    </html>
  );
}

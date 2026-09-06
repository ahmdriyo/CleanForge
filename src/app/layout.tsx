import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainProviders from "@/providers";

export const dynamic = "force-dynamic";

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
  // Runtime Firebase config — injected to window so client bundle works even if NEXT_PUBLIC was dummy at build time
  // NEXT_PUBLIC_* is inlined at build time (so may be dummy on Cloud Run), therefore read runtime vars without prefix as fallback
  // We set both NEXT_PUBLIC_* and FIREBASE_* via --set-env-vars; server can read FIREBASE_* at request time
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
  };

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__FIREBASE_CONFIG__=${JSON.stringify(firebaseConfig)};`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#fbfbff]">
        <MainProviders>{children}</MainProviders>
      </body>
    </html>
  );
}

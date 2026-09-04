import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MeshGradientBg } from "@/components/layout/mesh-gradient-bg";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#dbeafe]">
      <MeshGradientBg />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}

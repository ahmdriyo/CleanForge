import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MeshGradientBg } from "@/components/layout/mesh-gradient-bg";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#fbfbff]">
      <MeshGradientBg />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

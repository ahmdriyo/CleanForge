import { ForgePage } from "@/features/forge/components/forge-page";
import { dummyStandards } from "@/data-dummy/standards-dummy";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const std = dummyStandards.find((s) => s.id === id);
  return <ForgePage standardId={id} standardName={std?.name || "New Standard"} />;
}

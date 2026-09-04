import { ForgePage } from "@/features/forge/components/forge-page";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ForgePage standardId={id} standardName="Loading Standard..." />;
}

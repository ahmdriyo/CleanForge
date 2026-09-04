import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/server/auth/verify-id-token";
import { getStandardById, updateStandard, deleteStandard } from "@/server/repository/standard-repository";

const updateSchema = z.object({
  name: z.string().min(3).optional(),
  framework: z.enum(["nextjs", "nestjs", "go"]).optional(),
  description: z.string().optional(),
  folderStructure: z.any().optional(),
  globalRules: z
    .object({
      namingConvention: z.enum(["kebab-case", "PascalCase", "camelCase"]),
      stateManagement: z.string(),
      styling: z.string(),
      principles: z.array(z.string()),
    })
    .optional(),
  mcpStatus: z.enum(["active", "inactive", "draft"]).optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  try {
    const standard = await getStandardById(auth.uid, id);
    if (!standard) return NextResponse.json({ success: false, message: "Standard not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: standard });
  } catch (e) {
    console.error("GET /api/standards/[id] error", e);
    return NextResponse.json({ success: false, message: "Failed to fetch standard" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const updated = await updateStandard(auth.uid, id, parsed.data);
    if (!updated) return NextResponse.json({ success: false, message: "Standard not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (e) {
    console.error("PATCH /api/standards/[id] error", e);
    return NextResponse.json({ success: false, message: "Failed to update standard" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  try {
    const ok = await deleteStandard(auth.uid, id);
    if (!ok) return NextResponse.json({ success: false, message: "Standard not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Standard deleted" });
  } catch (e) {
    console.error("DELETE /api/standards/[id] error", e);
    return NextResponse.json({ success: false, message: "Failed to delete standard" }, { status: 500 });
  }
}

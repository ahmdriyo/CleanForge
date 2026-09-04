import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/server/auth/verify-id-token";
import { createStandard, getStandards } from "@/server/repository/standard-repository";

const createStandardSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  framework: z.enum(["nextjs", "nestjs", "go"]),
  description: z.string().min(1, "Description required"),
  folderStructure: z.any(),
  globalRules: z.object({
    namingConvention: z.enum(["kebab-case", "PascalCase", "camelCase"]),
    stateManagement: z.string(),
    styling: z.string(),
    principles: z.array(z.string()),
  }),
  mcpStatus: z.enum(["active", "inactive", "draft"]).optional(),
  mcpEndpoint: z.string().optional(),
  mcpToken: z.string().optional(),
});

export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    const standards = await getStandards(auth.uid);
    return NextResponse.json({ success: true, data: standards });
  } catch (e) {
    console.error("GET /api/standards error", e);
    return NextResponse.json({ success: false, message: "Failed to fetch standards" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    const body = await req.json();
    const parsed = createStandardSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const standard = await createStandard(auth.uid, {
      name: parsed.data.name,
      framework: parsed.data.framework,
      description: parsed.data.description,
      folderStructure: parsed.data.folderStructure,
      globalRules: parsed.data.globalRules,
      mcpStatus: parsed.data.mcpStatus || "draft",
      mcpEndpoint: parsed.data.mcpEndpoint || "",
      mcpToken: parsed.data.mcpToken || "",
    });

    return NextResponse.json({ success: true, data: standard }, { status: 201 });
  } catch (e) {
    console.error("POST /api/standards error", e);
    return NextResponse.json({ success: false, message: "Failed to create standard" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/server/auth/verify-id-token";
import { generateExampleCode } from "@/server/service/gemini-service";

const generateExampleSchema = z.object({
  folderPath: z.string().min(1, "folderPath is required"),
  rules: z.string().optional().default(""),
  naming: z.string().optional().default("kebab-case"),
});

export async function POST(req: Request) {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    const body = await req.json();
    const parsed = generateExampleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { folderPath, rules, naming } = parsed.data;

    try {
      const code = await generateExampleCode({ folderPath, rules, naming });
      return NextResponse.json({ success: true, data: { code } });
    } catch (geminiError) {
      console.warn(
        "Gemini service failed or not configured, using fallback generator:",
        geminiError,
      );

      const pathParts = folderPath.split("/").filter(Boolean);
      const rawName = pathParts[pathParts.length - 1] || "component";
      const name = rawName.replace(/\.[^/.]+$/, "");
      const cleanIdentifier = name.replace(/[^a-zA-Z0-9]/g, "");
      const componentName =
        cleanIdentifier.charAt(0).toUpperCase() + cleanIdentifier.slice(1);

      let fallbackCode = `// Path: ${folderPath}\n`;
      if (folderPath.includes("hook") || name.startsWith("use-")) {
        fallbackCode += `import { useQuery } from "@tanstack/react-query";\n\nexport const use${componentName} = () => {\n  return useQuery({\n    queryKey: ["${name}"],\n    queryFn: async () => {\n      // Rule: ${rules || "Keep hook logic clean and isolated"}\n      return { status: "success" };\n    },\n  });\n};`;
      } else if (folderPath.includes("schema")) {
        fallbackCode += `import { z } from "zod";\n\nexport const ${name.replace(/-/g, "_")}Schema = z.object({\n  id: z.string().min(1),\n  name: z.string().min(1),\n});\n\nexport type ${componentName} = z.infer<typeof ${name.replace(/-/g, "_")}Schema>;`;
      } else {
        fallbackCode += `import React from "react";\n\ninterface ${componentName}Props {\n  className?: string;\n}\n\nexport const ${componentName} = ({ className }: ${componentName}Props) => {\n  // Naming: ${naming}\n  // Rules: ${rules || "Feature-based clean UI"}\n  return (\n    <div className="rounded-xl border border-slate-200 p-4 bg-white/80 backdrop-blur">\n      <h4 className="text-sm font-semibold text-slate-800">${name}</h4>\n      <p className="text-xs text-slate-500 mt-1">CleanForge architecture standard component</p>\n    </div>\n  );\n};`;
      }

      return NextResponse.json({ success: true, data: { code: fallbackCode } });
    }
  } catch (e) {
    console.error("POST /api/standards/generate-example error", e);
    return NextResponse.json(
      { success: false, message: "Failed to generate example code" },
      { status: 500 },
    );
  }
}

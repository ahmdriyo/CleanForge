"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { createQueryClient } from "@/lib/query-client";
import { AuthProvider } from "./AuthProvider";
import { Toaster } from "@/components/ui/sonner";

/**
 * MainProviders — single composition root for all app providers.
 * All future providers (Theme, etc.) should be added here
 * under src/providers/* and composed inside this component.
 * Keep src/components/providers.tsx as a thin re-export for
 * backward-compat (src/app/layout.tsx still imports from there).
 */
export default function MainProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Named export for `import { MainProviders }` usage
export { MainProviders };

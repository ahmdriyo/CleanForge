"use client";

import { useQuery } from "@tanstack/react-query";
import { dummyFolderTree } from "@/data-dummy/forge-dummy";

export const useForgeQuery = () =>
  useQuery({
    queryKey: ["forge-tree"],
    queryFn: async () => dummyFolderTree,
  });

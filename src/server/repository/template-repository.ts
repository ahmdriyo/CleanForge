import { dummyTemplates } from "@/data-dummy/templates-dummy";
import type { Template } from "@/types/standard";

/**
 * Templates are static for now (FE first), but repository abstracts future Firestore fetch
 */

export const getTemplates = async (): Promise<Template[]> => {
  return dummyTemplates;
};

export const getTemplateById = async (id: string): Promise<Template | null> => {
  return dummyTemplates.find((t) => t.id === id) || null;
};

/**
 * Template Types — synced FE/BE
 * Static 3 templates + future Firestore templates
 */

import type { FolderNode } from "./standard";

export interface TemplateDetail {
  id: string;
  name: string;
  framework: string;
  description: string;
  structurePreview: string;
  icon: string;
  accent: string;
  rules: string;
  folderStructure: FolderNode;
}

export interface CloneTemplateRequest {
  templateId: string;
  name?: string;
}

export interface CloneTemplateResponse {
  standardId: string;
  message: string;
}

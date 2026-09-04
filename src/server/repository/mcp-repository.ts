import { adminDb } from "@/server/infra/firebase-admin";
import type { McpEndpoint } from "@/types/standard";

const collectionPath = (uid: string) => `users/${uid}/mcps`;

export const createOrUpdateMcp = async (uid: string, data: Omit<McpEndpoint, "id" | "createdAt"> & { id?: string }): Promise<McpEndpoint> => {
  const col = adminDb.collection(collectionPath(uid));
  const id = data.id || col.doc().id;
  const now = new Date().toISOString();
  const existing = data.id ? await col.doc(id).get() : null;
  const mcp: McpEndpoint = {
    id,
    name: data.name,
    standardId: data.standardId,
    standardName: data.standardName,
    endpoint: data.endpoint,
    token: data.token, // hashed in production, plaintext only for response
    status: data.status,
    usageCount: existing?.exists ? (existing.data() as McpEndpoint).usageCount : data.usageCount || 0,
    createdAt: existing?.exists ? (existing.data() as McpEndpoint).createdAt : now,
  };
  await col.doc(id).set({ ...mcp, updatedAt: now }, { merge: true });
  return mcp;
};

export const getMcps = async (uid: string): Promise<McpEndpoint[]> => {
  const snap = await adminDb.collection(collectionPath(uid)).orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => d.data() as McpEndpoint);
};

export const incrementMcpUsage = async (uid: string, mcpId: string): Promise<void> => {
  const ref = adminDb.doc(`${collectionPath(uid)}/${mcpId}`);
  const doc = await ref.get();
  if (!doc.exists) return;
  const data = doc.data() as McpEndpoint;
  await ref.update({ usageCount: (data.usageCount || 0) + 1, lastUsedAt: new Date().toISOString() });
};

export const findMcpByStandardId = async (uid: string, standardId: string): Promise<McpEndpoint | null> => {
  const snap = await adminDb.collection(collectionPath(uid)).where("standardId", "==", standardId).limit(1).get();
  if (snap.empty) return null;
  return snap.docs[0].data() as McpEndpoint;
};

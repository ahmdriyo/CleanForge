import { adminDb } from "@/server/infra/firebase-admin";
import type { McpEndpoint } from "@/types/standard";

const collectionPath = (uid: string) => `users/${uid}/mcps`;

export const createOrUpdateMcp = async (
  uid: string,
  data: Omit<McpEndpoint, "id" | "createdAt"> & { id?: string },
): Promise<McpEndpoint> => {
  const col = adminDb.collection(collectionPath(uid));
  // Prefer finding existing by standardId to keep id stable
  let id = data.id;
  if (!id) {
    const existingByStd = await col.where("standardId", "==", data.standardId).limit(1).get();
    if (!existingByStd.empty) {
      id = existingByStd.docs[0].id;
    } else {
      id = col.doc().id;
    }
  }
  const now = new Date().toISOString();
  const existing = await col.doc(id).get();
  const prev = existing.exists ? (existing.data() as McpEndpoint) : null;
  const mcp: McpEndpoint = {
    id,
    name: data.name,
    standardId: data.standardId,
    standardName: data.standardName,
    endpoint: data.endpoint,
    token: data.token ?? null,
    status: data.status,
    usageCount: prev ? prev.usageCount : data.usageCount || 0,
    createdAt: prev ? prev.createdAt : now,
    expiresAt: data.expiresAt ?? prev?.expiresAt ?? null,
    requireToken: data.requireToken ?? prev?.requireToken ?? false,
    lastUsedAt: prev?.lastUsedAt ?? null,
    updatedAt: now,
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

export const getMcpById = async (uid: string, mcpId: string): Promise<McpEndpoint | null> => {
  const doc = await adminDb.doc(`${collectionPath(uid)}/${mcpId}`).get();
  if (!doc.exists) return null;
  return doc.data() as McpEndpoint;
};

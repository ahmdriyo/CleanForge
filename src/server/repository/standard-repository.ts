import { adminDb } from "@/server/infra/firebase-admin";
import type { Standard } from "@/types/standard";

const collectionPath = (uid: string) => `users/${uid}/standards`;

export const createStandard = async (uid: string, data: Omit<Standard, "id" | "createdAt" | "updatedAt">): Promise<Standard> => {
  const col = adminDb.collection(collectionPath(uid));
  const docRef = col.doc();
  const now = new Date().toISOString();
  const standard: Standard = {
    id: docRef.id,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  await docRef.set(standard);
  return standard;
};

export const getStandards = async (uid: string): Promise<Standard[]> => {
  const snap = await adminDb.collection(collectionPath(uid)).orderBy("updatedAt", "desc").get();
  return snap.docs.map((d) => d.data() as Standard);
};

export const getStandardById = async (uid: string, id: string): Promise<Standard | null> => {
  const doc = await adminDb.doc(`${collectionPath(uid)}/${id}`).get();
  if (!doc.exists) return null;
  return doc.data() as Standard;
};

export const updateStandard = async (uid: string, id: string, data: Partial<Standard>): Promise<Standard | null> => {
  const ref = adminDb.doc(`${collectionPath(uid)}/${id}`);
  const doc = await ref.get();
  if (!doc.exists) return null;
  const updated = { ...data, updatedAt: new Date().toISOString() };
  await ref.update(updated);
  const fresh = await ref.get();
  return fresh.data() as Standard;
};

export const deleteStandard = async (uid: string, id: string): Promise<boolean> => {
  const ref = adminDb.doc(`${collectionPath(uid)}/${id}`);
  const doc = await ref.get();
  if (!doc.exists) return false;
  await ref.delete();
  // also delete related journals and mcps
  const journals = await adminDb.collection(`users/${uid}/journals`).where("standardId", "==", id).get();
  const batch = adminDb.batch();
  journals.forEach((d) => batch.delete(d.ref));
  const mcps = await adminDb.collection(`users/${uid}/mcps`).where("standardId", "==", id).get();
  mcps.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  return true;
};

export const updateMcpToken = async (uid: string, standardId: string, hash: string, endpoint: string): Promise<void> => {
  const ref = adminDb.doc(`${collectionPath(uid)}/${standardId}`);
  await ref.update({ mcpToken: hash, mcpEndpoint: endpoint, updatedAt: new Date().toISOString() });
};

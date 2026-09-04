import { adminDb } from "@/server/infra/firebase-admin";
import type { ChatMessage } from "@/types/standard";
import type { Journal } from "@/types/journal.type";

const collectionPath = (uid: string) => `users/${uid}/journals`;

export const getOrCreateJournal = async (uid: string, standardId: string): Promise<Journal> => {
  const col = adminDb.collection(collectionPath(uid));
  const snap = await col.where("standardId", "==", standardId).limit(1).get();
  if (!snap.empty) {
    return snap.docs[0].data() as Journal;
  }
  const docRef = col.doc();
  const now = new Date().toISOString();
  const journal: Journal = {
    id: docRef.id,
    standardId,
    uid,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
  await docRef.set(journal);
  return journal;
};

export const getJournalById = async (uid: string, journalId: string): Promise<Journal | null> => {
  const doc = await adminDb.doc(`${collectionPath(uid)}/${journalId}`).get();
  if (!doc.exists) return null;
  return doc.data() as Journal;
};

export const getJournalByStandardId = async (uid: string, standardId: string): Promise<Journal | null> => {
  const col = adminDb.collection(collectionPath(uid));
  const snap = await col.where("standardId", "==", standardId).limit(1).get();
  if (snap.empty) return null;
  return snap.docs[0].data() as Journal;
};

export const appendMessages = async (uid: string, journalId: string, messages: ChatMessage[]): Promise<Journal | null> => {
  const ref = adminDb.doc(`${collectionPath(uid)}/${journalId}`);
  const doc = await ref.get();
  if (!doc.exists) return null;
  const existing = doc.data() as Journal;
  const updatedMessages = [...(existing.messages || []), ...messages];
  await ref.update({ messages: updatedMessages, updatedAt: new Date().toISOString() });
  const fresh = await ref.get();
  return fresh.data() as Journal;
};

export const getJournals = async (uid: string, standardId?: string): Promise<Journal[]> => {
  let query: FirebaseFirestore.Query = adminDb.collection(collectionPath(uid));
  if (standardId) query = query.where("standardId", "==", standardId);
  const snap = await query.orderBy("updatedAt", "desc").get();
  return snap.docs.map((d) => d.data() as Journal);
};

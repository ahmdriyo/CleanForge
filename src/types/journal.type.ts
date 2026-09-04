/**
 * Journal Types — synced FE/BE
 * Firestore: users/{uid}/journals/{journalId}
 * Chat history as array in document (decision: array)
 */

import type { ChatMessage } from "./standard";

export interface Journal {
  id: string;
  standardId: string;
  uid: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateJournalPayload {
  standardId: string;
  initialMessage?: string;
}

export interface AppendMessagePayload {
  journalId: string;
  message: ChatMessage;
}

export interface ChatRequest {
  standardId: string;
  journalId?: string;
  message: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
  journalId: string;
  messages: ChatMessage[];
}

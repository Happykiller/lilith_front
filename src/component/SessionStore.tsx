import { create } from 'zustand';

export interface SessionStore {
  name: string;
  sessionId: number;
  itemId: number;
}

export const sessionStore = create<SessionStore>((set) => ({
  name: null,
  sessionId: null,
  itemId: null
}))
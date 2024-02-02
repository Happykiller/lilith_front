import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ContextStore {
  login: string;
  sessionId: number;
  itemId: number;
}

const contextPersist = persist<ContextStore>(
  (set) => ({
    login: null,
    sessionId: null,
    itemId: null
  }),
  {
      name: "lilith-storage",
      storage: createJSONStorage(() => sessionStorage),
  }
);

export const contextStore = create<ContextStore>()(contextPersist);
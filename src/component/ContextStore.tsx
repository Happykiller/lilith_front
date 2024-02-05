import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ContextStore {
  id: string
  code: string
  accessToken: string
  sessionId: number
  itemId: number,
  reset: () => void
}

const initialState:any = {
  id: null,
  code: null,
  accessToken: null,
  sessionId: null,
  itemId: null
}

const contextPersist = persist<ContextStore>(
  (set) => ({
    ...initialState,
    reset: () => set(initialState)
  }),
  {
      name: "lilith-storage",
      storage: createJSONStorage(() => sessionStorage),
  }
);

export const contextStore = create<ContextStore>()(contextPersist);
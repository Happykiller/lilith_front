// src\component\ContextStore.tsx
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ContextStore {
  id: string|null
  code: string|null
  accessToken: string|null
  game_id: string|null
  item_id: string|null
  current_vote: string|null
  reset: () => void
}

const initialState:any = {
  id: null,
  code: null,
  accessToken: null,
  game_id: null,
  item_id: null,
  current_vote: null,
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
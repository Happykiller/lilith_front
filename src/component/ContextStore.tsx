import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ContextStore {
  id: string
  code: string
  accessToken: string
  game_id: string
  item_id: string,
  reset: () => void
}

const initialState:any = {
  id: null,
  code: null,
  accessToken: null,
  game_id: null,
  item_id: null
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
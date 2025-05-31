// src\component\stores\ContextStore.tsx
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { ThemeMode } from '@src/theme';

export interface ContextStore {
  id: string|null
  code: string|null
  access_token: string|null
  game_id: string|null
  item_id: string|null
  current_vote: string|null
  themeMode: ThemeMode
  setThemeMode?: (mode: ThemeMode) => void
  toggleTheme?: () => void
  reset: () => void
}

const initialState:any = {
  id: null,
  code: null,
  access_token: null,
  game_id: null,
  item_id: null,
  current_vote: null,
  themeMode: 'dark'
}

const contextPersist = persist<ContextStore>(
  (set, get) => ({
    ...initialState,
    themeMode: 'dark',
    setThemeMode: (mode) => set({ themeMode: mode }),
    toggleTheme: () =>  set({ themeMode: get().themeMode === 'dark' ? 'light' : 'dark' }),
    reset: () => set(initialState)
  }),
  {
      name: "lilith-storage",
      storage: createJSONStorage(() => localStorage),
  }
);

export const contextStore = create<ContextStore>()(contextPersist);
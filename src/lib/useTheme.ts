import { create } from 'zustand';

interface ThemeStore {
  dark: boolean;
  toggle: () => void;
}

export const useTheme = create<ThemeStore>((set) => ({
  dark: true,
  toggle: () => set((s) => ({ dark: !s.dark })),
}));

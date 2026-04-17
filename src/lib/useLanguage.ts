import { create } from 'zustand';
import { translations, type Lang } from './translations';

interface LanguageStore {
  lang: Lang;
  t: typeof translations.en;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

export const useLanguage = create<LanguageStore>((set) => ({
  lang: 'en',
  t: translations.en,
  setLang: (lang: Lang) => set({ lang, t: translations[lang] }),
  toggleLang: () =>
    set((state) => {
      const newLang = state.lang === 'en' ? 'ar' : 'en';
      return { lang: newLang, t: translations[newLang] };
    }),
}));

import { create } from 'zustand';

interface ContentItem {
  id: number;
  section: string;
  key: string;
  value_en: string;
  value_ar: string;
}

interface ContentStore {
  items: ContentItem[];
  loaded: boolean;
  fetch: () => Promise<void>;
  get: (section: string, key: string, lang: 'en' | 'ar', fallback?: string) => string;
}

export const useContent = create<ContentStore>((set, get) => ({
  items: [],
  loaded: false,
  fetch: async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (Array.isArray(data)) set({ items: data, loaded: true });
    } catch { /* fallback to translations */ }
  },
  get: (section, key, lang, fallback = '') => {
    const item = get().items.find(i => i.section === section && i.key === key);
    if (!item) return fallback;
    return lang === 'ar' ? (item.value_ar || fallback) : (item.value_en || fallback);
  },
}));

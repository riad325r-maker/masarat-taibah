import { useContent } from './useContent';
import { useLanguage } from './useLanguage';

/**
 * Get a CMS-managed text value. Falls back to the provided default if CMS hasn't loaded
 * or the key doesn't exist in the database.
 *
 * Usage: const title = useCms('hero', 'headline', t.hero.headline);
 */
export function useCms(section: string, key: string, fallback: string): string {
  const { lang } = useLanguage();
  const get = useContent(s => s.get);
  const loaded = useContent(s => s.loaded);
  if (!loaded) return fallback;
  const val = get(section, key, lang, '');
  return val || fallback;
}

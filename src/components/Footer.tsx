import { useLanguage } from '../lib/useLanguage';

export default function Footer() {
  const { t, lang } = useLanguage();
  const go = (h: string) => document.querySelector(h)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="py-14 transition-colors" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/images/logo-mark.png" alt="" className="w-7 h-7 rounded-md object-cover" />
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'مسارات طيبة' : 'Masarat Taibah'}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t.footer.desc}</p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-primary)' }}>{t.footer.quickLinks}</h4>
            {[{ l: t.nav.about, h: '#about' }, { l: t.nav.services, h: '#services' }, { l: t.nav.industries, h: '#industries' }, { l: t.nav.contact, h: '#contact' }].map(x => (
              <button key={x.h} onClick={() => go(x.h)} className="block text-xs mb-2 hover:text-[var(--accent)] transition" style={{ color: 'var(--text-secondary)' }}>{x.l}</button>
            ))}
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-primary)' }}>{t.footer.legal}</h4>
            {[t.footer.privacy, t.footer.terms, t.footer.cookies].map(l => (
              <span key={l} className="block text-xs mb-2 cursor-pointer hover:text-[var(--accent)] transition" style={{ color: 'var(--text-secondary)' }}>{l}</span>
            ))}
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'الشهادات' : 'Certifications'}
            </h4>
            {[t.footer.iso, t.footer.saso, t.footer.hse].map(c => (
              <div key={c} className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{c}</div>
            ))}
          </div>
        </div>
        <div className="pt-6 text-center" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}

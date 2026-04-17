import { useLanguage } from '../lib/useLanguage';

const names = ['Saudi Aramco', 'SABIC', 'Saudi Binladin Group', 'Al Rajhi', 'ACWA Power', 'Maaden', 'SEC', 'Nesma & Partners', 'Al Bawani', 'El Seif Engineering'];

export default function ClientLogos() {
  const { lang } = useLanguage();
  return (
    <section className="py-10 overflow-hidden" style={{ background: 'var(--bg-1)', borderBottom: '1px solid var(--line)' }}>
      <p className="text-center text-[10px] font-bold tracking-[0.2em] uppercase mb-6" style={{ color: 'var(--text-3)' }}>
        {lang === 'ar' ? 'يثق بنا قادة الصناعة في المملكة' : 'Trusted by leading industrial and energy companies'}
      </p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(to right, var(--bg-1), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(to left, var(--bg-1), transparent)' }} />
        <div className="flex" style={{ animation: 'marquee 45s linear infinite', width: 'max-content' }}>
          {[...names, ...names].map((n, i) => (
            <span key={i} className="mx-8 text-[13px] font-semibold whitespace-nowrap" style={{ color: 'var(--text-3)' }}>{n}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

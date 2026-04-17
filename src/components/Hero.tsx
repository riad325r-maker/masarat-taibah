import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../lib/useLanguage';
import { useCms } from '../lib/useCms';
import { ArrowRight, Phone, ChevronDown } from 'lucide-react';

export default function Hero() {
  const { t, lang } = useLanguage();
  const [av, setAv] = useState(0);
  const v1 = useRef<HTMLVideoElement>(null);
  const v2 = useRef<HTMLVideoElement>(null);

  // CMS-managed text with translation fallback
  const headline = useCms('hero', 'headline', t.hero.headline);
  const sub = useCms('hero', 'sub', t.hero.sub);
  const cta1 = useCms('hero', 'cta1', t.hero.cta1);
  const cta2 = useCms('hero', 'cta2', t.hero.cta2);
  const badge1 = useCms('hero', 'badge1', t.hero.badge1);
  const badge2 = useCms('hero', 'badge2', t.hero.badge2);
  const badge3 = useCms('hero', 'badge3', t.hero.badge3);

  useEffect(() => { const i = setInterval(() => setAv(p => p === 0 ? 1 : 0), 10000); return () => clearInterval(i); }, []);
  useEffect(() => { v1.current?.play().catch(() => {}); v2.current?.play().catch(() => {}); }, []);

  const go = (h: string) => document.querySelector(h)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" className="relative h-screen min-h-[700px] max-h-[1000px] overflow-hidden">
      <div className="absolute inset-0">
        <video ref={v1} src="/videos/hero1.mp4" muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms]" style={{ opacity: av === 0 ? 1 : 0 }} />
        <video ref={v2} src="/videos/hero2.mp4" muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms]" style={{ opacity: av === 1 ? 1 : 0 }} />
      </div>
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute bottom-0 inset-x-0 h-48" style={{ background: 'linear-gradient(to top, var(--bg-primary), transparent)' }} />

      <div className="relative z-10 h-full flex flex-col justify-end pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="max-w-2xl">
              <h1 className="text-[clamp(2rem,5vw,3.8rem)] font-extrabold text-white leading-[1.1] tracking-[-0.02em] mb-5">
                {headline}
              </h1>
              <p className="text-white/50 text-[15px] sm:text-base leading-relaxed mb-8 max-w-lg">
                {sub}
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => go('#contact')} className="group px-6 py-3 rounded-lg bg-[var(--accent)] text-white font-semibold text-sm flex items-center gap-2 hover:brightness-110 transition-all">
                  {cta1}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </button>
                <a href="tel:+966500000000" className="px-6 py-3 rounded-lg border border-white/15 text-white/80 font-semibold text-sm flex items-center gap-2 hover:bg-white/5 transition-all">
                  <Phone size={14} />
                  {lang === 'ar' ? 'اتصل الآن' : 'Call us now'}
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
            {[
              { n: '500M+', l: lang === 'ar' ? 'لتر تم توصيله' : 'Liters delivered' },
              { n: '850+', l: lang === 'ar' ? 'عميل نشط' : 'Active clients' },
              { n: '120+', l: lang === 'ar' ? 'ناقلة في الأسطول' : 'Tanker fleet' },
              { n: '24/7', l: lang === 'ar' ? 'خدمة مستمرة' : 'Nonstop service' },
            ].map((s, i) => (
              <div key={i} className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-extrabold text-white mono">{s.n}</span>
                <span className="text-xs text-white/35">{s.l}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.button onClick={() => go('#about')} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 text-white/20 hover:text-white/50 transition" animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <ChevronDown size={20} />
      </motion.button>
    </section>
  );
}

import { motion } from 'framer-motion';
import { useLanguage } from '../lib/useLanguage';
import { useCms } from '../lib/useCms';
import { useScrollReveal } from '../lib/useScrollReveal';
import { useCountUp } from '../lib/useCountUp';
import { ArrowRight } from 'lucide-react';

function Stat({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const { ref, visible } = useScrollReveal();
  const count = useCountUp(value, 2000, visible);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 16 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ delay, duration: 0.5 }} className="text-center">
      <div className="text-3xl sm:text-4xl font-extrabold mono" style={{ color: 'var(--accent)' }}>{count.toLocaleString()}{suffix}</div>
      <div className="text-xs font-medium mt-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{label}</div>
    </motion.div>
  );
}

export default function About() {
  const { t, lang } = useLanguage();
  const { ref, visible } = useScrollReveal();

  const tag = useCms('about', 'tag', t.about.tag);
  const title = useCms('about', 'title', t.about.title);
  const desc = useCms('about', 'desc', t.about.desc);
  const desc2 = useCms('about', 'desc2', t.about.desc2);
  const stat1 = useCms('about', 'stat1', t.about.stat1);
  const stat2 = useCms('about', 'stat2', t.about.stat2);
  const stat3 = useCms('about', 'stat3', t.about.stat3);
  const stat4 = useCms('about', 'stat4', t.about.stat4);

  return (
    <section id="about" className="section-pad transition-colors" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 pb-16" style={{ borderBottom: '1px solid var(--border)' }}>
          <Stat value={500} suffix="M+" label={stat1} delay={0} />
          <Stat value={850} suffix="+" label={stat2} delay={0.08} />
          <Stat value={120} suffix="+" label={stat3} delay={0.16} />
          <Stat value={15} suffix="+" label={stat4} delay={0.24} />
        </div>

        <div ref={ref} className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4 block" style={{ color: 'var(--accent)' }}>{tag}</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-[1.2] mb-6" style={{ color: 'var(--text-primary)' }}>{title}</h2>
            <p className="text-[15px] leading-[1.8] mb-4" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            <p className="text-[15px] leading-[1.8]" style={{ color: 'var(--text-secondary)' }}>{desc2}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden aspect-[3/4]">
                <img src="/images/about-real.jpg" alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="rounded-xl overflow-hidden flex-1">
                  <img src="/images/storage-real.jpg" alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="rounded-xl p-5 flex flex-col justify-center" style={{ background: 'var(--accent)' }}>
                  <span className="text-3xl font-extrabold text-white mono">15+</span>
                  <span className="text-xs text-white/70 font-medium mt-1">{lang === 'ar' ? 'سنوات خبرة' : 'Years of service'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

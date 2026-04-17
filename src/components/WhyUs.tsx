import { motion } from 'framer-motion';
import { useLanguage } from '../lib/useLanguage';
import { useScrollReveal } from '../lib/useScrollReveal';
import { ShieldCheck, Award, Satellite, DollarSign, HardHat, Headphones, CheckCircle } from 'lucide-react';

export default function WhyUs() {
  const { t, lang } = useLanguage();
  const { ref, visible } = useScrollReveal();
  const ar = lang === 'ar';

  const items = [
    { icon: ShieldCheck, ...t.whyUs.w1 },
    { icon: Award, ...t.whyUs.w2 },
    { icon: Satellite, ...t.whyUs.w3 },
    { icon: DollarSign, ...t.whyUs.w4 },
    { icon: HardHat, ...t.whyUs.w5 },
    { icon: Headphones, ...t.whyUs.w6 },
  ];

  const certs = [
    { name: 'ISO 9001:2015', sub: ar ? 'إدارة الجودة' : 'Quality Management' },
    { name: 'SASO', sub: ar ? 'المواصفات السعودية' : 'Saudi Standards' },
    { name: 'HSE', sub: ar ? 'الصحة والسلامة' : 'Health & Safety' },
    { name: 'Aramco Approved', sub: ar ? 'مورد معتمد' : 'Approved Vendor' },
  ];

  return (
    <section className="section" style={{ background: 'var(--bg-2)' }}>
      <div className="container">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} className="mb-12">
          <p className="label mb-3">{t.whyUs.tag}</p>
          <h2 className="heading mb-3">{t.whyUs.title}</h2>
          <p className="subtext">{t.whyUs.subtitle}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.04 }}
              className="card p-5">
              <item.icon size={18} className="mb-3" style={{ color: 'var(--orange)' }} />
              <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-0)' }}>{item.title}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-2)' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap gap-3 justify-center">
          {certs.map((c, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'var(--bg-1)', border: '1px solid var(--line)' }}>
              <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-1)' }}>{c.name}</span>
              <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>— {c.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

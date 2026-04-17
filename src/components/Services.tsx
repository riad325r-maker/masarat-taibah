import { motion } from 'framer-motion';
import { useLanguage } from '../lib/useLanguage';
import { useCms } from '../lib/useCms';
import { useScrollReveal } from '../lib/useScrollReveal';
import { Fuel, Truck, Siren, Database, BarChart3, FlaskConical } from 'lucide-react';

export default function Services() {
  const { t } = useLanguage();
  const { ref, visible } = useScrollReveal();

  const tag = useCms('services', 'tag', t.services.tag);
  const title = useCms('services', 'title', t.services.title);
  const subtitle = useCms('services', 'subtitle', t.services.subtitle);

  const services = [
    { icon: Fuel, title: useCms('services', 's1_title', t.services.s1.title), desc: useCms('services', 's1_desc', t.services.s1.desc) },
    { icon: Truck, title: useCms('services', 's2_title', t.services.s2.title), desc: useCms('services', 's2_desc', t.services.s2.desc) },
    { icon: Siren, title: useCms('services', 's3_title', t.services.s3.title), desc: useCms('services', 's3_desc', t.services.s3.desc) },
    { icon: Database, title: useCms('services', 's4_title', t.services.s4.title), desc: useCms('services', 's4_desc', t.services.s4.desc) },
    { icon: BarChart3, title: useCms('services', 's5_title', t.services.s5.title), desc: useCms('services', 's5_desc', t.services.s5.desc) },
    { icon: FlaskConical, title: useCms('services', 's6_title', t.services.s6.title), desc: useCms('services', 's6_desc', t.services.s6.desc) },
  ];

  return (
    <section id="services" className="section-pad transition-colors" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} className="mb-14">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3 block" style={{ color: 'var(--accent)' }}>{tag}</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h2>
          <p className="text-[15px] max-w-xl" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.06 }}
              className="premium-card group p-6 rounded-xl">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: 'var(--accent-bg)' }}>
                <s.icon size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
              <p className="text-sm leading-[1.7]" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

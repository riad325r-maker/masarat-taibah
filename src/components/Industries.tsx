import { motion } from 'framer-motion';
import { useLanguage } from '../lib/useLanguage';
import { useScrollReveal } from '../lib/useScrollReveal';
import { Building2, Truck, Factory, Fuel, Mountain, Zap } from 'lucide-react';

export default function Industries() {
  const { t } = useLanguage();
  const { ref, visible } = useScrollReveal();

  const items = [
    { icon: Building2, label: t.industries.i1, img: '/images/construction.jpg' },
    { icon: Truck, label: t.industries.i2, img: '/images/tanker-close.jpg' },
    { icon: Factory, label: t.industries.i3, img: '/images/factory.jpg' },
    { icon: Fuel, label: t.industries.i4, img: '/images/fuel-pump.jpg' },
    { icon: Mountain, label: t.industries.i5, img: '/images/mining.jpg' },
    { icon: Zap, label: t.industries.i6, img: '/images/power-plant.jpg' },
  ];

  return (
    <section id="industries" className="section" style={{ background: 'var(--bg-1)' }}>
      <div className="container">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} className="mb-12">
          <p className="label mb-3">{t.industries.tag}</p>
          <h2 className="heading mb-3">{t.industries.title}</h2>
          <p className="subtext">{t.industries.subtitle}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.05 }}
              className="group relative h-52 rounded-xl overflow-hidden">
              <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <item.icon size={14} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-white">{item.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

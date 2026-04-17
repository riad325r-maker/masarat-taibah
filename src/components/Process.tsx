import { motion } from 'framer-motion';
import { useLanguage } from '../lib/useLanguage';
import { useScrollReveal } from '../lib/useScrollReveal';
import { Send, CalendarCheck, TruckIcon, FileText } from 'lucide-react';

export default function Process() {
  const { t } = useLanguage();
  const { ref, visible } = useScrollReveal();

  const steps = [
    { icon: Send, ...t.process.p1, color: '#E8690B' },
    { icon: CalendarCheck, ...t.process.p2, color: '#3b82f6' },
    { icon: TruckIcon, ...t.process.p3, color: '#22c55e' },
    { icon: FileText, ...t.process.p4, color: '#a855f7' },
  ];

  return (
    <section id="process" className="section" style={{ background: 'var(--bg-1)' }}>
      <div className="container">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} className="text-center mb-14">
          <p className="label mb-3">{t.process.tag}</p>
          <h2 className="heading mb-3">{t.process.title}</h2>
          <p className="subtext mx-auto">{t.process.subtitle}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.08 }}
              className="text-center relative">
              {/* Connector line */}
              {i < 3 && <div className="hidden lg:block absolute top-7 left-[60%] w-[80%] h-px" style={{ background: 'var(--line)' }} />}
              <div className="mx-auto w-14 h-14 rounded-xl flex items-center justify-center mb-4 relative" style={{ background: `${s.color}12` }}>
                <s.icon size={20} style={{ color: s.color }} />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded text-[9px] font-extrabold flex items-center justify-center text-white" style={{ background: s.color }}>
                  {i + 1}
                </span>
              </div>
              <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-0)' }}>{s.title}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-2)' }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

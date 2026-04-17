import { motion } from 'framer-motion';
import { useLanguage } from '../lib/useLanguage';
import { useScrollReveal } from '../lib/useScrollReveal';
import { AlertTriangle, Lightbulb, Trophy } from 'lucide-react';

export default function CaseStudy() {
  const { t } = useLanguage();
  const { ref, visible } = useScrollReveal();

  const phases = [
    { icon: AlertTriangle, title: t.caseStudy.problemTitle, text: t.caseStudy.problem, color: '#ef4444' },
    { icon: Lightbulb, title: t.caseStudy.solutionTitle, text: t.caseStudy.solution, color: '#E8690B' },
    { icon: Trophy, title: t.caseStudy.resultTitle, text: t.caseStudy.result, color: '#22c55e' },
  ];

  const stats = [
    { val: t.caseStudy.stat1, label: t.caseStudy.stat1Label },
    { val: t.caseStudy.stat2, label: t.caseStudy.stat2Label },
    { val: t.caseStudy.stat3, label: t.caseStudy.stat3Label },
    { val: t.caseStudy.stat4, label: t.caseStudy.stat4Label },
  ];

  return (
    <section className="section" style={{ background: 'var(--bg-2)' }}>
      <div className="container">
        {/* Banner */}
        <motion.div ref={ref} initial={{ opacity: 0, y: 16 }} animate={visible ? { opacity: 1, y: 0 } : {}}
          className="relative rounded-xl overflow-hidden mb-10 h-[200px] sm:h-[260px]">
          <img src="/images/case-img.jpg" alt="" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7">
            <p className="label mb-2">{t.caseStudy.tag}</p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white max-w-md leading-tight">{t.caseStudy.title}</h2>
          </div>
        </motion.div>

        {/* Phases */}
        <div className="grid lg:grid-cols-3 gap-4 mb-8">
          {phases.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 + i * 0.08 }}
              className="card p-6 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: p.color }} />
              <div className="flex items-center gap-2 mb-3">
                <p.icon size={16} style={{ color: p.color }} />
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-0)' }}>{p.title}</h3>
              </div>
              <p className="text-[13px] leading-[1.7]" style={{ color: 'var(--text-2)' }}>{p.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <div key={i} className="text-center p-4 rounded-lg" style={{ background: 'var(--bg-1)', border: '1px solid var(--line)' }}>
              <div className="text-xl font-extrabold tabular-nums" style={{ color: 'var(--orange)' }}>{s.val}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-2)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

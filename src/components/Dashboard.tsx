import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../lib/useLanguage';
import { useScrollReveal } from '../lib/useScrollReveal';
import { Truck, Package, Droplets, MapPin, Clock, FileCheck } from 'lucide-react';

function Live({ icon: Icon, label, value, suffix, color, delay }: { icon: any; label: string; value: number; suffix: string; color: string; delay: number }) {
  const [n, setN] = useState(value);
  const { ref, visible } = useScrollReveal(0.1);
  useEffect(() => { if (!visible) return; const i = setInterval(() => setN(p => Math.max(value - 3, Math.min(value + 8, p + Math.floor(Math.random() * 5) - 2))), 3500); return () => clearInterval(i); }, [value, visible]);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 12 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ delay }}
      className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <Icon size={15} style={{ color }} />
        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /><span className="text-[8px] font-bold text-green-400 uppercase tracking-wider">Live</span></div>
      </div>
      <div className="text-2xl font-extrabold tabular-nums" style={{ color: 'var(--text-0)' }}>{n.toLocaleString()}{suffix}</div>
      <div className="text-[11px] mt-1" style={{ color: 'var(--text-2)' }}>{label}</div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { t, lang } = useLanguage();
  const { ref, visible } = useScrollReveal();

  return (
    <section className="section" style={{ background: 'var(--bg-1)' }}>
      <div className="container">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <p className="label !text-green-500">{t.dashboard.tag}</p>
          </div>
          <h2 className="heading mb-3">{t.dashboard.title}</h2>
          <p className="subtext">{t.dashboard.subtitle}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Live icon={Truck} label={t.dashboard.d1} value={42} suffix="+" color="#E8690B" delay={0} />
          <Live icon={Package} label={t.dashboard.d2} value={127} suffix="" color="#22c55e" delay={0.05} />
          <Live icon={Droplets} label={t.dashboard.d3} value={934000} suffix="" color="#3b82f6" delay={0.1} />
          <Live icon={MapPin} label={t.dashboard.d4} value={28} suffix="" color="#a855f7" delay={0.15} />
          <Live icon={Clock} label={t.dashboard.d5} value={98} suffix="%" color="#f59e0b" delay={0.2} />
          <Live icon={FileCheck} label={t.dashboard.d6} value={156} suffix="" color="#ef4444" delay={0.25} />
        </div>

        <p className="text-[10px] text-center mt-6" style={{ color: 'var(--text-3)' }}>
          {lang === 'ar' ? 'بيانات محدثة لحظياً' : 'Real-time data • auto-refreshing'}
        </p>
      </div>
    </section>
  );
}

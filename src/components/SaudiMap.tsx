import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../lib/useLanguage';
import { useScrollReveal } from '../lib/useScrollReveal';

const cities = [
  { name: 'Riyadh', ar: '\u0627\u0644\u0631\u064a\u0627\u0636', x: 55, y: 48, tankers: 14 },
  { name: 'Jeddah', ar: '\u062c\u062f\u0629', x: 30, y: 50, tankers: 8 },
  { name: 'Dammam', ar: '\u0627\u0644\u062f\u0645\u0627\u0645', x: 72, y: 42, tankers: 6 },
  { name: 'Tabuk', ar: '\u062a\u0628\u0648\u0643', x: 25, y: 22, tankers: 3 },
  { name: 'Abha', ar: '\u0623\u0628\u0647\u0627', x: 33, y: 72, tankers: 2 },
  { name: 'Jubail', ar: '\u0627\u0644\u062c\u0628\u064a\u0644', x: 70, y: 38, tankers: 4 },
  { name: 'Yanbu', ar: '\u064a\u0646\u0628\u0639', x: 28, y: 42, tankers: 3 },
  { name: 'NEOM', ar: '\u0646\u064a\u0648\u0645', x: 24, y: 18, tankers: 2 },
];

const routes = [
  [0, 2], [0, 1], [0, 5], [1, 6], [3, 7], [2, 5], [1, 4],
];

export default function SaudiMap() {
  const { lang } = useLanguage();
  const { ref, visible } = useScrollReveal();
  const ar = lang === 'ar';
  const [active, setActive] = useState<number | null>(null);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setPulse(p => (p + 1) % cities.length), 2000);
    return () => clearInterval(i);
  }, []);

  return (
    <section className="section transition-colors" style={{ background: 'var(--bg-1)' }}>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} className="mb-14">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3 block" style={{ color: 'var(--orange)' }}>
            {ar ? '\u062e\u0631\u064a\u0637\u0629 \u0627\u0644\u062a\u063a\u0637\u064a\u0629' : 'COVERAGE MAP'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3" style={{ color: 'var(--text-0)' }}>
            {ar ? '\u0646\u0627\u0642\u0644\u0627\u062a\u0646\u0627 \u0639\u0628\u0631 \u0627\u0644\u0645\u0645\u0644\u0643\u0629' : 'Our tankers across the Kingdom'}
          </h2>
          <p className="text-[15px] max-w-xl" style={{ color: 'var(--text-2)' }}>
            {ar ? '\u062a\u063a\u0637\u064a\u0629 \u0634\u0627\u0645\u0644\u0629 \u0644\u062c\u0645\u064a\u0639 \u0645\u0646\u0627\u0637\u0642 \u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0628\u0623\u0633\u0637\u0648\u0644 \u0645\u0648\u0632\u0639 \u0627\u0633\u062a\u0631\u0627\u062a\u064a\u062c\u064a\u0627\u064b' : 'Full Kingdom coverage with strategically distributed fleet'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 relative rounded-xl p-8 min-h-[400px]" style={{ background: 'var(--bg-2)', border: '1px solid var(--line)' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full" style={{ maxHeight: 420 }}>
              {/* Routes */}
              {routes.map(([a, b], i) => (
                <line key={i} x1={cities[a].x} y1={cities[a].y} x2={cities[b].x} y2={cities[b].y}
                  stroke="var(--orange)" strokeWidth="0.3" strokeDasharray="2,2" opacity={0.3} />
              ))}
              {/* Cities */}
              {cities.map((c, i) => (
                <g key={i} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} className="cursor-pointer">
                  {/* Pulse ring */}
                  {pulse === i && (
                    <circle cx={c.x} cy={c.y} r={4} fill="none" stroke="var(--orange)" strokeWidth="0.3" opacity={0.5}>
                      <animate attributeName="r" from="2" to="6" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={c.x} cy={c.y} r={active === i ? 2.5 : 1.8} fill="var(--orange)" className="transition-all duration-300" />
                  <text x={c.x} y={c.y - 3.5} textAnchor="middle" fontSize="2.5" fontWeight="600" fill="var(--text-2)">
                    {ar ? c.ar : c.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* City list */}
          <div className="space-y-2">
            {cities.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg transition-all"
                onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}
                style={{ background: active === i ? 'var(--orange-bg)' : 'var(--bg-2)', border: `1px solid ${active === i ? 'var(--orange)' : 'var(--line)'}` }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--orange)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-0)' }}>{ar ? c.ar : c.name}</span>
                </div>
                <span className="text-xs font-bold mono" style={{ color: 'var(--orange)' }}>{c.tankers} {ar ? '\u0646\u0627\u0642\u0644\u0629' : 'tankers'}</span>
              </div>
            ))}
            <div className="p-3 rounded-lg text-center" style={{ background: 'var(--orange-bg)', border: '1px solid var(--orange)' }}>
              <span className="text-2xl font-extrabold mono" style={{ color: 'var(--orange)' }}>42</span>
              <span className="text-xs font-semibold block mt-0.5" style={{ color: 'var(--text-2)' }}>{ar ? '\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0646\u0627\u0642\u0644\u0627\u062a \u0627\u0644\u0646\u0634\u0637\u0629' : 'Total active tankers'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

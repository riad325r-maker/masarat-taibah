import { motion } from 'framer-motion';
import { useLanguage } from '../lib/useLanguage';
import { useScrollReveal } from '../lib/useScrollReveal';
import { MapPin } from 'lucide-react';

const cities = [
  { name: 'Riyadh', ar: 'الرياض', x: 53, y: 52, major: true },
  { name: 'Jeddah', ar: 'جدة', x: 28, y: 56, major: true },
  { name: 'Dammam', ar: 'الدمام', x: 68, y: 45, major: true },
  { name: 'Makkah', ar: 'مكة', x: 27, y: 59, major: true },
  { name: 'Madinah', ar: 'المدينة', x: 30, y: 44, major: true },
  { name: 'Tabuk', ar: 'تبوك', x: 26, y: 28, major: false },
  { name: 'Abha', ar: 'أبها', x: 33, y: 72, major: false },
  { name: 'Jubail', ar: 'الجبيل', x: 67, y: 42, major: false },
  { name: 'Yanbu', ar: 'ينبع', x: 26, y: 47, major: false },
  { name: 'Hail', ar: 'حائل', x: 42, y: 35, major: false },
  { name: 'Jizan', ar: 'جيزان', x: 31, y: 79, major: false },
  { name: 'NEOM', ar: 'نيوم', x: 25, y: 25, major: false },
  { name: 'Al Khobar', ar: 'الخبر', x: 69, y: 46, major: false },
  { name: 'Najran', ar: 'نجران', x: 40, y: 76, major: false },
  { name: 'Buraydah', ar: 'بريدة', x: 48, y: 40, major: false },
  { name: 'Khamis Mushait', ar: 'خميس مشيط', x: 35, y: 73, major: false },
];

export default function CoverageMap() {
  const { lang } = useLanguage();
  const { ref, visible } = useScrollReveal();
  const isAr = lang === 'ar';

  return (
    <section className="section-pad transition-colors" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} style={{ color: 'var(--accent)' }} />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--accent)' }}>
              {isAr ? 'خريطة التغطية' : 'COVERAGE MAP'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3" style={{ color: 'var(--text-primary)' }}>
            {isAr ? 'نغطي كل منطقة في المملكة' : 'We cover every region in KSA'}
          </h2>
          <p className="text-[15px] max-w-xl mb-10" style={{ color: 'var(--text-secondary)' }}>
            {isAr ? 'أسطولنا يصل لـ 28+ مدينة ومنطقة عبر المملكة العربية السعودية' : 'Our fleet reaches 28+ cities and regions across Saudi Arabia'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="relative rounded-xl overflow-hidden p-8 sm:p-12" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', aspectRatio: '4/3' }}>
              {/* Saudi Arabia outline (simplified) */}
              <svg viewBox="0 0 100 100" className="w-full h-full" style={{ opacity: 0.15 }}>
                <path d="M25 20 L28 15 L35 18 L50 15 L65 18 L75 25 L78 35 L72 42 L70 50 L68 55 L60 60 L55 65 L50 70 L45 75 L40 80 L35 82 L30 80 L28 75 L25 65 L23 55 L22 45 L24 35 Z"
                  fill="var(--text-tertiary)" stroke="var(--text-tertiary)" strokeWidth="0.5" />
              </svg>

              {/* City dots */}
              {cities.map((city, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={visible ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 300 }}
                  className="absolute group"
                  style={{ left: `${city.x}%`, top: `${city.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <div className={`rounded-full ${city.major ? 'w-3 h-3' : 'w-2 h-2'}`}
                    style={{ background: city.major ? 'var(--accent)' : 'var(--accent-secondary)', boxShadow: city.major ? '0 0 12px var(--accent-glow)' : 'none' }} />
                  {city.major && <div className="absolute w-6 h-6 rounded-full -inset-1.5 animate-ping opacity-20" style={{ background: 'var(--accent)' }} />}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded text-[9px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                    {isAr ? city.ar : city.name}
                  </div>
                </motion.div>
              ))}

              {/* Connection lines from Riyadh */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" style={{ opacity: 0.06 }}>
                {cities.filter(c => !c.major || c.name === 'Riyadh').length && cities.filter(c => c.major && c.name !== 'Riyadh').map((c, i) => (
                  <line key={i} x1="53" y1="52" x2={c.x} y2={c.y} stroke="var(--accent)" strokeWidth="0.3" strokeDasharray="1 1" />
                ))}
              </svg>
            </div>
          </div>

          {/* City list */}
          <div>
            <div className="p-5 rounded-xl mb-4" style={{ background: 'var(--accent)', color: 'white' }}>
              <div className="text-3xl font-extrabold mono">28+</div>
              <div className="text-sm font-medium mt-1 opacity-80">{isAr ? 'مدينة ومنطقة' : 'Cities & regions'}</div>
            </div>

            <div className="space-y-1">
              {cities.filter(c => c.major).map((c, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{isAr ? c.ar : c.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded ml-auto" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                    {isAr ? 'نشط' : 'Active'}
                  </span>
                </div>
              ))}
              <div className="p-3 rounded-lg text-center" style={{ background: 'var(--bg-card)', border: '1px dashed var(--border)' }}>
                <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>+{cities.length - cities.filter(c => c.major).length} {isAr ? 'مدينة أخرى' : 'more cities'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

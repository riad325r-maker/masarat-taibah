import { motion } from 'framer-motion';
import { useLanguage } from '../lib/useLanguage';
import { useScrollReveal } from '../lib/useScrollReveal';
import { Award } from 'lucide-react';

const milestones = {
  en: [
    { year: '2009', title: 'Founded', desc: 'Masarat Taibah established in Riyadh with 5 tanker trucks' },
    { year: '2012', title: 'ISO Certified', desc: 'Achieved ISO 9001:2015 quality management certification' },
    { year: '2015', title: '50+ Fleet', desc: 'Fleet expanded to 50 tankers covering central & western regions' },
    { year: '2018', title: 'Aramco Approved', desc: 'Became an Aramco-approved fuel vendor' },
    { year: '2020', title: '500+ Clients', desc: 'Crossed 500 active clients milestone nationwide' },
    { year: '2022', title: 'Smart Fleet', desc: 'Launched IoT-based fuel monitoring & GPS tracking system' },
    { year: '2024', title: '120+ Tankers', desc: 'Fleet reaches 120+ tankers across all 13 KSA regions' },
  ],
  ar: [
    { year: '2009', title: 'التأسيس', desc: 'تأسيس مسارات طيبة في الرياض بـ 5 ناقلات' },
    { year: '2012', title: 'شهادة ISO', desc: 'الحصول على شهادة ISO 9001:2015 لإدارة الجودة' },
    { year: '2015', title: '50+ ناقلة', desc: 'توسيع الأسطول إلى 50 ناقلة تغطي المنطقة الوسطى والغربية' },
    { year: '2018', title: 'اعتماد أرامكو', desc: 'أصبحنا مورد وقود معتمد من أرامكو' },
    { year: '2020', title: '500+ عميل', desc: 'تجاوز 500 عميل نشط على مستوى المملكة' },
    { year: '2022', title: 'أسطول ذكي', desc: 'إطلاق نظام مراقبة الوقود والتتبع بتقنية IoT و GPS' },
    { year: '2024', title: '120+ ناقلة', desc: 'الأسطول يصل 120+ ناقلة عبر مناطق المملكة الـ 13' },
  ],
};

export default function Timeline() {
  const { lang } = useLanguage();
  const { ref, visible } = useScrollReveal();
  const isAr = lang === 'ar';
  const items = isAr ? milestones.ar : milestones.en;

  return (
    <section className="section-pad transition-colors overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Award size={16} style={{ color: 'var(--accent)' }} />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--accent)' }}>
              {isAr ? 'مسيرتنا' : 'OUR JOURNEY'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            {isAr ? '15 عاماً من النمو المستمر' : '15 years of continuous growth'}
          </h2>
        </motion.div>

        {/* Horizontal scrollable timeline */}
        <div className="relative">
          <div className="overflow-x-auto pb-4 -mx-5 px-5 sm:-mx-8 sm:px-8 scrollbar-hide">
            <div className="flex gap-4 min-w-max">
              {items.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="relative w-[200px] flex-shrink-0"
                >
                  {/* Connector line */}
                  {i < items.length - 1 && (
                    <div className="absolute top-[18px] left-[calc(50%+16px)] w-[calc(100%-16px)] h-[1px]" style={{ background: 'var(--border)' }} />
                  )}

                  {/* Dot */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: i === items.length - 1 ? 'var(--accent)' : 'var(--border-strong)', boxShadow: i === items.length - 1 ? '0 0 8px var(--accent-glow)' : 'none' }} />
                    <span className="text-sm font-extrabold mono" style={{ color: i === items.length - 1 ? 'var(--accent)' : 'var(--text-primary)' }}>{m.year}</span>
                  </div>

                  <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{m.title}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

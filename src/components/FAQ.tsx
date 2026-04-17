import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../lib/useLanguage';
import { useScrollReveal } from '../lib/useScrollReveal';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = {
  en: [
    { q: 'What is the minimum order quantity?', a: 'Our minimum order is 5,000 liters for standard deliveries. For bulk contracts (50,000L+), we offer special pricing and priority scheduling.' },
    { q: 'How fast can you deliver?', a: 'Standard delivery within 24-48 hours. Emergency deliveries can be dispatched within 2-4 hours to major cities across KSA.' },
    { q: 'Do you provide fuel quality certificates?', a: 'Yes. Every delivery comes with a lab-tested quality certificate meeting SASO standards and Aramco specifications. Digital copies are sent automatically.' },
    { q: 'What areas do you cover?', a: 'We cover all 13 regions of Saudi Arabia with 28+ cities. Our strategic depot network ensures we can reach even the most remote project sites.' },
    { q: 'Can I track my delivery in real-time?', a: 'Absolutely. Every tanker is GPS-tracked. You receive a live tracking link via SMS once your delivery is dispatched, plus automated notifications at each stage.' },
    { q: 'Do you offer long-term supply contracts?', a: 'Yes, we offer flexible contracts from 3 months to multi-year agreements with locked-in pricing, priority scheduling, and dedicated account management.' },
  ],
  ar: [
    { q: 'ما هو الحد الأدنى للطلب؟', a: 'الحد الأدنى للطلب هو 5,000 لتر للتوصيلات العادية. لعقود الجملة (50,000 لتر+)، نقدم أسعار خاصة وجدولة أولوية.' },
    { q: 'كم تستغرق عملية التوصيل؟', a: 'التوصيل العادي خلال 24-48 ساعة. التوصيلات الطارئة يمكن إرسالها خلال 2-4 ساعات للمدن الرئيسية في المملكة.' },
    { q: 'هل تقدمون شهادات جودة الوقود؟', a: 'نعم. كل توصيلة تأتي مع شهادة جودة مفحوصة مخبرياً وفق معايير ساسو ومواصفات أرامكو. النسخ الرقمية تُرسل تلقائياً.' },
    { q: 'ما هي المناطق التي تغطونها؟', a: 'نغطي جميع مناطق المملكة الـ 13 مع 28+ مدينة. شبكة مستودعاتنا الاستراتيجية تضمن وصولنا حتى لأبعد مواقع المشاريع.' },
    { q: 'هل يمكنني تتبع التوصيلة مباشرة؟', a: 'بالتأكيد. كل ناقلة متتبعة بـ GPS. تستلم رابط تتبع حي عبر SMS فور إرسال التوصيلة، مع إشعارات آلية في كل مرحلة.' },
    { q: 'هل تقدمون عقود إمداد طويلة الأمد؟', a: 'نعم، نقدم عقود مرنة من 3 أشهر إلى اتفاقيات متعددة السنوات مع أسعار مثبتة وجدولة أولوية وإدارة حساب مخصصة.' },
  ],
};

function AccordionItem({ q, a, open, toggle }: { q: string; a: string; open: boolean; toggle: () => void }) {
  return (
    <div className="rounded-xl overflow-hidden transition-colors" style={{ background: 'var(--bg-card)', border: `1px solid ${open ? 'var(--border-strong)' : 'var(--border)'}` }}>
      <button onClick={toggle} className="w-full flex items-center justify-between p-5 text-left gap-4">
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{q}</span>
        <ChevronDown size={16} className="flex-shrink-0 transition-transform duration-300" style={{ color: 'var(--text-tertiary)', transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="px-5 pb-5 -mt-1">
              <p className="text-sm leading-[1.75]" style={{ color: 'var(--text-secondary)' }}>{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const { lang } = useLanguage();
  const { ref, visible } = useScrollReveal();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const isAr = lang === 'ar';
  const items = isAr ? faqs.ar : faqs.en;

  return (
    <section className="section-pad transition-colors" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[800px] mx-auto px-5 sm:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <HelpCircle size={16} style={{ color: 'var(--accent)' }} />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--accent)' }}>
              {isAr ? 'أسئلة شائعة' : 'FAQ'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3" style={{ color: 'var(--text-primary)' }}>
            {isAr ? 'أسئلة يسألها عملاؤنا' : 'Questions our clients ask'}
          </h2>
        </motion.div>

        <div className="space-y-2">
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.05 }}>
              <AccordionItem q={item.q} a={item.a} open={openIdx === i} toggle={() => setOpenIdx(openIdx === i ? null : i)} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

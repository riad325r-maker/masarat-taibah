import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../lib/useLanguage';
import { useScrollReveal } from '../lib/useScrollReveal';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name_en: string;
  name_ar: string;
  role_en: string;
  role_ar: string;
  text_en: string;
  text_ar: string;
  rating: number;
}

export default function Testimonials() {
  const { t, lang } = useLanguage();
  const { ref, visible } = useScrollReveal();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const prev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((p) => (p + 1) % testimonials.length);

  if (loading) {
    return (
      <section className="py-28 transition-colors duration-500" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;
  const item = testimonials[current];

  return (
    <section className="relative py-28 lg:py-36 transition-colors duration-500" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px] opacity-10" style={{ background: 'var(--accent)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: 'var(--accent)' }}>
              {t.testimonials.tag}
            </span>
            <div className="h-px w-10" style={{ background: 'var(--accent)' }} />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-5" style={{ color: 'var(--text-primary)' }}>
            {t.testimonials.title}
          </h2>
          <p className="text-lg max-w-2xl mx-auto font-light" style={{ color: 'var(--text-secondary)' }}>
            {t.testimonials.subtitle}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-10 sm:p-14 rounded-3xl text-center"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />

              <Quote size={48} className="mx-auto mb-8 opacity-10" style={{ color: 'var(--accent)' }} />

              <div className="flex justify-center gap-1 mb-8">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="#ff6a00" color="#ff6a00" />
                ))}
              </div>

              <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed mb-10 font-light" style={{ color: 'var(--text-primary)' }}>
                "{lang === 'ar' ? item.text_ar : item.text_en}"
              </p>

              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black text-white" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))' }}>
                  {(lang === 'ar' ? item.name_ar : item.name_en).charAt(0)}
                </div>
                <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                  <div className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? item.name_ar : item.name_en}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? item.role_ar : item.role_en}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="transition-all duration-500 rounded-full"
                  style={{
                    width: i === current ? 32 : 8,
                    height: 8,
                    background: i === current ? 'var(--accent)' : 'var(--border-strong)',
                    boxShadow: i === current ? '0 0 12px var(--accent-glow)' : 'none',
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

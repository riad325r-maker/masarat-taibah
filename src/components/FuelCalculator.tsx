import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../lib/useLanguage';
import { useScrollReveal } from '../lib/useScrollReveal';
import { Calculator, Fuel, TrendingDown, ArrowRight, Loader2 } from 'lucide-react';

interface FuelPrice {
  id: number;
  fuel_type: string;
  price_per_liter: number;
  min_order_liters: number;
}

export default function FuelCalculator() {
  const { lang } = useLanguage();
  const { ref, visible } = useScrollReveal();
  const [prices, setPrices] = useState<FuelPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [liters, setLiters] = useState(10000);
  const [fuelType, setFuelType] = useState('diesel_standard');
  const [frequency, setFrequency] = useState<'once' | 'monthly' | 'weekly'>('monthly');
  const isAr = lang === 'ar';

  useEffect(() => {
    fetch('/api/fuel-prices').then(r => r.json()).then(d => { setPrices(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const selected = prices.find(p => p.fuel_type === fuelType);
  const pricePerLiter = selected?.price_per_liter || 0.52;
  const total = liters * pricePerLiter;
  const yearlyTotal = frequency === 'weekly' ? total * 52 : frequency === 'monthly' ? total * 12 : total;
  const savings = yearlyTotal * 0.12;

  const fuelTypes = [
    { key: 'diesel_standard', label: isAr ? 'ديزل عادي' : 'Standard Diesel' },
    { key: 'diesel_premium', label: isAr ? 'ديزل ممتاز' : 'Premium Diesel' },
    { key: 'diesel_bulk', label: isAr ? 'ديزل بالجملة (50K+)' : 'Bulk Diesel (50K+)' },
  ];

  const freqOptions = [
    { key: 'once' as const, label: isAr ? 'مرة واحدة' : 'One-time' },
    { key: 'monthly' as const, label: isAr ? 'شهرياً' : 'Monthly' },
    { key: 'weekly' as const, label: isAr ? 'أسبوعياً' : 'Weekly' },
  ];

  if (loading) return null;

  return (
    <section className="section-pad transition-colors" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}}>
          <div className="flex items-center gap-2 mb-3">
            <Calculator size={16} style={{ color: 'var(--accent)' }} />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--accent)' }}>
              {isAr ? 'حاسبة التكلفة' : 'COST CALCULATOR'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3" style={{ color: 'var(--text-primary)' }}>
            {isAr ? 'احسب تكلفة الوقود' : 'Estimate your fuel cost'}
          </h2>
          <p className="text-[15px] max-w-xl mb-10" style={{ color: 'var(--text-secondary)' }}>
            {isAr ? 'أدخل الكمية واختر النوع لتحصل على تقدير فوري للتكلفة' : 'Enter your volume and fuel type for an instant cost estimate'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Controls */}
          <div className="lg:col-span-3 p-6 sm:p-8 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            {/* Fuel Type */}
            <label className="text-xs font-semibold mb-2.5 block" style={{ color: 'var(--text-secondary)' }}>
              {isAr ? 'نوع الوقود' : 'Fuel Type'}
            </label>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {fuelTypes.map(ft => (
                <button key={ft.key} onClick={() => setFuelType(ft.key)}
                  className="py-2.5 px-3 rounded-lg text-xs font-semibold transition-all text-center"
                  style={{
                    background: fuelType === ft.key ? 'var(--accent)' : 'var(--bg-elevated)',
                    color: fuelType === ft.key ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${fuelType === ft.key ? 'var(--accent)' : 'var(--border)'}`,
                  }}>
                  {ft.label}
                </button>
              ))}
            </div>

            {/* Volume Slider */}
            <label className="text-xs font-semibold mb-2.5 block" style={{ color: 'var(--text-secondary)' }}>
              {isAr ? 'الكمية (لتر)' : 'Volume (Liters)'}
            </label>
            <div className="flex items-center gap-4 mb-2">
              <input type="range" min={1000} max={500000} step={1000} value={liters}
                onChange={e => setLiters(Number(e.target.value))}
                className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, var(--accent) ${((liters - 1000) / 499000) * 100}%, var(--border) ${((liters - 1000) / 499000) * 100}%)` }}
              />
              <div className="mono text-lg font-bold min-w-[90px] text-right" style={{ color: 'var(--text-primary)' }}>
                {liters.toLocaleString()}
              </div>
            </div>
            <div className="flex justify-between text-[10px] mb-6" style={{ color: 'var(--text-tertiary)' }}>
              <span>1,000 L</span><span>500,000 L</span>
            </div>

            {/* Frequency */}
            <label className="text-xs font-semibold mb-2.5 block" style={{ color: 'var(--text-secondary)' }}>
              {isAr ? 'تكرار الطلب' : 'Order Frequency'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {freqOptions.map(f => (
                <button key={f.key} onClick={() => setFrequency(f.key)}
                  className="py-2.5 px-3 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: frequency === f.key ? 'var(--accent-bg-strong)' : 'var(--bg-elevated)',
                    color: frequency === f.key ? 'var(--accent)' : 'var(--text-secondary)',
                    border: `1px solid ${frequency === f.key ? 'var(--accent)' : 'var(--border)'}`,
                  }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Result */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="p-6 rounded-xl flex-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <Fuel size={16} className="mb-3" style={{ color: 'var(--accent)' }} />
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                {isAr ? 'التكلفة التقديرية' : 'Estimated Cost'}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold mono mb-1" style={{ color: 'var(--text-primary)' }}>
                {total.toLocaleString('en', { maximumFractionDigits: 0 })} <span className="text-base" style={{ color: 'var(--text-secondary)' }}>SAR</span>
              </div>
              <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                {pricePerLiter.toFixed(2)} SAR/{isAr ? 'لتر' : 'liter'}
              </div>
            </div>

            {frequency !== 'once' && (
              <div className="p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  {isAr ? 'التكلفة السنوية' : 'Yearly Cost'}
                </div>
                <div className="text-xl font-extrabold mono" style={{ color: 'var(--text-primary)' }}>
                  {yearlyTotal.toLocaleString('en', { maximumFractionDigits: 0 })} SAR
                </div>
              </div>
            )}

            <div className="p-6 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown size={14} className="text-green-500" />
                <span className="text-xs font-semibold text-green-500">{isAr ? 'توفيرك مع مسارات طيبة' : 'Your savings with us'}</span>
              </div>
              <div className="text-xl font-extrabold mono text-green-500">
                ~{savings.toLocaleString('en', { maximumFractionDigits: 0 })} SAR
              </div>
              <div className="text-[10px] text-green-500/60 mt-0.5">{isAr ? 'مقارنة بمتوسط السوق (~12%)' : 'vs market average (~12% savings)'}</div>
            </div>

            <button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="group w-full py-3 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition"
              style={{ background: 'var(--accent)' }}>
              {isAr ? 'احصل على عرض سعر دقيق' : 'Get an exact quote'}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

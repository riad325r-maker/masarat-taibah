import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../lib/useLanguage';
import { useScrollReveal } from '../lib/useScrollReveal';
import { Search, Package, Truck, MapPin, CheckCircle, Clock, Loader2 } from 'lucide-react';

interface Order {
  id: number;
  tracking_id: string;
  client_name: string;
  city: string;
  liters: number;
  status: string;
  created_at: string;
}

const statusSteps = ['loading', 'dispatched', 'in_transit', 'delivered'];
const statusLabels: Record<string, { en: string; ar: string; icon: any }> = {
  loading: { en: 'Loading', ar: '\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u062d\u0645\u064a\u0644', icon: Package },
  dispatched: { en: 'Dispatched', ar: '\u062a\u0645 \u0627\u0644\u0625\u0631\u0633\u0627\u0644', icon: Clock },
  in_transit: { en: 'In Transit', ar: '\u0641\u064a \u0627\u0644\u0637\u0631\u064a\u0642', icon: Truck },
  delivered: { en: 'Delivered', ar: '\u062a\u0645 \u0627\u0644\u062a\u0648\u0635\u064a\u0644', icon: CheckCircle },
};

export default function OrderTracker() {
  const { lang } = useLanguage();
  const { ref, visible } = useScrollReveal();
  const ar = lang === 'ar';
  const [trackingId, setTrackingId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const search = async () => {
    if (!trackingId.trim()) return;
    setLoading(true); setNotFound(false); setOrder(null);
    try {
      const res = await fetch(`/api/orders?tracking_id=${encodeURIComponent(trackingId.trim())}`);
      if (res.ok) { setOrder(await res.json()); }
      else { setNotFound(true); }
    } catch { setNotFound(true); }
    finally { setLoading(false); }
  };

  const currentStep = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <section className="section-pad transition-colors" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} className="mb-14">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3 block" style={{ color: 'var(--accent)' }}>
            {ar ? '\u062a\u062a\u0628\u0639 \u0627\u0644\u0637\u0644\u0628' : 'ORDER TRACKING'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3" style={{ color: 'var(--text-primary)' }}>
            {ar ? '\u062a\u062a\u0628\u0639 \u0634\u062d\u0646\u062a\u0643 \u0644\u062d\u0638\u0629 \u0628\u0644\u062d\u0638\u0629' : 'Track your delivery in real-time'}
          </h2>
          <p className="text-[15px] max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            {ar ? '\u0623\u062f\u062e\u0644 \u0631\u0642\u0645 \u0627\u0644\u062a\u062a\u0628\u0639 \u0644\u0645\u0639\u0631\u0641\u0629 \u062d\u0627\u0644\u0629 \u0637\u0644\u0628\u0643' : 'Enter your tracking number to see your order status'}
          </p>
        </motion.div>

        {/* Search */}
        <div className="max-w-xl mb-10">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute top-1/2 -translate-y-1/2 left-3" style={{ color: 'var(--text-tertiary)' }} />
              <input
                type="text" value={trackingId} onChange={e => setTrackingId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && search()}
                placeholder={ar ? 'MT-2024-00148' : 'e.g. MT-2024-00148'}
                className="w-full pl-9 pr-4 py-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--accent)] mono"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                dir="ltr"
              />
            </div>
            <button onClick={search} disabled={loading}
              className="px-5 py-3 rounded-lg text-white font-semibold text-sm hover:brightness-110 transition disabled:opacity-50"
              style={{ background: 'var(--accent)' }}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : (ar ? '\u062a\u062a\u0628\u0639' : 'Track')}
            </button>
          </div>
          <p className="text-[10px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
            {ar ? '\u062c\u0631\u0628: MT-2024-00148 \u0623\u0648 MT-2024-00150' : 'Try: MT-2024-00148 or MT-2024-00150'}
          </p>
        </div>

        {notFound && (
          <div className="p-6 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{ar ? '\u0644\u0645 \u064a\u062a\u0645 \u0627\u0644\u0639\u062b\u0648\u0631 \u0639\u0644\u0649 \u0627\u0644\u0637\u0644\u0628' : 'Order not found. Please check the tracking number.'}</p>
          </div>
        )}

        {order && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="p-6 sm:p-8 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            {/* Order info */}
            <div className="flex flex-wrap gap-6 mb-8 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{ar ? '\u0631\u0642\u0645 \u0627\u0644\u062a\u062a\u0628\u0639' : 'Tracking ID'}</div>
                <div className="text-sm font-bold mono" style={{ color: 'var(--accent)' }}>{order.tracking_id}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{ar ? '\u0627\u0644\u0639\u0645\u064a\u0644' : 'Client'}</div>
                <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{order.client_name}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{ar ? '\u0627\u0644\u0645\u062f\u064a\u0646\u0629' : 'City'}</div>
                <div className="text-sm font-bold flex items-center gap-1" style={{ color: 'var(--text-primary)' }}><MapPin size={12} /> {order.city}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{ar ? '\u0627\u0644\u0643\u0645\u064a\u0629' : 'Volume'}</div>
                <div className="text-sm font-bold mono" style={{ color: 'var(--text-primary)' }}>{order.liters.toLocaleString()} L</div>
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-between relative">
              {/* Line */}
              <div className="absolute top-5 left-[5%] right-[5%] h-[2px]" style={{ background: 'var(--border)' }}>
                <div className="h-full transition-all duration-700" style={{ width: `${Math.max(0, (currentStep / (statusSteps.length - 1)) * 100)}%`, background: 'var(--accent)' }} />
              </div>

              {statusSteps.map((step, i) => {
                const info = statusLabels[step];
                const Icon = info.icon;
                const active = i <= currentStep;
                const isCurrent = i === currentStep;
                return (
                  <div key={step} className="relative flex flex-col items-center z-10" style={{ width: '24%' }}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isCurrent ? 'ring-4 ring-[var(--accent)]/20' : ''}`}
                      style={{ background: active ? 'var(--accent)' : 'var(--bg-elevated)', border: active ? 'none' : '2px solid var(--border)' }}>
                      <Icon size={16} style={{ color: active ? 'white' : 'var(--text-tertiary)' }} />
                    </div>
                    <span className="text-[10px] font-semibold mt-2 text-center" style={{ color: active ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                      {ar ? info.ar : info.en}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

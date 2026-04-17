import { useState, useEffect } from 'react';
import { useLanguage } from '../lib/useLanguage';
import { ArrowLeft, Truck, MapPin, Clock, Fuel, RefreshCw } from 'lucide-react';

const statusColors: Record<string, string> = { on_road: '#22c55e', loading: '#3b82f6', delivered: '#a855f7', maintenance: '#f59e0b' };
const statusAr: Record<string, string> = { on_road: '\u0639\u0644\u0649 \u0627\u0644\u0637\u0631\u064a\u0642', loading: '\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u062d\u0645\u064a\u0644', delivered: '\u062a\u0645 \u0627\u0644\u062a\u0648\u0635\u064a\u0644', maintenance: '\u0635\u064a\u0627\u0646\u0629' };
const statusEn: Record<string, string> = { on_road: 'On Road', loading: 'Loading', delivered: 'Delivered', maintenance: 'Maintenance' };

export default function Tracking() {
  const { lang } = useLanguage();
  const [tankers, setTankers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isAr = lang === 'ar';

  const fetchTankers = async () => {
    setLoading(true);
    const res = await fetch('/api/tankers');
    const data = await res.json();
    setTankers(data);
    setLoading(false);
  };

  useEffect(() => { fetchTankers(); const i = setInterval(fetchTankers, 30000); return () => clearInterval(i); }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="max-w-[1400px] mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 text-sm font-semibold hover:text-[var(--accent)] transition" style={{ color: 'var(--text-secondary)' }}>
              <ArrowLeft size={14} /> {isAr ? '\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629' : 'Home'}
            </a>
            <span style={{ color: 'var(--text-tertiary)' }}>/</span>
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {isAr ? '\u062a\u062a\u0628\u0639 \u0627\u0644\u0646\u0627\u0642\u0644\u0627\u062a' : 'Fleet Tracking'}
            </span>
          </div>
          <button onClick={fetchTankers} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold" style={{ color: 'var(--accent)' }}>
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> {isAr ? '\u062a\u062d\u062f\u064a\u062b' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map placeholder */}
          <div className="lg:col-span-2 rounded-xl overflow-hidden relative" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', minHeight: 500 }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/45.0,24.5,5,0/900x500@2x?access_token=pk.placeholder" alt="" className="w-full h-full object-cover opacity-20" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <MapPin size={32} style={{ color: 'var(--accent)' }} />
                <p className="text-sm font-semibold mt-3" style={{ color: 'var(--text-primary)' }}>
                  {isAr ? '\u062e\u0631\u064a\u0637\u0629 \u062a\u062a\u0628\u0639 \u0627\u0644\u0623\u0633\u0637\u0648\u0644' : 'Fleet Tracking Map'}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {isAr ? `${tankers.filter(t => t.status === 'on_road').length} \u0646\u0627\u0642\u0644\u0629 \u0646\u0634\u0637\u0629 \u0627\u0644\u0622\u0646` : `${tankers.filter(t => t.status === 'on_road').length} tankers active now`}
                </p>
                {/* Tanker dots on map */}
                <div className="absolute inset-0">
                  {tankers.filter(t => t.status === 'on_road').map((t, i) => {
                    const x = ((t.lng - 36) / (55 - 36)) * 100;
                    const y = (1 - (t.lat - 16) / (32 - 16)) * 100;
                    return (
                      <button key={t.id} onClick={() => setSelected(t)}
                        className="absolute w-4 h-4 rounded-full border-2 border-white/50 hover:scale-150 transition-transform cursor-pointer z-10"
                        style={{ left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(5, Math.min(95, y))}%`, background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.5)' }}
                        title={t.plate}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Tanker list */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {isAr ? '\u0627\u0644\u0623\u0633\u0637\u0648\u0644' : 'Fleet'} ({tankers.length})
            </h3>
            {tankers.map(t => (
              <button key={t.id} onClick={() => setSelected(t)}
                className="w-full text-left p-4 rounded-xl transition-all"
                style={{ background: selected?.id === t.id ? 'var(--accent-bg-strong)' : 'var(--bg-card)', border: `1px solid ${selected?.id === t.id ? 'var(--accent)' : 'var(--border)'}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold mono" style={{ color: 'var(--text-primary)' }}>{t.plate}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ background: `${statusColors[t.status]}15`, color: statusColors[t.status] }}>
                    {isAr ? statusAr[t.status] : statusEn[t.status]}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="flex items-center gap-1"><Truck size={10} /> {t.driver}</span>
                  <span className="flex items-center gap-1"><Fuel size={10} /> {(t.fuel_load || 0).toLocaleString()}L</span>
                </div>
                {t.destination && (
                  <div className="flex items-center gap-1 text-xs mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <MapPin size={10} /> {t.destination}
                    {t.eta_minutes ? <span className="flex items-center gap-0.5 ml-2"><Clock size={10} /> {t.eta_minutes}m</span> : null}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Selected detail */}
        {selected && (
          <div className="mt-6 p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--accent)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{isAr ? '\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0646\u0627\u0642\u0644\u0629' : 'Tanker Details'}</h3>
              <button onClick={() => setSelected(null)} className="text-xs" style={{ color: 'var(--text-secondary)' }}>✕</button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>{isAr ? '\u0627\u0644\u0644\u0648\u062d\u0629' : 'Plate'}</div><div className="text-sm font-bold mono" style={{ color: 'var(--text-primary)' }}>{selected.plate}</div></div>
              <div><div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>{isAr ? '\u0627\u0644\u0633\u0627\u0626\u0642' : 'Driver'}</div><div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{selected.driver}</div></div>
              <div><div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>{isAr ? '\u0627\u0644\u062d\u0645\u0648\u0644\u0629' : 'Load'}</div><div className="text-sm font-bold mono" style={{ color: 'var(--text-primary)' }}>{(selected.fuel_load || 0).toLocaleString()}L</div></div>
              <div><div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>{isAr ? '\u0627\u0644\u0625\u062d\u062f\u0627\u062b\u064a\u0627\u062a' : 'Coords'}</div><div className="text-sm font-bold mono" style={{ color: 'var(--text-primary)' }}>{selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}</div></div>
            </div>
            {selected.destination && <div className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}><strong>{isAr ? '\u0627\u0644\u0648\u062c\u0647\u0629:' : 'Destination:'}</strong> {selected.destination}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  Lock, ArrowLeft, Truck, Package, Users, FileText, Shield, BarChart3,
  MessageSquare, Settings, MapPin, Clock, AlertTriangle, CheckCircle,
  Fuel, Search, RefreshCw, Loader2, X,
  Phone, Building2, Star, Globe, TrendingUp, Calendar, Route, Download,
  Edit3, Save, Trash2, Plus, Filter
} from 'lucide-react';

const PASS = 'masarat2024';

interface AdminData {
  tankers: any[];
  orders: any[];
  inquiries: any[];
  reviews: any[];
  stats: any[];
  security_logs: any[];
  blocked_ips: any[];
  cms: any[];
}

const stC: Record<string, string> = {
  on_road: '#22c55e', loading: '#3b82f6', delivered: '#a855f7',
  maintenance: '#f59e0b', pending: '#f59e0b', in_transit: '#3b82f6',
  completed: '#22c55e', cancelled: '#ef4444'
};

const stL: Record<string, string> = {
  on_road: 'على الطريق', loading: 'جاري التحميل', delivered: 'تم التوصيل',
  maintenance: 'صيانة', pending: 'بانتظار', in_transit: 'في الطريق',
  completed: 'مكتمل', cancelled: 'ملغي'
};

const Card = ({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div className={`rounded-xl ${className}`} style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', ...style }}>{children}</div>
);

const StatBox = ({ icon: Icon, label, val, color, sub }: { icon: any; label: string; val: string | number; color: string; sub?: string }) => (
  <Card className="p-5">
    <Icon size={15} style={{ color }} className="mb-3" />
    <div className="text-2xl font-extrabold text-white" style={{ fontFamily: 'DM Mono, monospace' }}>{val}</div>
    <div className="text-xs text-[#666] mt-1">{label}</div>
    {sub && <div className="text-[9px] text-[#444] mt-0.5">{sub}</div>}
  </Card>
);

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const [passErr, setPassErr] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [editingStat, setEditingStat] = useState<number | null>(null);
  const [editVal, setEditVal] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin-data');
      const d = await res.json();
      setData(d);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { if (authed) fetchData(); }, [authed]);

  const updateOrder = async (id: number, updates: any) => {
    await fetch('/api/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...updates }) });
    fetchData();
  };

  const updateTanker = async (id: number, updates: any) => {
    await fetch('/api/tankers', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...updates }) });
    fetchData();
  };

  const deleteReview = async (id: number) => {
    if (!confirm('حذف هذا التقييم؟')) return;
    await fetch('/api/reviews', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchData();
  };

  const updateStat = async (id: number, value: number) => {
    await fetch('/api/stats', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, value }) });
    setEditingStat(null);
    fetchData();
  };

  // Login
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0b0b0b' }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(232,105,11,0.1)' }}>
              <Lock size={24} color="#e8690b" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">لوحة تحكم مسارات طيبة</h1>
            <p className="text-sm text-[#666]">أدخل كلمة المرور للدخول</p>
          </div>
          <form onSubmit={e => { e.preventDefault(); if (pass === PASS) { setAuthed(true); setPassErr(false); } else setPassErr(true); }} className="space-y-3">
            <input type="password" value={pass} onChange={e => { setPass(e.target.value); setPassErr(false); }} placeholder="كلمة المرور" autoFocus
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-[#e8690b]"
              style={{ background: '#161616', border: `1px solid ${passErr ? '#ef4444' : 'rgba(255,255,255,0.06)'}` }} />
            {passErr && <p className="text-xs text-red-400">كلمة المرور غير صحيحة</p>}
            <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:brightness-110 transition" style={{ background: '#e8690b' }}>دخول</button>
          </form>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0b0b0b' }}>
        <Loader2 size={28} className="animate-spin text-[#e8690b]" />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', icon: BarChart3, label: 'نظرة عامة' },
    { id: 'tankers', icon: Truck, label: 'الناقلات' },
    { id: 'tracking', icon: MapPin, label: 'التتبع' },
    { id: 'orders', icon: Package, label: 'الطلبات' },
    { id: 'inquiries', icon: FileText, label: 'الاستفسارات' },
    { id: 'reviews', icon: MessageSquare, label: 'التقييمات' },
    { id: 'clients', icon: Users, label: 'العملاء' },
    { id: 'fuel', icon: Fuel, label: 'الوقود' },
    { id: 'drivers', icon: Users, label: 'السائقين' },
    { id: 'routes', icon: Route, label: 'المسارات' },
    { id: 'reports', icon: Download, label: 'التقارير' },
    { id: 'stats', icon: TrendingUp, label: 'الإحصائيات' },
    { id: 'security', icon: Shield, label: 'الحماية' },
    { id: 'settings', icon: Settings, label: 'الإعدادات' },
  ];

  const activeTankers = data.tankers.filter(t => t.status === 'on_road').length;
  const pendingOrders = data.orders.filter(o => o.status === 'pending').length;
  const totalFuel = data.tankers.reduce((s: number, t: any) => s + (t.fuel_load || 0), 0);

  // Extract unique clients from orders
  const clients = data.orders.reduce((acc: any[], o: any) => {
    if (!acc.find(c => c.phone === o.phone)) {
      acc.push({ name: o.client_name, company: o.company, phone: o.phone, orders: data.orders.filter(x => x.phone === o.phone).length, totalLiters: data.orders.filter(x => x.phone === o.phone).reduce((s: number, x: any) => s + (x.liters || 0), 0) });
    }
    return acc;
  }, []);

  // Extract unique drivers from tankers
  const drivers = data.tankers.map(t => ({ name: t.driver, plate: t.plate, status: t.status, fuel_load: t.fuel_load, destination: t.destination }));

  // Extract unique routes from tankers with destinations
  const routes = data.tankers.filter(t => t.destination).map(t => ({ from: 'المستودع', to: t.destination, tanker: t.plate, driver: t.driver, status: t.status, fuel: t.fuel_load, eta: t.eta_minutes }));

  const filterItems = (items: any[], fields: string[]) => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(item => fields.some(f => String(item[f] || '').toLowerCase().includes(q)));
  };

  const renderOverview = () => (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatBox icon={Truck} label="ناقلات نشطة" val={`${activeTankers}/${data.tankers.length}`} color="#22c55e" />
        <StatBox icon={Package} label="طلبات معلقة" val={pendingOrders} color="#f59e0b" sub={`إجمالي ${data.orders.length}`} />
        <StatBox icon={FileText} label="استفسارات" val={data.inquiries.length} color="#3b82f6" />
        <StatBox icon={Fuel} label="وقود محمّل" val={`${(totalFuel / 1000).toFixed(0)}K L`} color="#e8690b" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="text-sm font-bold text-white">آخر الطلبات</span>
            <button onClick={() => setTab('orders')} className="text-[10px] text-[#e8690b] font-semibold">عرض الكل</button>
          </div>
          {data.orders.slice(0, 5).map((o: any) => (
            <div key={o.id} className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <div>
                <div className="text-sm font-semibold text-white">{o.client_name}</div>
                <div className="text-[11px] text-[#666]">{o.company} · {(o.liters || 0).toLocaleString()}L</div>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ background: `${stC[o.status] || '#666'}15`, color: stC[o.status] || '#666' }}>{stL[o.status] || o.status}</span>
            </div>
          ))}
        </Card>
        <Card>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="text-sm font-bold text-white">آخر الاستفسارات</span>
            <button onClick={() => setTab('inquiries')} className="text-[10px] text-[#e8690b] font-semibold">عرض الكل</button>
          </div>
          {data.inquiries.slice(0, 5).map((inq: any) => (
            <div key={inq.id} className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <div>
                <div className="text-sm font-semibold text-white">{inq.name}</div>
                <div className="text-[11px] text-[#666]">{inq.company || inq.phone}</div>
              </div>
              <span className="text-[9px] text-[#555]" style={{ fontFamily: 'DM Mono' }}>{new Date(inq.created_at).toLocaleDateString('ar-SA')}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );

  const renderTankers = () => (
    <div className="space-y-3">
      {data.tankers.map((t: any) => (
        <Card key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${stC[t.status]}15` }}>
              <Truck size={16} style={{ color: stC[t.status] }} />
            </div>
            <div>
              <div className="text-sm font-bold text-white" style={{ fontFamily: 'DM Mono' }}>{t.plate}</div>
              <div className="text-[11px] text-[#666]">{t.driver} · {(t.fuel_load || 0).toLocaleString()}L</div>
              {t.destination && <div className="text-[11px] text-[#555] flex items-center gap-1 mt-0.5"><MapPin size={9} />{t.destination}</div>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select value={t.status} onChange={e => updateTanker(t.id, { status: e.target.value })}
              className="px-2.5 py-1.5 rounded-md text-xs font-semibold outline-none cursor-pointer" style={{ background: '#0b0b0b', border: '1px solid rgba(255,255,255,0.06)', color: stC[t.status] || '#fff' }}>
              {['on_road', 'loading', 'delivered', 'maintenance'].map(s => <option key={s} value={s}>{stL[s]}</option>)}
            </select>
            {t.eta_minutes && <span className="text-[11px] text-[#888] flex items-center gap-1"><Clock size={10} />{t.eta_minutes}د</span>}
          </div>
        </Card>
      ))}
    </div>
  );

  const renderTracking = () => {
    const active = data.tankers.filter(t => t.status === 'on_road');
    return (
      <div>
        <Card className="relative mb-5 overflow-hidden" style={{ minHeight: 380 }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a1628, #0d1117, #0a0f14)' }}>
            <svg viewBox="0 0 800 500" className="w-full h-full opacity-[0.06]">
              <path d="M200,100 L350,80 L500,100 L600,150 L650,250 L600,350 L500,400 L350,420 L250,380 L180,300 L150,200 Z" fill="none" stroke="#e8690b" strokeWidth="1.5" />
            </svg>
            {active.map((t: any) => {
              const x = ((t.lng - 36) / (55 - 36)) * 100;
              const y = (1 - (t.lat - 16) / (32 - 16)) * 100;
              return (
                <div key={t.id} className="absolute flex flex-col items-center" style={{ left: `${Math.max(8, Math.min(92, x))}%`, top: `${Math.max(8, Math.min(92, y))}%` }}>
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" style={{ boxShadow: '0 0 10px rgba(34,197,94,0.5)' }} />
                  <span className="text-[8px] font-bold text-white/50 mt-1 whitespace-nowrap" style={{ fontFamily: 'DM Mono' }}>{t.plate}</span>
                </div>
              );
            })}
          </div>
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold" style={{ background: 'rgba(0,0,0,0.6)', color: '#22c55e' }}>
            {active.length} ناقلة نشطة
          </div>
        </Card>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {active.map((t: any) => (
            <Card key={t.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white" style={{ fontFamily: 'DM Mono' }}>{t.plate}</span>
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /><span className="text-[9px] text-green-400 font-bold">LIVE</span></div>
              </div>
              <div className="text-[11px] text-[#666] space-y-1">
                <div className="flex items-center gap-1"><Users size={9} />{t.driver}</div>
                <div className="flex items-center gap-1"><Fuel size={9} />{(t.fuel_load || 0).toLocaleString()}L</div>
                <div className="flex items-center gap-1"><MapPin size={9} />{t.destination || 'غير محدد'}</div>
                {t.eta_minutes && <div className="flex items-center gap-1"><Clock size={9} />وصول خلال {t.eta_minutes} دقيقة</div>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderOrders = () => (
    <div className="space-y-3">
      {filterItems(data.orders, ['client_name', 'company', 'location']).map((o: any) => (
        <Card key={o.id} className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <div className="text-sm font-bold text-white">{o.client_name}</div>
              <div className="text-[11px] text-[#666]">{o.company} · <Phone size={9} className="inline" /> {o.phone}</div>
            </div>
            <select value={o.status} onChange={e => updateOrder(o.id, { status: e.target.value })}
              className="px-2.5 py-1.5 rounded-md text-xs font-semibold outline-none cursor-pointer" style={{ background: '#0b0b0b', border: '1px solid rgba(255,255,255,0.06)', color: stC[o.status] || '#fff' }}>
              {['pending', 'in_transit', 'completed', 'cancelled'].map(s => <option key={s} value={s}>{stL[s]}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap gap-3 text-[11px] text-[#888]">
            <span className="flex items-center gap-1"><Fuel size={10} />{(o.liters || 0).toLocaleString()}L</span>
            <span className="flex items-center gap-1"><MapPin size={10} />{o.location}</span>
            {o.assigned_tanker && <span className="flex items-center gap-1"><Truck size={10} />ناقلة #{o.assigned_tanker}</span>}
          </div>
          {o.notes && <div className="text-[11px] text-[#555] mt-2 italic">"{o.notes}"</div>}
        </Card>
      ))}
    </div>
  );

  const renderInquiries = () => (
    <div className="space-y-3">
      {filterItems(data.inquiries, ['name', 'company', 'phone']).map((inq: any) => (
        <Card key={inq.id} className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold text-white">{inq.name}</div>
            <span className="text-[9px] text-[#555]" style={{ fontFamily: 'DM Mono' }}>{new Date(inq.created_at).toLocaleDateString('ar-SA')}</span>
          </div>
          <div className="text-[11px] text-[#888] space-y-1">
            {inq.company && <div className="flex items-center gap-1"><Building2 size={9} />{inq.company}</div>}
            <div className="flex items-center gap-1"><Phone size={9} />{inq.phone}</div>
            {inq.fuel_needs && <div className="mt-2 p-2.5 rounded-lg text-[11px]" style={{ background: '#0b0b0b' }}>{inq.fuel_needs}</div>}
          </div>
        </Card>
      ))}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-3">
      {data.reviews.length === 0 ? (
        <div className="text-center py-12 text-[#555] text-sm">لا توجد تقييمات بعد</div>
      ) : data.reviews.map((r: any) => (
        <Card key={r.id} className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm font-bold text-white">{r.name}</span>
              {r.company && <span className="text-[11px] text-[#666] mr-2"> · {r.company}</span>}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">{[...Array(r.rating)].map((_, i) => <Star key={i} size={11} fill="#e8690b" color="#e8690b" />)}</div>
              <button onClick={() => deleteReview(r.id)} className="p-1 rounded hover:bg-red-500/10 transition" title="حذف"><Trash2 size={12} color="#ef4444" /></button>
            </div>
          </div>
          <p className="text-[12px] text-[#999] leading-relaxed">{r.comment}</p>
          <div className="text-[9px] text-[#444] mt-2" style={{ fontFamily: 'DM Mono' }}>{new Date(r.created_at).toLocaleString('ar-SA')}</div>
        </Card>
      ))}
    </div>
  );

  const renderClients = () => (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        <StatBox icon={Users} label="إجمالي العملاء" val={clients.length} color="#3b82f6" />
        <StatBox icon={Package} label="إجمالي الطلبات" val={data.orders.length} color="#22c55e" />
        <StatBox icon={Fuel} label="إجمالي اللترات" val={`${(data.orders.reduce((s: number, o: any) => s + (o.liters || 0), 0) / 1000).toFixed(0)}K`} color="#e8690b" />
      </div>
      <div className="space-y-3">
        {filterItems(clients, ['name', 'company', 'phone']).map((c: any, i: number) => (
          <Card key={i} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: `hsl(${(i * 47) % 360}, 60%, 40%)` }}>
                {c.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{c.name}</div>
                <div className="text-[11px] text-[#666]">{c.company} · {c.phone}</div>
              </div>
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-white" style={{ fontFamily: 'DM Mono' }}>{c.orders}</div>
              <div className="text-[9px] text-[#666]">طلبات · {(c.totalLiters / 1000).toFixed(0)}K L</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderFuel = () => {
    const totalCapacity = data.tankers.length * 36000;
    const loaded = totalFuel;
    const pct = totalCapacity > 0 ? (loaded / totalCapacity * 100).toFixed(1) : '0';
    return (
      <div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <StatBox icon={Fuel} label="وقود محمّل حالياً" val={`${(loaded / 1000).toFixed(0)}K L`} color="#e8690b" />
          <StatBox icon={Truck} label="سعة الأسطول الكلية" val={`${(totalCapacity / 1000).toFixed(0)}K L`} color="#3b82f6" />
          <StatBox icon={TrendingUp} label="نسبة التحميل" val={`${pct}%`} color="#22c55e" />
          <StatBox icon={Package} label="طلبات اليوم" val={data.orders.length} color="#a855f7" />
        </div>
        <Card className="p-5 mb-5">
          <h3 className="text-sm font-bold text-white mb-4">حالة التحميل لكل ناقلة</h3>
          <div className="space-y-3">
            {data.tankers.map((t: any) => {
              const cap = 36000;
              const pct = cap > 0 ? (t.fuel_load / cap * 100) : 0;
              return (
                <div key={t.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white" style={{ fontFamily: 'DM Mono' }}>{t.plate}</span>
                    <span className="text-[10px] text-[#888]">{(t.fuel_load || 0).toLocaleString()}L / {cap.toLocaleString()}L</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: '#0b0b0b' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct > 70 ? '#22c55e' : pct > 30 ? '#f59e0b' : '#ef4444' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-bold text-white mb-3">ملخص الطلبات حسب الكمية</h3>
          <div className="space-y-2">
            {data.orders.sort((a: any, b: any) => (b.liters || 0) - (a.liters || 0)).slice(0, 8).map((o: any) => (
              <div key={o.id} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <span className="text-xs text-[#ccc]">{o.client_name}</span>
                <span className="text-xs font-bold" style={{ fontFamily: 'DM Mono', color: '#e8690b' }}>{(o.liters || 0).toLocaleString()}L</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderDrivers = () => (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        <StatBox icon={Users} label="إجمالي السائقين" val={drivers.length} color="#3b82f6" />
        <StatBox icon={Truck} label="على الطريق" val={drivers.filter(d => d.status === 'on_road').length} color="#22c55e" />
        <StatBox icon={AlertTriangle} label="في الصيانة" val={drivers.filter(d => d.status === 'maintenance').length} color="#f59e0b" />
      </div>
      <div className="space-y-3">
        {drivers.map((d, i) => (
          <Card key={i} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: `${stC[d.status]}20` }}>
                <Users size={15} style={{ color: stC[d.status] }} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{d.name}</div>
                <div className="text-[11px] text-[#666]">ناقلة {d.plate} · {(d.fuel_load || 0).toLocaleString()}L</div>
              </div>
            </div>
            <div className="text-left">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ background: `${stC[d.status]}15`, color: stC[d.status] }}>{stL[d.status]}</span>
              {d.destination && <div className="text-[9px] text-[#555] mt-1">{d.destination}</div>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderRoutes = () => (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatBox icon={Route} label="مسارات نشطة" val={routes.filter(r => r.status === 'on_road').length} color="#22c55e" />
        <StatBox icon={MapPin} label="وجهات فريدة" val={[...new Set(routes.map(r => r.to))].length} color="#3b82f6" />
      </div>
      <div className="space-y-3">
        {routes.map((r, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: stC[r.status] }} />
              <span className="text-sm font-bold text-white">{r.from}</span>
              <span className="text-[#555]">→</span>
              <span className="text-sm font-bold" style={{ color: '#e8690b' }}>{r.to}</span>
            </div>
            <div className="flex flex-wrap gap-3 text-[11px] text-[#888]">
              <span className="flex items-center gap-1"><Truck size={10} />{r.tanker}</span>
              <span className="flex items-center gap-1"><Users size={10} />{r.driver}</span>
              <span className="flex items-center gap-1"><Fuel size={10} />{(r.fuel || 0).toLocaleString()}L</span>
              {r.eta && <span className="flex items-center gap-1"><Clock size={10} />{r.eta} دقيقة</span>}
            </div>
          </Card>
        ))}
        {routes.length === 0 && <div className="text-center py-10 text-[#555] text-sm">لا توجد مسارات نشطة حالياً</div>}
      </div>
    </div>
  );

  const renderReports = () => {
    const completedOrders = data.orders.filter(o => o.status === 'completed');
    const totalDelivered = completedOrders.reduce((s: number, o: any) => s + (o.liters || 0), 0);
    const avgOrder = completedOrders.length > 0 ? totalDelivered / completedOrders.length : 0;
    return (
      <div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <StatBox icon={CheckCircle} label="طلبات مكتملة" val={completedOrders.length} color="#22c55e" />
          <StatBox icon={Fuel} label="لترات تم توصيلها" val={`${(totalDelivered / 1000).toFixed(0)}K`} color="#3b82f6" />
          <StatBox icon={TrendingUp} label="متوسط الطلب" val={`${(avgOrder / 1000).toFixed(0)}K L`} color="#e8690b" />
          <StatBox icon={Star} label="متوسط التقييم" val={data.reviews.length > 0 ? (data.reviews.reduce((s: number, r: any) => s + r.rating, 0) / data.reviews.length).toFixed(1) : '—'} color="#f59e0b" />
        </div>
        <Card className="p-5 mb-5">
          <h3 className="text-sm font-bold text-white mb-4">توزيع حالات الطلبات</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['pending', 'in_transit', 'completed', 'cancelled'].map(status => {
              const count = data.orders.filter(o => o.status === status).length;
              return (
                <div key={status} className="text-center p-3 rounded-lg" style={{ background: '#0b0b0b' }}>
                  <div className="text-xl font-extrabold" style={{ fontFamily: 'DM Mono', color: stC[status] }}>{count}</div>
                  <div className="text-[10px] text-[#666] mt-0.5">{stL[status]}</div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-bold text-white mb-4">أكبر العملاء حسب الحجم</h3>
          <div className="space-y-2">
            {clients.sort((a: any, b: any) => b.totalLiters - a.totalLiters).slice(0, 5).map((c: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#555]" style={{ fontFamily: 'DM Mono' }}>#{i + 1}</span>
                  <div>
                    <div className="text-xs font-semibold text-white">{c.name}</div>
                    <div className="text-[10px] text-[#666]">{c.company}</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold" style={{ fontFamily: 'DM Mono', color: '#e8690b' }}>{(c.totalLiters / 1000).toFixed(0)}K L</div>
                  <div className="text-[9px] text-[#555]">{c.orders} طلبات</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderStats = () => (
    <div className="space-y-3">
      {data.stats.map((s: any) => (
        <Card key={s.id} className="p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-[#666] mb-0.5">{s.label_ar || s.key}</div>
            {editingStat === s.id ? (
              <div className="flex items-center gap-2">
                <input type="number" value={editVal} onChange={e => setEditVal(e.target.value)}
                  className="w-32 px-2 py-1 rounded text-sm text-white outline-none" style={{ background: '#0b0b0b', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'DM Mono' }} autoFocus />
                <button onClick={() => updateStat(s.id, parseInt(editVal))} className="p-1 rounded hover:bg-green-500/10"><Save size={13} color="#22c55e" /></button>
                <button onClick={() => setEditingStat(null)} className="p-1 rounded hover:bg-red-500/10"><X size={13} color="#ef4444" /></button>
              </div>
            ) : (
              <div className="text-xl font-extrabold text-white" style={{ fontFamily: 'DM Mono' }}>{s.value.toLocaleString()}</div>
            )}
          </div>
          {editingStat !== s.id && (
            <button onClick={() => { setEditingStat(s.id); setEditVal(String(s.value)); }} className="p-1.5 rounded hover:bg-white/5 transition">
              <Edit3 size={13} color="#888" />
            </button>
          )}
        </Card>
      ))}
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-3">
      {data.security_logs.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle size={28} className="mx-auto mb-3 text-green-500" />
          <div className="text-sm font-bold text-white">النظام آمن</div>
          <div className="text-xs text-[#666]">لا توجد تهديدات مكتشفة</div>
        </div>
      ) : data.security_logs.map((l: any, i: number) => (
        <Card key={i} className="p-4" style={{ borderColor: l.severity === 'critical' ? 'rgba(239,68,68,0.15)' : undefined }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: l.severity === 'critical' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: l.severity === 'critical' ? '#ef4444' : '#f59e0b' }}>{l.type}</span>
            <span className="text-[9px] text-[#555]" style={{ fontFamily: 'DM Mono' }}>{l.ip}</span>
          </div>
          <div className="text-[10px] text-[#666] space-y-0.5">
            <div>{l.method} {l.path}</div>
            {l.device_info && <div>{l.device_info}</div>}
            {l.country && <div>{l.city}, {l.country}</div>}
          </div>
        </Card>
      ))}
    </div>
  );

  const renderSettings = () => (
    <div>
      <Card className="p-5 mb-4">
        <h3 className="text-sm font-bold text-white mb-4">معلومات الشركة</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'اسم الشركة', value: 'مسارات طيبة' },
            { label: 'البريد الإلكتروني', value: 'info@masarat-taibah.com' },
            { label: 'رقم الهاتف', value: '+966 500 000 000' },
            { label: 'العنوان', value: 'طريق الملك فهد، الرياض' },
          ].map((f, i) => (
            <div key={i}>
              <label className="text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-1.5 block">{f.label}</label>
              <input type="text" defaultValue={f.value} className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-[#e8690b]" style={{ background: '#0b0b0b', border: '1px solid rgba(255,255,255,0.06)' }} />
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5 mb-4">
        <h3 className="text-sm font-bold text-white mb-4">الأمان</h3>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-1.5 block">كلمة مرور لوحة التحكم</label>
            <input type="password" defaultValue="masarat2024" className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-[#e8690b]" style={{ background: '#0b0b0b', border: '1px solid rgba(255,255,255,0.06)' }} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#0b0b0b' }}>
            <span className="text-xs text-[#999]">IPs محظورة</span>
            <span className="text-xs font-bold" style={{ fontFamily: 'DM Mono', color: data.blocked_ips.length > 0 ? '#ef4444' : '#22c55e' }}>{data.blocked_ips.length}</span>
          </div>
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="text-sm font-bold text-white mb-3">معلومات النظام</h3>
        <div className="space-y-2 text-[11px] text-[#888]">
          <div className="flex justify-between"><span>الإصدار</span><span className="text-white" style={{ fontFamily: 'DM Mono' }}>2.1.0</span></div>
          <div className="flex justify-between"><span>الناقلات</span><span className="text-white" style={{ fontFamily: 'DM Mono' }}>{data.tankers.length}</span></div>
          <div className="flex justify-between"><span>الطلبات</span><span className="text-white" style={{ fontFamily: 'DM Mono' }}>{data.orders.length}</span></div>
          <div className="flex justify-between"><span>التقييمات</span><span className="text-white" style={{ fontFamily: 'DM Mono' }}>{data.reviews.length}</span></div>
          <div className="flex justify-between"><span>الاستفسارات</span><span className="text-white" style={{ fontFamily: 'DM Mono' }}>{data.inquiries.length}</span></div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (tab) {
      case 'overview': return renderOverview();
      case 'tankers': return renderTankers();
      case 'tracking': return renderTracking();
      case 'orders': return renderOrders();
      case 'inquiries': return renderInquiries();
      case 'reviews': return renderReviews();
      case 'clients': return renderClients();
      case 'fuel': return renderFuel();
      case 'drivers': return renderDrivers();
      case 'routes': return renderRoutes();
      case 'reports': return renderReports();
      case 'stats': return renderStats();
      case 'security': return renderSecurity();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0b0b0b', color: '#e8e8e8' }} dir="rtl">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-52 flex-shrink-0" style={{ background: '#0f0f0f', borderLeft: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="p-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <img src="/images/logo-mark.png" alt="" className="w-6 h-6 rounded-md" />
          <div>
            <div className="text-xs font-bold text-white">مسارات طيبة</div>
            <div className="text-[8px] text-[#555]">لوحة التحكم</div>
          </div>
        </div>
        <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11px] font-medium transition-colors ${tab === t.id ? 'text-white' : 'text-[#666] hover:text-[#999]'}`}
              style={{ background: tab === t.id ? 'rgba(232,105,11,0.08)' : 'transparent' }}>
              <t.icon size={13} style={{ color: tab === t.id ? '#e8690b' : undefined }} />
              {t.label}
              {t.id === 'orders' && pendingOrders > 0 && <span className="mr-auto text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#f59e0b]/10 text-[#f59e0b]">{pendingOrders}</span>}
            </button>
          ))}
        </nav>
        <div className="p-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <a href="/" className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11px] text-[#666] hover:text-white transition">
            <ArrowLeft size={11} />الموقع الرئيسي
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-40 px-4 py-2.5 flex items-center justify-between gap-3" style={{ background: '#0b0b0b', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <h2 className="text-sm font-bold text-white">{tabs.find(t => t.id === tab)?.label}</h2>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#555]" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..."
                className="pr-8 pl-3 py-1.5 rounded-lg text-xs text-white outline-none w-44" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)' }} />
            </div>
            <button onClick={fetchData} className="p-1.5 rounded-lg hover:bg-white/5 transition" title="تحديث">
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} color="#888" />
            </button>
            <select value={tab} onChange={e => setTab(e.target.value)} className="lg:hidden px-2 py-1.5 rounded-lg text-[11px] outline-none" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', color: '#e8e8e8' }}>
              {tabs.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
        </header>
        <div className="p-4 sm:p-5">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../lib/useLanguage';
import { useScrollReveal } from '../lib/useScrollReveal';
import { Phone, MessageCircle, Mail, MapPin, Send, CheckCircle, Loader2, Clock } from 'lucide-react';

export default function Contact() {
  const { t, lang } = useLanguage();
  const { ref, visible } = useScrollReveal();
  const [form, setForm] = useState({ name: '', company: '', phone: '', fuel_needs: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const ar = lang === 'ar';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSending(true);
    try { const r = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); if (r.ok) { setSent(true); setForm({ name: '', company: '', phone: '', fuel_needs: '' }); setTimeout(() => setSent(false), 4000); } } catch (e) { console.error(e); } finally { setSending(false); }
  };

  const inp: React.CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line)', color: 'var(--text-0)', borderRadius: 8 };

  return (
    <section id="contact" className="section" style={{ background: 'var(--bg-2)' }}>
      <div className="container">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} className="mb-12">
          <p className="label mb-3">{t.contact.tag}</p>
          <h2 className="heading mb-3">{t.contact.title}</h2>
          <p className="subtext mb-4">{t.contact.subtitle}</p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'var(--orange-bg)', color: 'var(--orange)', border: '1px solid var(--orange-border)' }}>
            <Clock size={12} /> {ar ? 'رد خلال 12-24 ساعة' : 'Response within 12–24 hours'}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <form onSubmit={submit} className="card p-6 sm:p-8">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[11px] font-semibold mb-1.5 block" style={{ color: 'var(--text-2)' }}>{t.contact.name} *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--orange)]" style={inp} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold mb-1.5 block" style={{ color: 'var(--text-2)' }}>{t.contact.company}</label>
                  <input type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--orange)]" style={inp} />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-[11px] font-semibold mb-1.5 block" style={{ color: 'var(--text-2)' }}>{t.contact.phone} *</label>
                <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} dir="ltr" placeholder="+966 5XX XXX XXX" className="w-full px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--orange)]" style={inp} />
              </div>
              <div className="mb-6">
                <label className="text-[11px] font-semibold mb-1.5 block" style={{ color: 'var(--text-2)' }}>{t.contact.fuelNeeds}</label>
                <textarea rows={3} value={form.fuel_needs} onChange={e => setForm({ ...form, fuel_needs: e.target.value })} placeholder={t.contact.fuelPlaceholder} className="w-full px-3 py-2.5 text-sm outline-none resize-none focus:ring-2 focus:ring-[var(--orange)]" style={inp} />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full justify-center !py-3 disabled:opacity-50">
                {sent ? <><CheckCircle size={14} /> {ar ? 'تم الإرسال!' : 'Sent!'}</> : sending ? <Loader2 size={14} className="animate-spin" /> : <><Send size={13} /> {t.contact.submit}</>}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-3">
            {[
              { href: 'tel:+966500000000', icon: Phone, label: t.contact.callNow, sub: '+966 500 000 000', color: '#22c55e' },
              { href: 'https://wa.me/966500000000', icon: MessageCircle, label: t.contact.whatsapp, sub: '+966 500 000 000', color: '#25D366', ext: true },
              { href: 'mailto:info@masarat-taibah.com', icon: Mail, label: t.contact.email, sub: 'info@masarat-taibah.com', color: 'var(--orange)' },
            ].map((c, i) => (
              <a key={i} href={c.href} target={c.ext ? '_blank' : undefined} rel={c.ext ? 'noopener noreferrer' : undefined}
                className="card flex items-center gap-3 p-4 !rounded-lg">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}12` }}>
                  <c.icon size={15} style={{ color: c.color }} />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-0)' }}>{c.label}</div>
                  <div className="text-xs" style={{ color: 'var(--text-2)' }}>{c.sub}</div>
                </div>
              </a>
            ))}
            <div className="card flex items-center gap-3 p-4 !rounded-lg">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--orange-bg)' }}>
                <MapPin size={15} style={{ color: 'var(--orange)' }} />
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-0)' }}>{t.contact.address}</div>
                <div className="text-xs whitespace-pre-line" style={{ color: 'var(--text-2)' }}>{t.contact.addressText}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

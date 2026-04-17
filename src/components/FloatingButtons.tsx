import { useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '../lib/useLanguage';

export default function FloatingButtons() {
  const { lang } = useLanguage();
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 2000); return () => clearTimeout(t); }, []);
  if (!show) return null;
  return (
    <div className={`fixed bottom-5 z-50 flex flex-col gap-2 ${lang === 'ar' ? 'left-5' : 'right-5'}`}>
      <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer"
        className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
        <MessageCircle size={18} />
      </a>
      <a href="tel:+966500000000"
        className="w-11 h-11 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        style={{ background: 'var(--orange)', animation: 'pulse-glow 3s infinite' }}>
        <Phone size={18} />
      </a>
    </div>
  );
}

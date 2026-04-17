import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../lib/useLanguage';
import { useCms } from '../lib/useCms';
import { useTheme } from '../lib/useTheme';
import { Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { t, lang, toggleLang } = useLanguage();
  const { dark, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const navAbout = useCms('nav', 'about', t.nav.about);
  const navServices = useCms('nav', 'services', t.nav.services);
  const navIndustries = useCms('nav', 'industries', t.nav.industries);
  const navProcess = useCms('nav', 'process', t.nav.process);
  const navContact = useCms('nav', 'contact', t.nav.contact);
  const navQuote = useCms('nav', 'requestQuote', t.nav.requestQuote);

  const links = [
    { label: navAbout, href: '#about' },
    { label: navServices, href: '#services' },
    { label: navIndustries, href: '#industries' },
    { label: navProcess, href: '#process' },
    { label: navContact, href: '#contact' },
  ];

  const go = (href: string) => { setOpen(false); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}
        className="fixed top-0 inset-x-0 z-[100] transition-all duration-500"
        style={{
          background: scrolled ? 'var(--bg-primary)' : 'transparent',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          <a href="#hero" onClick={(e) => { e.preventDefault(); go('#hero'); }} className="flex items-center gap-2.5">
            <img src="/images/logo-mark.png" alt="" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-sm font-bold" style={{ color: scrolled ? 'var(--text-primary)' : 'white' }}>
              {lang === 'ar' ? 'مسارات طيبة' : 'Masarat Taibah'}
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <button key={l.href} onClick={() => go(l.href)} className="px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors hover:bg-white/5"
                style={{ color: scrolled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.6)' }}>
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleLang} className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider transition-colors"
              style={{ border: '1px solid var(--border-strong)', color: scrolled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.5)' }}>
              {lang === 'en' ? 'عربي' : 'EN'}
            </button>

            <button onClick={toggle} className="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
              style={{ border: '1px solid var(--border)', color: scrolled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.5)' }}>
              {dark ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <button onClick={() => go('#contact')} className="hidden sm:block px-4 py-1.5 rounded-md text-[12px] font-bold text-white transition-all hover:brightness-110"
              style={{ background: 'var(--accent)' }}>
              {navQuote}
            </button>

            <button onClick={() => setOpen(!open)} className="lg:hidden w-8 h-8 rounded-md flex items-center justify-center"
              style={{ color: scrolled ? 'var(--text-primary)' : 'white' }}>
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] pt-16 lg:hidden" style={{ background: 'var(--bg-primary)' }}>
            <div className="flex flex-col items-center justify-center h-full gap-3 p-8">
              {links.map((l, i) => (
                <motion.button key={l.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => go(l.href)} className="text-xl font-semibold py-2" style={{ color: 'var(--text-primary)' }}>
                  {l.label}
                </motion.button>
              ))}
              <button onClick={() => go('#contact')} className="mt-4 w-full max-w-xs py-3 rounded-lg font-bold text-white" style={{ background: 'var(--accent)' }}>
                {navQuote}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

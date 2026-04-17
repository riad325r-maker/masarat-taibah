import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLanguage } from './lib/useLanguage';
import { useTheme } from './lib/useTheme';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ClientLogos from './components/ClientLogos';
import About from './components/About';
import Timeline from './components/Timeline';
import Services from './components/Services';
import Industries from './components/Industries';
import WhyUs from './components/WhyUs';
import Process from './components/Process';
import CaseStudy from './components/CaseStudy';
import FuelCalculator from './components/FuelCalculator';
import CoverageMap from './components/CoverageMap';
import Dashboard from './components/Dashboard';
import Reviews from './components/Reviews';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import Admin from './pages/Admin';
import Tracking from './pages/Tracking';

function Site() {
  const { lang } = useLanguage();
  const { dark } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />
      <Hero />
      <ClientLogos />
      <About />
      <Timeline />
      <Services />
      <Industries />
      <WhyUs />
      <Process />
      <CaseStudy />
      <FuelCalculator />
      <CoverageMap />
      <Dashboard />
      <Reviews />
      <FAQ />
      <Contact />
      <Footer />
      <FloatingButtons />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Site />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/tracking" element={<Tracking />} />
      </Routes>
    </BrowserRouter>
  );
}

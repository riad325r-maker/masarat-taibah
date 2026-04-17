import supabase from './_supabase.js';
import { securityCheck, setSecureHeaders } from './_security.js';

export default async function handler(req, res) {
  setSecureHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  const ok = await securityCheck(req, res);
  if (!ok) return;

  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { liters, city, frequency } = req.body;
    if (typeof liters !== 'number' || liters < 1 || liters > 99999999) return res.status(400).json({ error: 'Invalid liters' });
    const basePrice = 2.18;
    const cityMult = { Riyadh: 1.0, Jeddah: 1.02, Dammam: 1.01, Tabuk: 1.08, Abha: 1.1, Neom: 1.12, Jubail: 1.03, Yanbu: 1.05 };
    const freqDisc = { once: 0, weekly: 0.03, monthly: 0.05, contract: 0.08 };
    const m = cityMult[city] || 1.05;
    const d = freqDisc[frequency] || 0;
    const ppl = basePrice * m * (1 - d);
    return res.status(200).json({ pricePerLiter: Math.round(ppl * 100) / 100, total: Math.round(ppl * liters), savings: Math.round(basePrice * m * liters - ppl * liters), currency: 'SAR' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

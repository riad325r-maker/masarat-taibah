import supabase from './_supabase.js';
import { securityCheck, setSecureHeaders } from './_security.js';

export default async function handler(req, res) {
  setSecureHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  const ok = await securityCheck(req, res);
  if (!ok) return;

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('coverage_cities').select('*').order('name_en', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { name_ar, name_en, region_ar, region_en } = req.body;
      if (!name_ar || !name_en) return res.status(400).json({ error: 'Missing fields' });
      const { data, error } = await supabase.from('coverage_cities').insert({ name_ar: name_ar.substring(0, 100), name_en: name_en.substring(0, 100), region_ar: (region_ar || '').substring(0, 100), region_en: (region_en || '').substring(0, 100), active: true }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

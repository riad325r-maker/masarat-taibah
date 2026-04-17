import supabase from './_supabase.js';
import { securityCheck, setSecureHeaders } from './_security.js';

export default async function handler(req, res) {
  setSecureHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  const ok = await securityCheck(req, res);
  if (!ok) return;

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('cms_content').select('*').order('section');
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'PUT') {
      const { id, value_en, value_ar } = req.body;
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const { data, error } = await supabase.from('cms_content').update({ value_en: String(value_en || '').substring(0, 5000), value_ar: String(value_ar || '').substring(0, 5000), updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

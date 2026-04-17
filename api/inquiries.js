import supabase from './_supabase.js';
import { securityCheck, setSecureHeaders } from './_security.js';

export default async function handler(req, res) {
  setSecureHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  const ok = await securityCheck(req, res);
  if (!ok) return;

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('inquiries').select('*').order('id', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { name, company, phone, fuel_needs } = req.body;
      if (!name || !phone) return res.status(400).json({ error: 'Missing fields' });
      if (name.length > 200 || (company && company.length > 200) || phone.length > 30 || (fuel_needs && fuel_needs.length > 2000))
        return res.status(400).json({ error: 'Input too long' });
      const { data, error } = await supabase.from('inquiries').insert({
        name: name.trim().substring(0, 200),
        company: company?.trim().substring(0, 200) || null,
        phone: phone.trim().substring(0, 30),
        fuel_needs: fuel_needs?.trim().substring(0, 2000) || null
      }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

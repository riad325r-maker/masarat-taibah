import supabase from './_supabase.js';
import { securityCheck, setSecureHeaders } from './_security.js';

export default async function handler(req, res) {
  setSecureHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  const ok = await securityCheck(req, res);
  if (!ok) return;

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('client_orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { client_name, company, phone, liters, location, notes } = req.body;
      if (!client_name || !phone) return res.status(400).json({ error: 'Missing fields' });
      const { data, error } = await supabase.from('client_orders').insert({
        client_name: client_name.substring(0, 200),
        company: company?.substring(0, 200),
        phone: phone.substring(0, 30),
        liters: typeof liters === 'number' ? Math.min(liters, 99999999) : null,
        location: location?.substring(0, 500),
        notes: notes?.substring(0, 1000)
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

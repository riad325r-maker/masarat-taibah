import supabase from './_supabase.js';
import { securityCheck, setSecureHeaders } from './_security.js';

export default async function handler(req, res) {
  setSecureHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  const ok = await securityCheck(req, res);
  if (!ok) return;

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { name, company, rating, comment } = req.body;
      if (!name || !comment || !rating) return res.status(400).json({ error: 'Missing fields' });
      if (typeof rating !== 'number' || rating < 1 || rating > 5) return res.status(400).json({ error: 'Invalid rating' });
      if (name.length > 100 || (company && company.length > 200) || comment.length > 2000) return res.status(400).json({ error: 'Input too long' });
      const { data, error } = await supabase.from('reviews').insert({
        name: name.trim().substring(0, 100),
        company: company?.trim().substring(0, 200) || null,
        rating: Math.min(5, Math.max(1, Math.round(rating))),
        comment: comment.trim().substring(0, 2000)
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

import supabase from './_supabase.js';
import { securityCheck, setSecureHeaders } from './_security.js';

export default async function handler(req, res) {
  setSecureHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  const ok = await securityCheck(req, res);
  if (!ok) return;

  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { review_id, visitor_id } = req.body;
    if (!review_id || !visitor_id) return res.status(400).json({ error: 'Missing fields' });
    if (String(visitor_id).length > 100) return res.status(400).json({ error: 'Invalid input' });

    const { data: existing } = await supabase.from('review_likes').select('id').eq('review_id', review_id).eq('visitor_id', String(visitor_id).substring(0, 100)).limit(1);
    if (existing?.length) {
      await supabase.from('review_likes').delete().eq('review_id', review_id).eq('visitor_id', visitor_id);
      const { count } = await supabase.from('review_likes').select('*', { count: 'exact', head: true }).eq('review_id', review_id);
      return res.status(200).json({ liked: false, likes: count || 0 });
    } else {
      await supabase.from('review_likes').insert({ review_id, visitor_id: String(visitor_id).substring(0, 100) });
      const { count } = await supabase.from('review_likes').select('*', { count: 'exact', head: true }).eq('review_id', review_id);
      return res.status(200).json({ liked: true, likes: count || 0 });
    }
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

import supabase from './_supabase.js';
import { securityCheck, setSecureHeaders } from './_security.js';

export default async function handler(req, res) {
  setSecureHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  const ok = await securityCheck(req, res);
  if (!ok) return;

  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const visitor_id = String(req.query.visitor_id || '').substring(0, 100);
    const { data: allLikes, error } = await supabase.from('review_likes').select('review_id, visitor_id');
    if (error) throw error;
    const counts = {};
    const userLiked = {};
    (allLikes || []).forEach(r => {
      counts[r.review_id] = (counts[r.review_id] || 0) + 1;
      if (visitor_id && r.visitor_id === visitor_id) userLiked[r.review_id] = true;
    });
    return res.status(200).json({ counts, userLiked });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

import supabase from './_supabase.js';
import { securityCheck, setSecureHeaders } from './_security.js';

export default async function handler(req, res) {
  setSecureHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  const ok = await securityCheck(req, res);
  if (!ok) return;

  // Admin routes require secret header
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const [tankers, orders, cms, inquiries, reviews, stats, security] = await Promise.all([
      supabase.from('tankers').select('*').order('id'),
      supabase.from('client_orders').select('*').order('created_at', { ascending: false }),
      supabase.from('cms_content').select('*').order('section'),
      supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*').order('created_at', { ascending: false }),
      supabase.from('company_stats').select('*').order('id'),
      supabase.from('security_logs').select('*').order('created_at', { ascending: false }).limit(50),
    ]);
    let blocked = { data: [] };
    try { blocked = await supabase.from('blocked_ips').select('*').order('created_at', { ascending: false }).limit(30); } catch {}
    return res.status(200).json({
      tankers: tankers.data || [], orders: orders.data || [], cms: cms.data || [],
      inquiries: inquiries.data || [], reviews: reviews.data || [], stats: stats.data || [],
      security_logs: security.data || [], blocked_ips: blocked.data || [],
    });
  } catch (err) {
    console.error('Admin error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

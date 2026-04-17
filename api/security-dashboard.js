import supabase from './_supabase.js';
import { securityCheck, setSecureHeaders } from './_security.js';

export default async function handler(req, res) {
  setSecureHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  const ok = await securityCheck(req, res);
  if (!ok) return;

  // Require admin key
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      const [logs, blocked, rates] = await Promise.all([
        supabase.from('security_logs').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('blocked_ips').select('*').order('created_at', { ascending: false }),
        supabase.from('rate_limits').select('*').order('window_start', { ascending: false }).limit(50),
      ]);
      return res.status(200).json({
        logs: logs.data || [],
        blocked: blocked.data || [],
        rate_limits: rates.data || [],
      });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

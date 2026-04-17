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

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { action, table, id, data: payload } = req.body;
    const ALLOWED_UPDATE = ['tankers', 'client_orders', 'cms_content', 'company_stats', 'reviews', 'inquiries'];
    const ALLOWED_DELETE = ['reviews', 'inquiries', 'blocked_ips', 'security_logs'];
    const ALLOWED_INSERT = ['tankers', 'client_orders', 'cms_content', 'company_stats'];

    if (action === 'update') {
      if (!table || !id || !payload || !ALLOWED_UPDATE.includes(table)) return res.status(400).json({ error: 'Invalid request' });
      const { data, error } = await supabase.from(table).update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (action === 'delete') {
      if (!table || !id || !ALLOWED_DELETE.includes(table)) return res.status(400).json({ error: 'Invalid request' });
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    if (action === 'insert') {
      if (!table || !payload || !ALLOWED_INSERT.includes(table)) return res.status(400).json({ error: 'Invalid request' });
      const { data, error } = await supabase.from(table).insert(payload).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (action === 'unblock_ip') {
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const { error } = await supabase.from('blocked_ips').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    console.error('Admin error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

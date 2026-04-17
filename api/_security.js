import supabase from './_supabase.js';

// ═══════════════════════════════════════════════════════════════
// MASARAT TAIBAH — FULL SECURITY MIDDLEWARE v2
// Rate limiting, WAF, bot detection, IP blocking, anti-scraping
// ═══════════════════════════════════════════════════════════════

const RATE_WINDOW = 60;
const RATE_MAX_GET = 40;
const RATE_MAX_POST = 6;

// ── Malicious User-Agent patterns ──
const BAD_UA = [
  /sqlmap/i, /nikto/i, /nmap/i, /masscan/i, /zgrab/i, /gobuster/i,
  /dirbuster/i, /wfuzz/i, /hydra/i, /burpsuite/i, /burp/i,
  /owasp/i, /zap\/|zaproxy/i, /metasploit/i, /nessus/i,
  /acunetix/i, /qualys/i, /nuclei/i, /subfinder/i, /amass/i,
  /ffuf/i, /feroxbuster/i, /httpx/i, /jaeles/i, /xray/i,
  /w3af/i, /arachni/i, /skipfish/i, /wpscan/i, /joomscan/i,
  /havij/i, /pangolin/i, /openvas/i, /whatweb/i,
  /python-requests/i, /python-urllib/i, /go-http-client/i,
  /curl\/|wget\//i, /libwww-perl/i, /httpclient/i,
  /scrapy/i, /phantom/i, /headless/i, /selenium/i, /puppeteer/i,
  /playwright/i, /webdriver/i,
  /httrack/i, /wget/i, /teleport/i, /webcopier/i, /websiteripper/i,
  /sitesucker/i, /webzip/i, /blackwidow/i, /offline\s*explorer/i,
  /pavuk/i, /webwhacker/i, /surfbot/i, /netspider/i,
  /crawl(?!.*google|.*bing|.*yahoo|.*yandex|.*duckduck|.*baidu|.*msnbot)/i,
  /spider(?!.*google|.*bing|.*yahoo)/i,
  /bot(?!.*google|.*bing|.*yahoo|.*yandex|.*duckduck|.*baidu|.*msnbot|.*slack|.*discord|.*telegram|.*whatsapp|.*facebook|.*twitter)/i,
];

// ── SQL Injection ──
const SQLI = [
  /('|"|--)\s*(or|and|union|select|insert|update|delete|drop|alter|create|exec)/i,
  /union\s+(all\s+)?select/i, /select\s+.*from\s+/i, /insert\s+into/i,
  /drop\s+(table|database)/i, /;\s*(drop|delete|update|insert|alter)/i,
  /\/\*.*\*\//, /0x[0-9a-f]{4,}/i, /char\s*\(/i, /concat\s*\(/i,
  /group_concat/i, /information_schema/i, /load_file/i,
  /into\s+(out|dump)file/i, /benchmark\s*\(/i, /sleep\s*\(/i, /waitfor\s+delay/i,
  /pg_sleep/i, /dbms_pipe/i, /utl_http/i,
];

// ── XSS ──
const XSS = [
  /<script[\s>]/i, /javascript\s*:/i,
  /on(error|load|click|mouseover|focus|blur|submit|change|input|keydown|keyup|mouseout|mouseenter)\s*=/i,
  /eval\s*\(/i, /document\.(cookie|domain|write|location)/i,
  /window\.(location|open)/i, /alert\s*\(/i, /prompt\s*\(/i, /confirm\s*\(/i,
  /<iframe/i, /<object/i, /<embed/i, /<svg[^>]*on/i,
  /\bdata:\s*text\/html/i, /expression\s*\(/i,
  /url\s*\(\s*['"]?\s*javascript/i, /vbscript\s*:/i,
];

// ── Path traversal / known attack paths ──
const PATH_ATTACK = [
  /\.\.\/|\.\.\\|%2e%2e/i,
  /\/etc\/(passwd|shadow|hosts)/i, /\/proc\/self/i, /\/windows\/system/i,
  /\/(wp-admin|wp-login|wp-content|xmlrpc|wp-includes)/i,
  /\/(administrator|joomla|drupal|magento)/i,
  /\.(env|git|svn|htaccess|htpasswd|config|bak|sql|log|ini|yml|yaml|toml|DS_Store)/i,
  /phpmyadmin|adminer|phpinfo|server-status|server-info/i,
  /\/(cgi-bin|shell|cmd|exec|system|eval)/i,
  /\/\.well-known\/(security\.txt)/i,
];

// ── Command injection ──
const CMD_INJ = [
  /;\s*(ls|cat|whoami|id|pwd|uname|curl|wget|nc|netcat|bash|sh|python|perl|ruby|php|rm\s)/i,
  /\|\s*(ls|cat|whoami|id|pwd|bash|sh)/i, /`[^`]+`/, /\$\([^)]+\)/,
  /&&\s*(ls|cat|whoami|rm|curl|wget)/i,
];

// ── Helpers ──
function getIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || req.socket?.remoteAddress
    || 'unknown';
}

function matchUA(ua) {
  if (!ua) return 'No User-Agent';
  for (const p of BAD_UA) { const m = ua.match(p); if (m) return m[0]; }
  return null;
}

function scanStr(s) {
  if (!s || typeof s !== 'string') return null;
  for (const p of SQLI) if (p.test(s)) return 'SQL_INJECTION';
  for (const p of XSS) if (p.test(s)) return 'XSS';
  for (const p of CMD_INJ) if (p.test(s)) return 'CMD_INJECTION';
  return null;
}

function scanObj(obj) {
  if (!obj || typeof obj !== 'object') return null;
  for (const [k, v] of Object.entries(obj)) {
    const ka = scanStr(k); if (ka) return { type: ka, field: k };
    if (typeof v === 'string') { const va = scanStr(v); if (va) return { type: va, field: k }; }
    if (typeof v === 'object' && v !== null) { const deep = scanObj(v); if (deep) return deep; }
  }
  return null;
}

function scanPath(path) {
  if (!path) return null;
  for (const p of PATH_ATTACK) if (p.test(path)) return 'PATH_TRAVERSAL';
  return scanStr(decodeURIComponent(path));
}

function deviceInfo(ua) {
  if (!ua) return 'Unknown';
  let os = 'Unknown';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/mac os/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad/i.test(ua)) os = 'iOS';
  let br = 'Unknown';
  if (/chrome\/([\d]+)/i.test(ua) && !/edge/i.test(ua)) br = 'Chrome';
  else if (/firefox/i.test(ua)) br = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) br = 'Safari';
  else if (/edge/i.test(ua)) br = 'Edge';
  return `${br} / ${os}`;
}

async function geoLookup(ip) {
  try {
    const r = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`, { signal: AbortSignal.timeout(1500) });
    const d = await r.json();
    if (d.status === 'success') return { country: d.country, city: d.city };
  } catch {}
  return { country: '-', city: '-' };
}

async function blockIP(ip, reason, tool, device, location) {
  try {
    const { data } = await supabase.from('blocked_ips').select('id,attempts').eq('ip', ip).limit(1);
    if (data?.length) {
      await supabase.from('blocked_ips').update({ attempts: (data[0].attempts || 1) + 1, reason, permanent: true }).eq('id', data[0].id);
    } else {
      await supabase.from('blocked_ips').insert({ ip, reason, tool_detected: tool, device_info: device, location, permanent: true });
    }
  } catch {}
}

async function logSec(ip, type, method, path, payload, ua, tool, device, country, city, blocked, severity) {
  try {
    await supabase.from('security_logs').insert({
      ip, type, method, path, payload: payload?.substring(0, 800),
      user_agent: ua?.substring(0, 400), tool_detected: tool,
      device_info: device, country, city, blocked, severity,
    });
  } catch {}
}

// ═══════════════════════════════════════════════════════════════
// MAIN SECURITY CHECK — call from every API route
// ═══════════════════════════════════════════════════════════════
export async function securityCheck(req, res) {
  const ip = getIP(req);
  const ua = req.headers['user-agent'] || '';
  const path = req.url || '';
  const method = req.method || '';

  // ── 1. Blocked IP check ──
  try {
    const { data: bl } = await supabase.from('blocked_ips').select('id,attempts').eq('ip', ip).limit(1);
    if (bl?.length) {
      await supabase.from('blocked_ips').update({ attempts: (bl[0].attempts || 1) + 1 }).eq('id', bl[0].id);
      res.status(403).json({ error: 'Access denied', ref: `BLK-${Date.now().toString(36)}` });
      return false;
    }
  } catch {}

  // ── 2. User-Agent / tool detection ──
  const tool = matchUA(ua);
  if (tool) {
    const geo = await geoLookup(ip);
    const dev = deviceInfo(ua);
    await blockIP(ip, `Tool: ${tool}`, tool, dev, `${geo.city}, ${geo.country}`);
    await logSec(ip, 'MALICIOUS_TOOL', method, path, null, ua, tool, dev, geo.country, geo.city, true, 'critical');
    res.status(403).json({ error: 'Access denied' });
    return false;
  }

  // ── 3. Path scan ──
  const pathType = scanPath(path);
  if (pathType) {
    const geo = await geoLookup(ip);
    const dev = deviceInfo(ua);
    await blockIP(ip, `${pathType} in URL`, pathType, dev, `${geo.city}, ${geo.country}`);
    await logSec(ip, pathType, method, path, path, ua, pathType, dev, geo.country, geo.city, true, 'critical');
    res.status(403).json({ error: 'Access denied' });
    return false;
  }

  // ── 4. Body scan (POST/PUT/PATCH) ──
  if (req.body && ['POST', 'PUT', 'PATCH'].includes(method)) {
    // Reject oversized bodies
    const bodyStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (bodyStr.length > 10000) {
      res.status(413).json({ error: 'Payload too large' });
      return false;
    }
    const bodyAttack = scanObj(req.body) || (() => { const t = scanStr(bodyStr); return t ? { type: t, field: 'raw' } : null; })();
    if (bodyAttack) {
      const geo = await geoLookup(ip);
      const dev = deviceInfo(ua);
      await blockIP(ip, `${bodyAttack.type} in body`, bodyAttack.type, dev, `${geo.city}, ${geo.country}`);
      await logSec(ip, bodyAttack.type, method, path, bodyStr.substring(0, 500), ua, bodyAttack.type, dev, geo.country, geo.city, true, 'critical');
      res.status(403).json({ error: 'Access denied' });
      return false;
    }
  }

  // ── 5. Query param scan ──
  if (req.query && Object.keys(req.query).length > 0) {
    const qAttack = scanObj(req.query);
    if (qAttack) {
      const geo = await geoLookup(ip);
      const dev = deviceInfo(ua);
      await blockIP(ip, `${qAttack.type} in query`, qAttack.type, dev, `${geo.city}, ${geo.country}`);
      await logSec(ip, qAttack.type, method, path, JSON.stringify(req.query), ua, qAttack.type, dev, geo.country, geo.city, true, 'critical');
      res.status(403).json({ error: 'Access denied' });
      return false;
    }
  }

  // ── 6. Rate limiting ──
  try {
    const since = new Date(Date.now() - RATE_WINDOW * 1000).toISOString();
    const max = method === 'POST' ? RATE_MAX_POST : RATE_MAX_GET;
    const { data: rl } = await supabase.from('rate_limits').select('id,count').eq('ip', ip).eq('endpoint', method).gte('window_start', since).limit(1);
    if (rl?.length) {
      const n = rl[0].count + 1;
      await supabase.from('rate_limits').update({ count: n }).eq('id', rl[0].id);
      if (n > max) {
        if (n > max * 4) {
          const geo = await geoLookup(ip);
          await blockIP(ip, `Rate abuse: ${n} reqs`, 'Rate Limit', deviceInfo(ua), `${geo.city}, ${geo.country}`);
        }
        res.status(429).json({ error: 'Too many requests', retry_after: RATE_WINDOW });
        return false;
      }
    } else {
      await supabase.from('rate_limits').insert({ ip, endpoint: method, count: 1 });
    }
  } catch {}

  return true;
}

// ═══════════════════════════════════════════════════════════════
// CORS + SECURITY HEADERS — call at the start of every handler
// ═══════════════════════════════════════════════════════════════
export function setSecureHeaders(req, res) {
  // Only allow our own domain + Vercel preview
  const origin = req.headers.origin || '';
  const allowed = [
    'https://diesel-fuel-supply-ksa',
    'https://masarat-taibah',
    'http://localhost',
  ];
  const isAllowed = allowed.some(a => origin.startsWith(a)) || origin.includes('.vercel.app');
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : 'null');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
}

export default { securityCheck, setSecureHeaders };

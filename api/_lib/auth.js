/* Shared auth, CORS, and rate-limiting helpers */

const SUPABASE_URL     = process.env.SUPABASE_URL     ?? "https://fklsetwqfdmangromprj.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrbHNldHdxZmRtYW5ncm9tcHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NjU1NTEsImV4cCI6MjA5NzA0MTU1MX0.RcOvY3R1SDegUJEz3eohOgVF-daDiz-OSnGPh1rCgQ4";

// ── Supabase JWT verification ────────────────────────────────
async function verifyAuth(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  const jwt = auth.slice(7);
  // Basic JWT shape check before hitting Supabase
  if (jwt.split(".").length !== 3) return null;
  try {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${jwt}` },
      signal: AbortSignal.timeout(5000)
    });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

// ── CORS ─────────────────────────────────────────────────────
function setCors(req, res, methods = "GET") {
  const origin = req.headers.origin ?? "";
  const allowed =
    !origin ||
    /^https?:\/\/localhost(:\d+)?$/.test(origin) ||
    origin.endsWith(".vercel.app") ||
    origin === (process.env.CORS_ORIGIN ?? "");
  res.setHeader("Access-Control-Allow-Origin", allowed ? (origin || "*") : "null");
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", methods + ", OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
}

// ── In-memory rate limiter ───────────────────────────────────
// Per-serverless-instance (no shared state across instances).
// Effective for burst protection; Supabase JWT auth already
// guards against unauthenticated callers.
const _rl = new Map();

function rateLimit(key, { max = 20, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const cutoff = now - windowMs;
  const hits = (_rl.get(key) ?? []).filter(t => t > cutoff);
  hits.push(now);
  _rl.set(key, hits);
  // Probabilistic cleanup to avoid unbounded Map growth
  if (Math.random() < 0.02) {
    for (const [k, v] of _rl) {
      if (!v.some(t => t > cutoff)) _rl.delete(k);
    }
  }
  return hits.length <= max;
}

// Helper: extract a rate-limit key from the request
// Prefer authenticated user ID; fallback to IP
function rlKey(req, user, prefix = "") {
  const id = user?.id ?? req.headers["x-forwarded-for"]?.split(",")[0].trim() ?? "unknown";
  return prefix + id;
}

module.exports = { verifyAuth, setCors, rateLimit, rlKey };

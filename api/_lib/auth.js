/* Shared auth + CORS helpers for Scarniko serverless functions */

const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://fklsetwqfdmangromprj.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrbHNldHdxZmRtYW5ncm9tcHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NjU1NTEsImV4cCI6MjA5NzA0MTU1MX0.RcOvY3R1SDegUJEz3eohOgVF-daDiz-OSnGPh1rCgQ4";

async function verifyAuth(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  const jwt = auth.slice(7);
  try {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${jwt}` },
      signal: AbortSignal.timeout(5000)
    });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

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

module.exports = { verifyAuth, setCors };

/* ============================================================
   SCARNIKO · SAVE VINTED TOKENS
   Accepts { refresh_token } or { access_token, refresh_token }.
   When only refresh_token provided, derives access_token via
   Vinted OAuth automatically.
   ============================================================ */

const { verifyAuth, setCors, rateLimit, rlKey } = require("./_lib/auth");
const { isValidJWT, writeTokensToBlob, refreshVintedToken, jwtExp } = require("./_lib/tokens");

module.exports = async function handler(req, res) {
  setCors(req, res, "POST");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const user = await verifyAuth(req);
  if (!user) return res.status(401).json({ error: "unauthorized" });

  // Rate limit: 10 saves per 10 minutes per user
  if (!rateLimit(rlKey(req, user, "save:"), { max: 10, windowMs: 600_000 })) {
    return res.status(429).json({ error: "too_many_requests" });
  }

  // ── Input validation ────────────────────────────────────────
  const body = req.body ?? {};
  let access_token  = typeof body.access_token  === "string" ? body.access_token.trim()  : null;
  let refresh_token = typeof body.refresh_token === "string" ? body.refresh_token.trim() : null;

  if (access_token  && !isValidJWT(access_token))  return res.status(400).json({ error: "invalid_access_token" });
  if (refresh_token && !isValidJWT(refresh_token)) return res.status(400).json({ error: "invalid_refresh_token" });
  if (!access_token && !refresh_token)              return res.status(400).json({ error: "provide access_token or refresh_token" });

  // ── If only refresh_token: derive access_token via Vinted OAuth ──
  const derived = !access_token;
  if (derived) {
    try {
      const tokens = await refreshVintedToken(refresh_token);
      if (!tokens?.access_token) throw new Error("No access_token in Vinted response");
      access_token  = tokens.access_token;
      refresh_token = tokens.refresh_token || refresh_token;
    } catch (e) {
      return res.status(400).json({ error: "refresh_exchange_failed", detail: e.message });
    }
  }

  if (!isValidJWT(access_token)) return res.status(400).json({ error: "invalid_access_token_from_vinted" });

  // ── Persist (encrypted) ──────────────────────────────────────
  const ok = await writeTokensToBlob(access_token, refresh_token);
  if (!ok) return res.status(500).json({ error: "blob_write_failed" });

  return res.json({ ok: true, derived, expires_at: new Date(jwtExp(access_token) * 1000).toISOString() });
};

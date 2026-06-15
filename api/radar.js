/* ============================================================
   SCARNIKO · VINTED MARKET RADAR
   Token flow:
     1. Read from Supabase vinted_auth (persisted, survives deploys)
     2. If expired → try Vinted /api/v2/tokens refresh endpoint
     3. If refresh ok → write new tokens back to Supabase
     4. Fall back to VINTED_TOKEN env var as last resort
   Cache: 24h at the edge (s-maxage=86400)
   ============================================================ */

const BRANDS = [
  "Zara", "Nike", "Carhartt", "Levi's", "Adidas", "Stradivarius",
  "New Balance", "Bershka", "Bimba y Lola", "Stüssy", "Ralph Lauren",
  "The North Face", "Under Armour", "Polo Sport", "Massimo Dutti",
  "Jordan", "Mango", "Salomon", "Vans", "Petit Bateau", "Desigual", "Tommy Hilfiger"
];

const SUPA_URL = process.env.SUPABASE_URL;
const SUPA_ANON = process.env.SUPABASE_ANON_KEY;
const SUPA_SVC = process.env.SUPABASE_SERVICE_KEY;

function jwtExp(token) {
  try {
    const raw = token.split(".")[1];
    const padded = raw + "=".repeat((4 - (raw.length % 4)) % 4);
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8")).exp ?? 0;
  } catch { return 0; }
}

function isExpired(token) {
  return jwtExp(token) < Date.now() / 1000 + 60; // 60s grace
}

async function readAuthFromSupabase() {
  if (!SUPA_URL || !SUPA_ANON) return null;
  try {
    const r = await fetch(
      `${SUPA_URL}/rest/v1/vinted_auth?id=eq.1&select=access_token,refresh_token,expires_at`,
      { headers: { apikey: SUPA_ANON, Authorization: `Bearer ${SUPA_ANON}` } }
    );
    if (!r.ok) return null;
    const rows = await r.json();
    return rows[0] ?? null;
  } catch { return null; }
}

async function writeAuthToSupabase(access_token, refresh_token) {
  if (!SUPA_URL || !SUPA_SVC) return;
  const exp = jwtExp(access_token);
  const body = JSON.stringify({
    id: 1, access_token, refresh_token,
    expires_at: exp, updated_at: new Date().toISOString()
  });
  await fetch(`${SUPA_URL}/rest/v1/vinted_auth`, {
    method: "POST",
    headers: {
      apikey: SUPA_SVC, Authorization: `Bearer ${SUPA_SVC}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal"
    },
    body
  }).catch(() => {});
}

async function refreshVintedToken(refreshToken) {
  try {
    const r = await fetch("https://www.vinted.es/api/v2/tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
        Accept: "application/json",
        "Accept-Language": "es-ES,es;q=0.9",
        Origin: "https://www.vinted.es",
        Referer: "https://www.vinted.es/"
      },
      body: JSON.stringify({ grant_type: "refresh_token", refresh_token: refreshToken }),
      signal: AbortSignal.timeout(10000)
    });
    if (!r.ok) return null;
    const d = await r.json();
    return d.access_token ? d : null;
  } catch { return null; }
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  // --- Resolve token ---
  let accessToken = null;
  let refreshToken = null;

  const stored = await readAuthFromSupabase();
  if (stored?.access_token) {
    accessToken = stored.access_token;
    refreshToken = stored.refresh_token;
  }
  // Fall back to env var if Supabase empty
  if (!accessToken) {
    accessToken = process.env.VINTED_TOKEN ?? null;
  }

  if (!accessToken) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(500).json({ error: "no_token", message: "No Vinted token found — configure in Scarniko settings" });
  }

  // --- Auto-refresh if expired ---
  if (isExpired(accessToken)) {
    if (refreshToken) {
      const refreshed = await refreshVintedToken(refreshToken);
      if (refreshed) {
        accessToken = refreshed.access_token;
        const newRefresh = refreshed.refresh_token ?? refreshToken;
        await writeAuthToSupabase(accessToken, newRefresh);
      } else {
        // Refresh failed (DataDome or network)
        res.setHeader("Cache-Control", "no-store");
        return res.status(401).json({
          error: "token_expired",
          message: "Token caducado y el refresh automático falló — actualiza el token en Scarniko"
        });
      }
    } else {
      res.setHeader("Cache-Control", "no-store");
      return res.status(401).json({
        error: "token_expired",
        message: "Token caducado — actualiza el token en Scarniko"
      });
    }
  }

  // --- Fetch brand data from Vinted ---
  const vHeaders = {
    Authorization: `Bearer ${accessToken}`,
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "es-ES,es;q=0.9",
    Referer: "https://www.vinted.es/",
    Origin: "https://www.vinted.es"
  };

  async function fetchBrand(name) {
    try {
      const url = `https://www.vinted.es/api/v2/catalog/items?search_text=${encodeURIComponent(name)}&per_page=20&order=relevance`;
      const r = await fetch(url, { headers: vHeaders, signal: AbortSignal.timeout(9000) });
      if (!r.ok) return { name, entries: 0, avgFavs: 0, httpStatus: r.status };
      const d = await r.json();
      const entries = d.pagination?.total_entries ?? 0;
      const items = Array.isArray(d.items) ? d.items : [];
      const avgFavs = items.length > 0
        ? items.reduce((s, i) => s + (i.favourite_count || 0), 0) / items.length
        : 0;
      return { name, entries, avgFavs };
    } catch (e) {
      return { name, entries: 0, avgFavs: 0, fetchError: e.message };
    }
  }

  try {
    const results = await Promise.all(BRANDS.map(fetchBrand));

    const maxEntries = Math.max(...results.map((r) => r.entries), 1);
    const maxFavs = Math.max(...results.map((r) => r.avgFavs), 1);

    const brands = results.map((r) => {
      const entScore = r.entries > 0
        ? (Math.log10(r.entries + 1) / Math.log10(maxEntries + 1)) * 70 : 0;
      const favScore = (r.avgFavs / maxFavs) * 30;
      const demand = Math.round(Math.min(99, Math.max(15, entScore + favScore)));
      const heat = demand >= 85 ? "hot" : demand >= 65 ? "rising" : demand >= 45 ? "warm" : "cool";
      return { name: r.name, demand, heat, entries: r.entries, avgFavs: Math.round(r.avgFavs * 10) / 10 };
    });

    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=3600");
    return res.json({ brands, updatedAt: new Date().toISOString(), source: "vinted_live" });
  } catch (e) {
    return res.status(500).json({ error: "internal", message: e.message });
  }
};

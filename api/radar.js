/* ============================================================
   SCARNIKO · VINTED MARKET RADAR
   Token storage: Vercel Blob (vinted-auth.json)
   Flow: auth check → read blob → refresh if expired → write blob → query Vinted
   Cache: 24h at the edge (s-maxage=86400)
   ============================================================ */

const { verifyAuth, setCors } = require("./_lib/auth");

const BRANDS = [
  "Zara", "Nike", "Carhartt", "Levi's", "Adidas", "Stradivarius",
  "New Balance", "Bershka", "Bimba y Lola", "Stüssy", "Ralph Lauren",
  "The North Face", "Under Armour", "Polo Sport", "Massimo Dutti",
  "Jordan", "Mango", "Salomon", "Vans", "Petit Bateau", "Desigual", "Tommy Hilfiger"
];

function jwtExp(token) {
  try {
    const raw = token.split(".")[1];
    const padded = raw + "=".repeat((4 - (raw.length % 4)) % 4);
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8")).exp ?? 0;
  } catch { return 0; }
}

function isExpired(token) {
  return jwtExp(token) < Date.now() / 1000 + 60;
}

async function readTokensFromBlob() {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) return null;
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "vinted-auth.json", token: blobToken });
    if (!blobs.length) return null;
    const res = await fetch(blobs[0].downloadUrl);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function writeTokensToBlob(accessToken, refreshToken) {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) return;
  try {
    const { put } = await import("@vercel/blob");
    await put("vinted-auth.json", JSON.stringify({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: jwtExp(accessToken),
      updated_at: new Date().toISOString()
    }), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      token: blobToken,
      allowOverwrite: true
    });
  } catch { /* non-fatal */ }
}

async function readHistory() {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) return [];
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "radar-history.json", token: blobToken });
    if (!blobs.length) return [];
    const res = await fetch(blobs[0].downloadUrl);
    if (!res.ok) return [];
    const d = await res.json();
    return Array.isArray(d) ? d : [];
  } catch { return []; }
}

async function writeHistory(snapshots) {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) return;
  try {
    const { put } = await import("@vercel/blob");
    await put("radar-history.json", JSON.stringify(snapshots), {
      access: "private", contentType: "application/json",
      addRandomSuffix: false, token: blobToken, allowOverwrite: true
    });
  } catch { }
}

async function refreshVintedToken(refreshToken) {
  try {
    const r = await fetch("https://www.vinted.es/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
        Accept: "application/json",
        "Accept-Language": "es-ES,es;q=0.9",
        Origin: "https://www.vinted.es",
        Referer: "https://www.vinted.es/"
      },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: "web",
        scope: "user"
      }),
      signal: AbortSignal.timeout(10000)
    });
    if (!r.ok) return null;
    const d = await r.json();
    return d.access_token ? d : null;
  } catch { return null; }
}

module.exports = async function handler(req, res) {
  setCors(req, res, "GET");
  if (req.method === "OPTIONS") return res.status(200).end();

  const user = await verifyAuth(req);
  if (!user) return res.status(401).json({ error: "unauthorized" });

  // --- Resolve token (blob → env var fallback → auto-bootstrap) ---
  let accessToken = null;
  let refreshToken = null;

  const stored = await readTokensFromBlob();
  if (stored?.access_token) {
    accessToken = stored.access_token;
    refreshToken = stored.refresh_token;
  } else {
    // Bootstrap: first-time setup from env vars — write them to blob so future calls use blob
    accessToken = process.env.VINTED_TOKEN ?? null;
    refreshToken = process.env.VINTED_REFRESH_TOKEN ?? null;
    if (accessToken && refreshToken) {
      await writeTokensToBlob(accessToken, refreshToken);
    }
  }

  if (!accessToken) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(500).json({ error: "no_token", message: "No Vinted token — configure in Scarniko settings" });
  }

  // --- Auto-refresh if expired ---
  if (isExpired(accessToken)) {
    if (refreshToken) {
      const refreshed = await refreshVintedToken(refreshToken);
      if (refreshed) {
        accessToken = refreshed.access_token;
        const newRefresh = refreshed.refresh_token ?? refreshToken;
        await writeTokensToBlob(accessToken, newRefresh);
      } else {
        res.setHeader("Cache-Control", "no-store");
        return res.status(401).json({
          error: "token_expired",
          message: "Token caducado — actualiza el token en Scarniko"
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

  // --- Fetch brand data ---
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
        ? items.reduce((s, i) => s + (i.favourite_count || 0), 0) / items.length : 0;
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

    // ── History: compute real 7-day trends & save daily snapshot ──
    const history = await readHistory();
    const today = new Date().toISOString().split("T")[0];
    const snap7 = history.length > 0 ? history[Math.max(0, history.length - 7)] : null;
    if (snap7) {
      brands.forEach(b => {
        const prev = snap7.brands.find(s => s.name === b.name);
        if (prev && prev.demand > 0) {
          b.trend = Math.round(((b.demand - prev.demand) / prev.demand) * 100 * 10) / 10;
        }
      });
    }
    if (!history.some(s => s.date === today)) {
      const updated = [...history, { date: today, brands: brands.map(b => ({ name: b.name, demand: b.demand })) }].slice(-30);
      await writeHistory(updated);
      history.push({ date: today, brands: brands.map(b => ({ name: b.name, demand: b.demand })) });
    }

    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=3600");
    return res.json({ brands, history: history.slice(-14), updatedAt: new Date().toISOString(), source: "vinted_live" });
  } catch (e) {
    return res.status(500).json({ error: "internal", message: e.message });
  }
};

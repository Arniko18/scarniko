/* ============================================================
   SCARNIKO · VINTED MARKET RADAR
   Cache: 24h at the edge (s-maxage=86400)
   ============================================================ */

const { verifyAuth, setCors, rateLimit, rlKey } = require("./_lib/auth");
const { resolveVintedTokens, readHistory, writeHistory } = require("./_lib/tokens");

const BRANDS = [
  "Zara", "Nike", "Carhartt", "Levi's", "Adidas", "Stradivarius",
  "New Balance", "Bershka", "Bimba y Lola", "Stüssy", "Ralph Lauren",
  "The North Face", "Under Armour", "Polo Sport", "Massimo Dutti",
  "Jordan", "Mango", "Salomon", "Vans", "Petit Bateau", "Desigual", "Tommy Hilfiger"
];

module.exports = async function handler(req, res) {
  setCors(req, res, "GET");
  if (req.method === "OPTIONS") return res.status(200).end();

  const user = await verifyAuth(req);
  if (!user) return res.status(401).json({ error: "unauthorized" });

  // Rate limit: 30 per minute per user
  if (!rateLimit(rlKey(req, user, "radar:"), { max: 30, windowMs: 60_000 })) {
    return res.status(429).json({ error: "too_many_requests" });
  }

  const tokens = await resolveVintedTokens();
  if (!tokens) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(401).json({ error: "token_expired", message: "Token caducado — actualiza el token en Scarniko" });
  }

  const vHeaders = {
    Authorization: `Bearer ${tokens.accessToken}`,
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
    const maxEntries = Math.max(...results.map(r => r.entries), 1);
    const maxFavs    = Math.max(...results.map(r => r.avgFavs), 1);

    const brands = results.map(r => {
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

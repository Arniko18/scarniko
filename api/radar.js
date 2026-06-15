/* ============================================================
   SCARNIKO · VINTED MARKET RADAR
   Serverless proxy — queries Vinted API for real demand data
   Cache: 24h at the edge (s-maxage=86400)
   ============================================================ */

const BRANDS = [
  "Zara", "Nike", "Carhartt", "Levi's", "Adidas", "Stradivarius",
  "New Balance", "Bershka", "Bimba y Lola", "Stüssy", "Ralph Lauren",
  "The North Face", "Under Armour", "Polo Sport", "Massimo Dutti",
  "Jordan", "Mango", "Salomon", "Vans", "Petit Bateau", "Desigual", "Tommy Hilfiger"
];

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const token = process.env.VINTED_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "no_token", message: "VINTED_TOKEN env var not set" });
  }

  // Decode JWT payload to check expiry (no library needed — base64url decode)
  try {
    const raw = token.split(".")[1];
    const padded = raw + "=".repeat((4 - (raw.length % 4)) % 4);
    const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
    if (payload.exp && payload.exp < Date.now() / 1000) {
      res.setHeader("Cache-Control", "no-store");
      return res.status(401).json({
        error: "token_expired",
        expiredAt: new Date(payload.exp * 1000).toISOString(),
        message: "Vinted token expired — update VINTED_TOKEN in Vercel"
      });
    }
  } catch (_) {}

  const vHeaders = {
    Authorization: `Bearer ${token}`,
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "es-ES,es;q=0.9",
    Referer: "https://www.vinted.es/",
    Origin: "https://www.vinted.es",
  };

  async function fetchBrand(name) {
    try {
      const url = `https://www.vinted.es/api/v2/catalog/items?search_text=${encodeURIComponent(name)}&per_page=20&order=relevance`;
      const r = await fetch(url, {
        headers: vHeaders,
        signal: AbortSignal.timeout(9000),
      });
      if (!r.ok) return { name, entries: 0, avgFavs: 0, httpStatus: r.status };
      const d = await r.json();
      const entries = d.pagination?.total_entries ?? 0;
      const items = Array.isArray(d.items) ? d.items : [];
      const avgFavs =
        items.length > 0
          ? items.reduce((s, i) => s + (i.favourite_count || 0), 0) / items.length
          : 0;
      return { name, entries, avgFavs };
    } catch (e) {
      return { name, entries: 0, avgFavs: 0, fetchError: e.message };
    }
  }

  try {
    const results = await Promise.all(BRANDS.map(fetchBrand));

    // Normalize demand 0–99 using log scale for entries (70%) + avg favs (30%)
    const maxEntries = Math.max(...results.map((r) => r.entries), 1);
    const maxFavs = Math.max(...results.map((r) => r.avgFavs), 1);

    const brands = results.map((r) => {
      const entScore =
        r.entries > 0
          ? (Math.log10(r.entries + 1) / Math.log10(maxEntries + 1)) * 70
          : 0;
      const favScore = (r.avgFavs / maxFavs) * 30;
      const raw = entScore + favScore;
      const demand = Math.round(Math.min(99, Math.max(15, raw)));
      const heat =
        demand >= 85 ? "hot" : demand >= 65 ? "rising" : demand >= 45 ? "warm" : "cool";
      return {
        name: r.name,
        demand,
        heat,
        entries: r.entries,
        avgFavs: Math.round(r.avgFavs * 10) / 10,
      };
    });

    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=3600");
    return res.json({ brands, updatedAt: new Date().toISOString(), source: "vinted_live" });
  } catch (e) {
    return res.status(500).json({ error: "internal", message: e.message });
  }
};

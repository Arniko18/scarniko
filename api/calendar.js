/* ============================================================
   SCARNIKO · VINTED CALENDAR — Real-time activity heatmap
   Fetches ~240 recent listings across categories, extracts
   timestamps, and maps platform activity to a 7-day × 17-hour
   grid (Spain timezone). Blends with algorithmic baseline when
   sample is small.
   Cache: 6h at the edge (s-maxage=21600)
   ============================================================ */

const { verifyAuth, setCors } = require("./_lib/auth");

// Four parallel queries → wide time window, diverse items
const QUERIES = [
  { q: "",          per: 96 },   // general catalog — broadest signal
  { q: "Nike",      per: 48 },   // sneakers
  { q: "Zara",      per: 48 },   // fast fashion
  { q: "Carhartt",  per: 48 },   // streetwear
];

// ── JWT / token helpers ──────────────────────────────────────
function jwtExp(token) {
  try {
    const raw = token.split(".")[1];
    const p = raw + "=".repeat((4 - raw.length % 4) % 4);
    return JSON.parse(Buffer.from(p, "base64").toString("utf8")).exp ?? 0;
  } catch { return 0; }
}
function isExpired(t) { return jwtExp(t) < Date.now() / 1000 + 60; }

async function readTokensFromBlob() {
  const bt = process.env.BLOB_READ_WRITE_TOKEN;
  if (!bt) return null;
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "vinted-auth.json", token: bt });
    if (!blobs.length) return null;
    const r = await fetch(blobs[0].downloadUrl);
    return r.ok ? r.json() : null;
  } catch { return null; }
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
      body: JSON.stringify({ grant_type: "refresh_token", refresh_token: refreshToken, client_id: "web", scope: "user" }),
      signal: AbortSignal.timeout(10000)
    });
    if (!r.ok) return null;
    const d = await r.json();
    return d.access_token ? d : null;
  } catch { return null; }
}

// ── Fetch items from Vinted ──────────────────────────────────
async function fetchItems(query, perPage, vHeaders) {
  try {
    const url = query
      ? `https://www.vinted.es/api/v2/catalog/items?search_text=${encodeURIComponent(query)}&per_page=${perPage}&order=newest_first`
      : `https://www.vinted.es/api/v2/catalog/items?per_page=${perPage}&order=newest_first`;
    const r = await fetch(url, { headers: vHeaders, signal: AbortSignal.timeout(10000) });
    if (!r.ok) return [];
    const d = await r.json();
    return Array.isArray(d.items) ? d.items : [];
  } catch { return []; }
}

// ── Spain local hour from Unix timestamp (CET/CEST) ──────────
function spainTime(ts) {
  const d = new Date(ts * 1000);
  const yr = d.getUTCFullYear();
  // Last Sunday of March (CET→CEST) and October (CEST→CET)
  function lastSunday(yr, mo) {
    const last = new Date(Date.UTC(yr, mo + 1, 0)); // last day of month
    last.setUTCDate(last.getUTCDate() - last.getUTCDay()); // back to Sunday
    return last.getTime() / 1000;
  }
  const summerStart = lastSunday(yr, 2); // last Sun March
  const summerEnd   = lastSunday(yr, 9); // last Sun October
  const offset = (ts >= summerStart && ts < summerEnd) ? 2 : 1;
  const localH = (d.getUTCHours() + offset) % 24;
  const utcDay = d.getUTCDay(); // 0=Sun
  const day = utcDay === 0 ? 6 : utcDay - 1; // 0=Mon … 6=Sun
  return { hour: localH, day };
}

// ── Normalise a raw timestamp value to Unix seconds ──────────
// Vinted may return seconds (10-digit) or milliseconds (13-digit)
function toUnixSec(v) {
  if (!v || typeof v !== "number" || v <= 0) return null;
  return v > 1e12 ? Math.floor(v / 1000) : v; // ms → s if 13+ digits
}

// ── Extract best timestamp from a Vinted item ────────────────
function itemTs(it) {
  // Try all known Vinted timestamp fields
  return (
    toUnixSec(it.created_at_ts) ??
    toUnixSec(it.updated_at_ts) ??
    toUnixSec(it.bumped_at_ts) ??
    (typeof it.created_at === "number" ? toUnixSec(it.created_at) : null) ??
    (it.created_at ? Math.floor(new Date(it.created_at).getTime() / 1000) : null) ??
    (it.updated_at ? Math.floor(new Date(it.updated_at).getTime() / 1000) : null) ??
    toUnixSec(it.photo?.timestamp) ??
    null
  );
}

// ── Build 7×17 heatmap from item list ───────────────────────
function buildLiveMatrix(items) {
  const HOUR_START = 7, HOURS = 17, DAYS = 7;
  const raw = Array.from({ length: DAYS }, () => Array(HOURS).fill(0));
  const now = Date.now() / 1000;
  let valid = 0;

  // Diagnostic: capture what fields the first item has
  const firstItemKeys = items[0] ? Object.keys(items[0]).filter(k =>
    k.includes("at") || k.includes("ts") || k.includes("time") || k.includes("date")
  ) : [];

  for (const it of items) {
    const ts = itemTs(it);
    if (!ts || ts > now + 120 || ts < now - 14 * 86400) continue;

    const { hour, day } = spainTime(ts);
    if (hour < HOUR_START || hour >= HOUR_START + HOURS) continue;
    raw[day][hour - HOUR_START]++;
    valid++;
  }

  const maxV = Math.max(1, ...raw.flat());
  return {
    matrix: raw.map(row => row.map(v => Math.round((v / maxV) * 100))),
    sampleSize: valid,
    diagnosticFields: firstItemKeys
  };
}

// ── Algorithmic baseline (mirrors data.js buildHeatMatrix) ───
function buildAlgoMatrix() {
  const m = [];
  for (let d = 0; d < 7; d++) {
    const row = [];
    const isWeekend = d >= 5, isSunday = d === 6;
    for (let h = 0; h < 17; h++) {
      const hr = h + 7;
      let s = 8;
      if (hr >= 7  && hr <= 9)  s += isWeekend ? 14 : 30;
      if (hr >= 12 && hr <= 14) s += isWeekend ? 30 : 22;
      if (hr >= 16 && hr <= 18) s += 26;
      if (hr >= 20 && hr <= 22) s += 52;
      if (hr === 23) s += 22;
      if (isSunday && hr >= 20 && hr <= 22) s += 24;
      if (d === 5   && hr >= 10 && hr <= 12) s += 16;
      s += Math.sin(d * 2.7 + hr * 1.3) * 4;
      row.push(Math.max(0, Math.min(100, Math.round(s))));
    }
    m.push(row);
  }
  return m;
}

function blend(live, algo, w) {
  return live.map((row, d) => row.map((v, h) => Math.round(v * w + algo[d][h] * (1 - w))));
}

// ── Handler ──────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  setCors(req, res, "GET");
  if (req.method === "OPTIONS") return res.status(200).end();

  const user = await verifyAuth(req);
  if (!user) return res.status(401).json({ error: "unauthorized" });

  // Resolve token
  let accessToken = null, refreshToken = null;
  const stored = await readTokensFromBlob();
  if (stored?.access_token) {
    accessToken = stored.access_token;
    refreshToken = stored.refresh_token;
  } else {
    accessToken = process.env.VINTED_TOKEN ?? null;
    refreshToken = process.env.VINTED_REFRESH_TOKEN ?? null;
  }

  if (!accessToken) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(500).json({ error: "no_token" });
  }

  if (isExpired(accessToken) && refreshToken) {
    const refreshed = await refreshVintedToken(refreshToken);
    if (refreshed) accessToken = refreshed.access_token;
    else {
      res.setHeader("Cache-Control", "no-store");
      return res.status(401).json({ error: "token_expired" });
    }
  }

  const vHeaders = {
    Authorization: `Bearer ${accessToken}`,
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "es-ES,es;q=0.9",
    Referer: "https://www.vinted.es/",
    Origin: "https://www.vinted.es"
  };

  try {
    const results = await Promise.all(
      QUERIES.map(({ q, per }) => fetchItems(q, per, vHeaders))
    );
    const allItems = results.flat();

    const { matrix: liveMatrix, sampleSize, diagnosticFields } = buildLiveMatrix(allItems);
    const algoMatrix = buildAlgoMatrix();

    // Blend weight: 70% live when ≥50 samples, 40% at 20-49, pure algo below 20
    const liveWeight = sampleSize >= 50 ? 0.70 : sampleSize >= 20 ? 0.40 : 0;
    const finalMatrix = liveWeight > 0 ? blend(liveMatrix, algoMatrix, liveWeight) : algoMatrix;

    // Short cache while debugging; revert to 21600 once confirmed working
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
    return res.json({
      matrix: finalMatrix,
      sampleSize,
      liveWeight,
      updatedAt: new Date().toISOString(),
      source: sampleSize >= 20 ? "vinted_live" : "algorithmic",
      itemsTotal: allItems.length,
      diagnosticFields
    });
  } catch (e) {
    return res.status(500).json({ error: "internal", message: e.message });
  }
};

/* ============================================================
   SCARNIKO · SAVE VINTED TOKENS
   Accepts either { access_token, refresh_token } or just
   { refresh_token } — in the latter case it calls Vinted OAuth
   to derive a fresh access_token automatically.
   ============================================================ */

const { verifyAuth, setCors } = require("./_lib/auth");

function jwtExp(token) {
  try {
    const raw = token.split(".")[1];
    const padded = raw + "=".repeat((4 - (raw.length % 4)) % 4);
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8")).exp ?? 0;
  } catch { return 0; }
}

async function exchangeRefreshToken(refreshToken) {
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
    signal: AbortSignal.timeout(12000)
  });
  if (!r.ok) throw new Error(`Vinted OAuth ${r.status}`);
  const d = await r.json();
  if (!d.access_token) throw new Error("No access_token in Vinted response");
  return d;
}

module.exports = async function handler(req, res) {
  setCors(req, res, "POST");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const user = await verifyAuth(req);
  if (!user) return res.status(401).json({ error: "unauthorized" });

  let { access_token, refresh_token } = req.body ?? {};

  // If only refresh_token provided, derive access_token via Vinted OAuth
  if (!access_token && refresh_token?.startsWith("eyJ")) {
    try {
      const tokens = await exchangeRefreshToken(refresh_token);
      access_token = tokens.access_token;
      // Use the rotated refresh_token Vinted returns (may differ from input)
      refresh_token = tokens.refresh_token || refresh_token;
    } catch (e) {
      return res.status(400).json({ error: "refresh_exchange_failed", detail: e.message });
    }
  }

  if (!access_token?.startsWith("eyJ")) {
    return res.status(400).json({ error: "invalid_token — provide access_token or a valid refresh_token" });
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) return res.status(500).json({ error: "BLOB_READ_WRITE_TOKEN not set" });

  try {
    const { put } = await import("@vercel/blob");
    await put("vinted-auth.json", JSON.stringify({
      access_token,
      refresh_token: refresh_token || null,
      expires_at: jwtExp(access_token),
      updated_at: new Date().toISOString()
    }), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      token: blobToken,
      allowOverwrite: true
    });

    return res.json({ ok: true, derived: !req.body?.access_token });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

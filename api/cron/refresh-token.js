/* ============================================================
   SCARNIKO · CRON: VINTED TOKEN ROTATION
   Called daily by Vercel Cron at 06:00 UTC.
   Reads the current refresh_token from Blob, exchanges it for
   a fresh access_token + rotated refresh_token via Vinted OAuth,
   then saves both back to Blob.
   This keeps the session alive indefinitely.
   ============================================================ */

module.exports = async function handler(req, res) {
  // Vercel Cron passes Authorization: Bearer <CRON_SECRET>
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "unauthorized" });
    }
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) return res.status(500).json({ error: "BLOB_READ_WRITE_TOKEN not set" });

  try {
    // 1. Read current tokens from Blob
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "vinted-auth.json", token: blobToken });
    if (!blobs.length) return res.status(404).json({ error: "no tokens in blob — paste tokens in the app first" });

    const stored = await fetch(blobs[0].downloadUrl).then(r => r.json());
    const refreshToken = stored?.refresh_token;
    if (!refreshToken) return res.status(400).json({ error: "no refresh_token stored" });

    // 2. Exchange refresh_token for new access_token + rotated refresh_token
    const oauthRes = await fetch("https://www.vinted.es/oauth/token", {
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

    if (!oauthRes.ok) {
      const err = await oauthRes.text();
      return res.status(502).json({ error: `Vinted OAuth ${oauthRes.status}`, detail: err.slice(0, 200) });
    }

    const tokens = await oauthRes.json();
    if (!tokens.access_token) return res.status(502).json({ error: "no access_token in Vinted response" });

    // 3. Save rotated tokens back to Blob
    function jwtExp(t) {
      try {
        const raw = t.split(".")[1];
        const p = raw + "=".repeat((4 - raw.length % 4) % 4);
        return JSON.parse(Buffer.from(p, "base64").toString("utf8")).exp ?? 0;
      } catch { return 0; }
    }

    const { put } = await import("@vercel/blob");
    await put("vinted-auth.json", JSON.stringify({
      access_token:  tokens.access_token,
      refresh_token: tokens.refresh_token || refreshToken,
      expires_at:    jwtExp(tokens.access_token),
      updated_at:    new Date().toISOString()
    }), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      token: blobToken,
      allowOverwrite: true
    });

    return res.json({
      ok: true,
      rotated: !!tokens.refresh_token,
      expires_at: new Date(jwtExp(tokens.access_token) * 1000).toISOString()
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

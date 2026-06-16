/* ============================================================
   SCARNIKO · CRON: VINTED TOKEN ROTATION
   Called daily by Vercel Cron at 06:00 UTC.
   Reads refresh_token from Blob, exchanges for fresh tokens,
   saves encrypted result back to Blob.
   ============================================================ */

const { readTokensFromBlob, writeTokensToBlob, refreshVintedToken, jwtExp } = require("../_lib/tokens");

module.exports = async function handler(req, res) {
  // Verify Vercel Cron secret (optional but recommended)
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "unauthorized" });
  }

  try {
    const stored = await readTokensFromBlob();
    if (!stored?.refresh_token) {
      return res.status(404).json({ error: "no_refresh_token — paste tokens in the app first" });
    }

    const tokens = await refreshVintedToken(stored.refresh_token);
    if (!tokens?.access_token) {
      return res.status(502).json({ error: "vinted_oauth_failed — refresh token may be expired" });
    }

    const newRefresh = tokens.refresh_token || stored.refresh_token;
    await writeTokensToBlob(tokens.access_token, newRefresh);

    return res.json({
      ok: true,
      rotated: !!tokens.refresh_token,
      expires_at: new Date(jwtExp(tokens.access_token) * 1000).toISOString()
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

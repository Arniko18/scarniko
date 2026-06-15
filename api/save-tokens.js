/* ============================================================
   SCARNIKO · SAVE VINTED TOKENS
   Called from the in-app token update UI.
   Writes access_token + refresh_token to Vercel Blob.
   ============================================================ */

function jwtExp(token) {
  try {
    const raw = token.split(".")[1];
    const padded = raw + "=".repeat((4 - (raw.length % 4)) % 4);
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8")).exp ?? 0;
  } catch { return 0; }
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { access_token, refresh_token } = req.body ?? {};
  if (!access_token) {
    return res.status(400).json({ error: "access_token required" });
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) {
    return res.status(500).json({ error: "BLOB_READ_WRITE_TOKEN not set" });
  }

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

    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

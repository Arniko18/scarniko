/* ============================================================
   SCARNIKO · SAVE VINTED TOKENS
   Called from the in-app token update UI.
   Writes access_token + refresh_token to Vercel Blob.
   ============================================================ */

const { verifyAuth, setCors } = require("./_lib/auth");

function jwtExp(token) {
  try {
    const raw = token.split(".")[1];
    const padded = raw + "=".repeat((4 - (raw.length % 4)) % 4);
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8")).exp ?? 0;
  } catch { return 0; }
}

module.exports = async function handler(req, res) {
  setCors(req, res, "POST");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const user = await verifyAuth(req);
  if (!user) return res.status(401).json({ error: "unauthorized" });

  const { access_token, refresh_token } = req.body ?? {};
  if (!access_token || !access_token.startsWith("eyJ")) {
    return res.status(400).json({ error: "invalid access_token" });
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

/* ============================================================
   SCARNIKO · TOKEN LIB
   Centralised Vinted token management:
   - AES-256-GCM encryption of Blob content
   - Read / write tokens to Vercel Blob
   - Vinted OAuth refresh
   - resolveVintedTokens() — single call for any API handler
   ============================================================ */

const crypto = require("crypto");

// ── JWT helpers ──────────────────────────────────────────────
function jwtExp(token) {
  try {
    const raw = token.split(".")[1];
    const p = raw + "=".repeat((4 - raw.length % 4) % 4);
    return JSON.parse(Buffer.from(p, "base64").toString("utf8")).exp ?? 0;
  } catch { return 0; }
}
function isExpired(token) { return jwtExp(token) < Date.now() / 1000 + 60; }

// ── Input validation ─────────────────────────────────────────
// A JWT is exactly 3 base64url segments separated by dots, max 4 KB
function isValidJWT(str) {
  if (!str || typeof str !== "string") return false;
  if (str.length > 4096) return false;
  const parts = str.split(".");
  return parts.length === 3 && parts.every(p => /^[A-Za-z0-9_-]+$/.test(p) && p.length > 0);
}

// ── AES-256-GCM encryption ───────────────────────────────────
// TOKEN_ENCRYPTION_KEY env var: 64-char hex string (32 bytes)
function _key() {
  const k = process.env.TOKEN_ENCRYPTION_KEY;
  if (!k || k.length !== 64) return null;
  try { return Buffer.from(k, "hex"); } catch { return null; }
}

function encrypt(plaintext) {
  const key = _key();
  if (!key) return plaintext; // no key → store as-is (bootstrap mode)
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // Prefix "enc:" so readers can detect encrypted vs legacy plaintext
  return "enc:" + Buffer.concat([iv, tag, enc]).toString("base64");
}

function decrypt(data) {
  if (typeof data !== "string") return data;
  if (!data.startsWith("enc:")) return data; // plaintext / legacy
  const key = _key();
  if (!key) return "{}"; // can't decrypt without key
  try {
    const buf = Buffer.from(data.slice(4), "base64");
    const iv  = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const enc = buf.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
  } catch { return "{}"; }
}

// ── Blob: read tokens ────────────────────────────────────────
async function readTokensFromBlob() {
  const bt = process.env.BLOB_READ_WRITE_TOKEN;
  if (!bt) return null;
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "vinted-auth.json", token: bt });
    if (!blobs.length) return null;
    const res = await fetch(blobs[0].downloadUrl);
    if (!res.ok) return null;
    const raw = await res.text();
    return JSON.parse(decrypt(raw));
  } catch { return null; }
}

// ── Blob: write tokens (encrypted) ───────────────────────────
async function writeTokensToBlob(accessToken, refreshToken) {
  const bt = process.env.BLOB_READ_WRITE_TOKEN;
  if (!bt) return false;
  try {
    const payload = encrypt(JSON.stringify({
      access_token:  accessToken,
      refresh_token: refreshToken || null,
      expires_at:    jwtExp(accessToken),
      updated_at:    new Date().toISOString()
    }));
    const { put } = await import("@vercel/blob");
    await put("vinted-auth.json", payload, {
      access: "public",
      contentType: "application/octet-stream", // hide content type
      addRandomSuffix: false,
      token: bt,
      allowOverwrite: true
    });
    return true;
  } catch { return false; }
}

// ── Vinted OAuth refresh ─────────────────────────────────────
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

// ── Resolve: read → refresh if needed → return valid token ───
// Returns { accessToken, refreshToken } or null
async function resolveVintedTokens() {
  let accessToken = null, refreshToken = null;

  const stored = await readTokensFromBlob();
  if (stored?.access_token) {
    accessToken  = stored.access_token;
    refreshToken = stored.refresh_token;
  } else {
    // First-time bootstrap from env vars
    accessToken  = process.env.VINTED_TOKEN ?? null;
    refreshToken = process.env.VINTED_REFRESH_TOKEN ?? null;
    if (accessToken && refreshToken) {
      await writeTokensToBlob(accessToken, refreshToken);
    }
  }

  if (!accessToken) return null;

  if (isExpired(accessToken)) {
    if (!refreshToken) return null;
    const refreshed = await refreshVintedToken(refreshToken);
    if (!refreshed) return null;
    accessToken  = refreshed.access_token;
    refreshToken = refreshed.refresh_token ?? refreshToken;
    await writeTokensToBlob(accessToken, refreshToken);
  }

  return { accessToken, refreshToken };
}

// ── Blob: radar history (unencrypted — not sensitive) ────────
async function readHistory() {
  const bt = process.env.BLOB_READ_WRITE_TOKEN;
  if (!bt) return [];
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "radar-history.json", token: bt });
    if (!blobs.length) return [];
    const res = await fetch(blobs[0].downloadUrl);
    if (!res.ok) return [];
    const d = await res.json();
    return Array.isArray(d) ? d : [];
  } catch { return []; }
}

async function writeHistory(snapshots) {
  const bt = process.env.BLOB_READ_WRITE_TOKEN;
  if (!bt) return;
  try {
    const { put } = await import("@vercel/blob");
    await put("radar-history.json", JSON.stringify(snapshots), {
      access: "public", contentType: "application/json",
      addRandomSuffix: false, token: bt, allowOverwrite: true
    });
  } catch { }
}

module.exports = {
  jwtExp, isExpired, isValidJWT,
  readTokensFromBlob, writeTokensToBlob,
  refreshVintedToken, resolveVintedTokens,
  readHistory, writeHistory
};

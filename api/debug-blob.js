/* TEMP DEBUG — remove after diagnosis */
const { verifyAuth, setCors } = require("./_lib/auth");

module.exports = async function handler(req, res) {
  setCors(req, res, "GET");
  // TEMP: no auth for diagnosis — remove this file after

  const bt = process.env.BLOB_READ_WRITE_TOKEN;
  const result = { bt_prefix: bt ? bt.slice(0, 30) : "NOT_SET", steps: [] };

  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({});
    result.steps.push({ list: "ok", count: blobs.length, blobs: blobs.map(b => ({ url: b.url, pathname: b.pathname })) });
  } catch (e) {
    result.steps.push({ list: "error", msg: e.message });
  }

  try {
    const { get } = await import("@vercel/blob");
    const r = await get("vinted-auth.json", { access: "private" });
    let raw = null;
    try {
      raw = await new Response(r.stream).text();
    } catch (se) {
      result.steps.push({ stream_read: "error", msg: se.message });
    }
    const startsWithEnc = raw?.startsWith("enc:");
    const preview = raw ? raw.slice(0, 60) : null;
    result.steps.push({ get: "ok", statusCode: r.statusCode, raw_preview: preview, encrypted: startsWithEnc });

    if (raw) {
      try {
        const parsed = JSON.parse(raw.startsWith("enc:") ? "{}" : raw);
        result.steps.push({ parse: "ok", has_access_token: !!parsed.access_token, has_refresh_token: !!parsed.refresh_token });

        // Check if access_token is expired
        const { jwtExp, isExpired, refreshVintedToken } = require("./_lib/tokens");
        const exp = jwtExp(parsed.access_token || "");
        const expired = isExpired(parsed.access_token || "");
        result.steps.push({ expiry_check: { exp, expired, now: Math.floor(Date.now() / 1000) } });

        if (expired && parsed.refresh_token) {
          try {
            const refreshed = await refreshVintedToken(parsed.refresh_token);
            result.steps.push({ refresh_attempt: refreshed ? "ok" : "returned_null" });
          } catch (re) {
            result.steps.push({ refresh_attempt: "error", msg: re.message });
          }
        }
      } catch (pe) {
        result.steps.push({ parse: "error", msg: pe.message });
      }
    }
  } catch (e) {
    result.steps.push({ get: "error", msg: e.message, name: e.constructor?.name });
  }

  // Call the full resolveVintedTokens() to see what production actually gets
  try {
    const { resolveVintedTokens } = require("./_lib/tokens");
    const resolved = await resolveVintedTokens();
    result.steps.push({ resolveVintedTokens: resolved ? { ok: true, has_access: !!resolved.accessToken } : "null" });
  } catch (re) {
    result.steps.push({ resolveVintedTokens: "error", msg: re.message });
  }

  return res.json(result);
};

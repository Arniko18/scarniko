/* TEMP DEBUG — remove after diagnosis */
const { verifyAuth, setCors } = require("./_lib/auth");

module.exports = async function handler(req, res) {
  setCors(req, res, "GET");
  const user = await verifyAuth(req);
  if (!user) return res.status(401).json({ error: "unauthorized" });

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
    result.steps.push({ get: "ok", statusCode: r.statusCode });
  } catch (e) {
    result.steps.push({ get: "error", msg: e.message, name: e.constructor?.name });
  }

  return res.json(result);
};

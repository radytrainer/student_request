// Vercel serverless function: forwards a payment screenshot to the Telegram group.
// The bot token stays on the server (env vars TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)
// instead of being shipped to every visitor's browser.
//
// The browser POSTs multipart/form-data with `photo` and `caption`; we stream it
// to Telegram's sendPhoto as-is and pass chat_id in the query string.

const MAX_BYTES = 4 * 1024 * 1024; // Vercel's request body limit is 4.5 MB

const send = (res, status, body) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BYTES) {
        reject(Object.assign(new Error("too large"), { status: 413 }));
        req.destroy();
      } else chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { ok: false, error: "Method not allowed" });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return send(res, 500, { ok: false, error: "Payment upload is not configured" });

  const type = req.headers["content-type"] || "";
  if (!type.startsWith("multipart/form-data")) return send(res, 400, { ok: false, error: "Expected form data" });

  try {
    const body = await readBody(req);
    const tg = await fetch(
      `https://api.telegram.org/bot${token}/sendPhoto?chat_id=${encodeURIComponent(chatId)}`,
      { method: "POST", headers: { "Content-Type": type }, body },
    );
    const data = await tg.json().catch(() => ({}));
    if (!tg.ok || !data.ok) {
      console.error("Telegram error", tg.status, data.description);
      return send(res, 502, { ok: false, error: "Could not deliver the screenshot" });
    }
    return send(res, 200, { ok: true });
  } catch (err) {
    if (err.status === 413) return send(res, 413, { ok: false, error: "Image is too large (max 4 MB)" });
    console.error(err);
    return send(res, 500, { ok: false, error: "Upload failed" });
  }
}

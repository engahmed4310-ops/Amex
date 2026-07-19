// api/claude.js
// Serverless function (runs on Vercel, not in the browser) that holds the
// real Anthropic API key and forwards requests to it. The frontend calls
// this same-origin endpoint instead of api.anthropic.com directly, since
// browser calls straight to Anthropic have no way to attach a real key
// and get rejected.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set in Vercel environment variables." });
  }

  try {
    const { model = "claude-sonnet-4-6", max_tokens = 2000, messages } = req.body;
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model, max_tokens, messages }),
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

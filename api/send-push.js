// api/send-push.js
// Serverless function that sends a real push notification to a person's
// subscribed devices. Holds the VAPID private key server-side.

import webpush from "web-push";

const SUPABASE_URL = "https://xnkzlelbhaezkzufonjt.supabase.co";
const SUPABASE_KEY = "sb_publishable_cZd3LZ3MD_RXBqub6SYWWg_LbyU1Qd7";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    return res.status(500).json({ error: "VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY not set in Vercel environment variables." });
  }
  webpush.setVapidDetails("mailto:admin@example.com", publicKey, privateKey);

  const { employeeId, title, body } = req.body;
  if (!employeeId) {
    return res.status(400).json({ error: "Missing employeeId." });
  }

  try {
    const subRes = await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions?employee_id=eq.${employeeId}&select=*`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    const subs = await subRes.json();
    if (!Array.isArray(subs) || subs.length === 0) {
      return res.status(200).json({ sent: 0, reason: "No push subscription on file for this person." });
    }

    const payload = JSON.stringify({ title: title || "Amplify", body: body || "" });
    let sent = 0;
    const errors = [];
    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        sent++;
      } catch (err) {
        errors.push(err.message);
      }
    }
    res.status(200).json({ sent, errors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

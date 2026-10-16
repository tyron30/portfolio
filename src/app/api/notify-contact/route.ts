import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");

const pick = (rec: Record<string, unknown>, keys: string[]) => {
  for (const k of keys) {
    const v = rec[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
};

// Called by a Supabase Database Webhook on INSERT into the contact messages table.
export async function POST(req: Request) {
  const secret = process.env.CONTACT_WEBHOOK_SECRET;
  if (!secret || req.headers.get("x-webhook-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_TO;
  if (!apiKey || !to) {
    return NextResponse.json({ error: "email not configured" }, { status: 500 });
  }

  let body: { record?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const rec = body.record ?? {};
  const name = pick(rec, ["name", "full_name", "sender_name"]) || "Someone";
  const email = pick(rec, ["email", "sender_email"]);
  const subject = pick(rec, ["subject", "topic"]);
  const message = pick(rec, ["message", "body", "content"]);

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
    <div style="background:#2563eb;color:#fff;padding:16px 20px;font-size:16px;font-weight:600">New message from your portfolio</div>
    <div style="padding:20px;color:#0f172a;font-size:14px;line-height:1.6">
      <p style="margin:0 0 4px"><b>From:</b> ${esc(name)}${email ? ` &lt;${esc(email)}&gt;` : ""}</p>
      ${subject ? `<p style="margin:0 0 4px"><b>Subject:</b> ${esc(subject)}</p>` : ""}
      <div style="margin-top:14px;padding:14px;background:#f1f5f9;border-radius:8px">${esc(message) || "(no message)"}</div>
      ${email ? `<p style="margin:16px 0 0"><a href="mailto:${esc(email)}" style="background:#2563eb;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;display:inline-block">Reply to ${esc(name)}</a></p>` : ""}
    </div>
  </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Portfolio <onboarding@resend.dev>",
      to: [to],
      reply_to: email || undefined,
      subject: `New portfolio message from ${name}`,
      html,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "send failed", detail: await res.text() }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

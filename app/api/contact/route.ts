import { Resend } from "resend";
import { NextResponse } from "next/server";
import { CONTACT_EMAIL } from "@/lib/contact-email";

const SUBJECT_PREFIX: Record<"en" | "es", string> = {
  en: "[Studio]",
  es: "[Estudio]",
};

const MAX = { name: 200, intent: 8000, reference: 500 };

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM?.trim();
  if (!apiKey || !from) {
    return NextResponse.json(
      { ok: false as const, error: "config" },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false as const, error: "invalid_json" },
      { status: 400 },
    );
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json(
      { ok: false as const, error: "invalid_body" },
      { status: 400 },
    );
  }

  const o = payload as Record<string, unknown>;
  const name = String(o.name ?? "").trim();
  const email = String(o.email ?? "").trim();
  const intent = String(o.intent ?? "").trim();
  const reference = String(o.reference ?? "").trim();
  const locale = o.locale === "es" ? "es" : "en";

  if (!name || name.length > MAX.name) {
    return NextResponse.json(
      { ok: false as const, error: "validation" },
      { status: 400 },
    );
  }
  if (!email || !isValidEmail(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false as const, error: "validation" },
      { status: 400 },
    );
  }
  if (!intent || intent.length > MAX.intent) {
    return NextResponse.json(
      { ok: false as const, error: "validation" },
      { status: 400 },
    );
  }
  if (reference.length > MAX.reference) {
    return NextResponse.json(
      { ok: false as const, error: "validation" },
      { status: 400 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL?.trim() || CONTACT_EMAIL;
  const prefix = SUBJECT_PREFIX[locale];
  const text = [
    `Name / Quién: ${name}`,
    `Email / Retorno: ${email}`,
    "",
    "Intent / Qué hay que resolver:",
    intent,
    "",
    reference ? `Reference / Enlace:\n${reference}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `${prefix} ${name}`.slice(0, 998),
    text,
  });

  if (error) {
    return NextResponse.json(
      { ok: false as const, error: "send_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true as const });
}

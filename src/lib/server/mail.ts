function envVar(name: string): string {
  const g = globalThis as { process?: { env?: Record<string, string | undefined> } };
  return (g.process?.env?.[name] ?? "").trim();
}

export function textToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&#38;")
    .replace(/</g, "&#60;")
    .replace(/>/g, "&#62;")
    .replace(/\n/g, "<br/>\n");
  return (
    "<!DOCTYPE html><html><head><meta charset=\"utf-8\"/></head><body style=\"font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;color:#222\">" +
    escaped +
    "</body></html>"
  );
}

function parseTo(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(/[;,]/)) {
    const email = part.trim();
    const key = email.toLowerCase();
    if (!email || !email.includes("@") || seen.has(key)) continue;
    seen.add(key);
    out.push(email);
  }
  return out;
}

export async function sendResendEmail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<{ ok: boolean; error: string }> {
  const key = envVar("RESEND_API_KEY");
  if (!key) return { ok: false, error: "RESEND_API_KEY puuttuu" };
  const from = envVar("ORDER_EMAIL_FROM") || "Prego B2B <onboarding@resend.dev>";
  const to = parseTo(input.to);
  if (!to.length) return { ok: false, error: "Ei vastaanottajaa" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      from,
      to,
      subject: input.subject,
      text: input.text,
      html: input.html || textToHtml(input.text),
    }),
  });
  const json = (await res.json().catch(() => ({}))) as { message?: string; name?: string };
  if (res.ok) return { ok: true, error: "" };
  const error = (json.message || json.name || `Resend ${res.status}`) + " (from " + from + " → " + to.join(", ") + ")";
  console.error("[prego-email]", res.status, error);
  return { ok: false, error };
}

export async function sendSignupNotice(input: {
  adminTo: string;
  applicantEmail: string;
  displayName: string;
  companyName: string;
  vatNumber: string;
  phone: string;
}): Promise<{ ok: boolean; error: string }> {
  const errors: string[] = [];
  const adminBody = [
    "Uusi yritystili odottaa hyv\u00e4ksynt\u00e4\u00e4.",
    "",
    "Yritys: " + (input.companyName || "-"),
    "Y-tunnus: " + (input.vatNumber || "-"),
    "Yhteyshenkil\u00f6: " + (input.displayName || "-"),
    "S\u00e4hk\u00f6posti: " + (input.applicantEmail || "-"),
    "Puhelin: " + (input.phone || "-"),
    "",
    "Hyv\u00e4ksy asiakas: https://prego.585.fi/admin",
  ].join("\n");
  const admin = await sendResendEmail({
    to: input.adminTo,
    subject: "Prego B2B: uusi tili " + (input.companyName || input.applicantEmail),
    text: adminBody,
  });
  if (!admin.ok) errors.push("myynti: " + admin.error);
  if (input.applicantEmail.includes("@")) {
    const userBody = [
      "Hei " + (input.displayName || "") + ",",
      "",
      "Kiitos Prego B2B -tilin avaamisesta.",
      "Yll\u00e4pit\u00e4j\u00e4 tarkistaa yrityksen tiedot. Hinnat ja tilaus avautuvat, kun tili on hyv\u00e4ksytty.",
      "",
      "Prego / Suomen 585 Oy",
    ].join("\n");
    const user = await sendResendEmail({
      to: input.applicantEmail,
      subject: "Prego B2B: tilisi odottaa hyv\u00e4ksynt\u00e4\u00e4",
      text: userBody,
    });
    if (!user.ok) errors.push("hakija: " + user.error);
  }
  return { ok: admin.ok, error: errors.join(" | ") };
}

export async function sendPasswordResetMail(email: string, url: string) {
  const text = [
    "Hei,",
    "",
    "Pyysit uutta salasanaa Prego B2B -portaaliin.",
    "Avaa tämä linkki (voimassa rajoitetun ajan) ja aseta uusi salasana:",
    "",
    url,
    "",
    "Jos et pyytänyt tätä, voit jättää viestin huomiotta.",
    "",
    "Prego / Suomen 585 Oy",
  ].join("\n");
  const safeUrl = encodeURI(url);
  const html =
    "<!DOCTYPE html><html><head><meta charset=\"utf-8\"/></head><body style=\"font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;color:#222\">" +
    "<p>Hei,</p>" +
    "<p>Pyysit uutta salasanaa Prego B2B -portaaliin. Avaa linkki (voimassa rajoitetun ajan) ja aseta uusi salasana:</p>" +
    "<p><a href=\"" +
    safeUrl +
    "\">" +
    safeUrl +
    "</a></p>" +
    "<p>Jos et pyyt\u00e4nyt t\u00e4t\u00e4, voit j\u00e4tt\u00e4\u00e4 viestin huomiotta.</p>" +
    "<p>Prego / Suomen 585 Oy</p></body></html>";
  const sent = await sendResendEmail({
    to: email,
    subject: "Prego B2B: salasanan vaihto",
    text,
    html,
  });
  if (!sent.ok) {
    console.error("[prego-reset]", email, sent.error);
    throw new Error(sent.error || "Reset email failed");
  }
}

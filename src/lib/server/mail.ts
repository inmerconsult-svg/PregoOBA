function envVar(name: string): string {
  const g = globalThis as { process?: { env?: Record<string, string | undefined> } };
  return (g.process?.env?.[name] ?? "").trim();
}

export async function sendResendEmail(input: {
  to: string;
  subject: string;
  text: string;
}): Promise<{ ok: boolean; error: string }> {
  const key = envVar("RESEND_API_KEY");
  if (!key) return { ok: false, error: "RESEND_API_KEY puuttuu" };
  const from = envVar("ORDER_EMAIL_FROM") || "Prego B2B <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      text: input.text,
    }),
  });
  const json = (await res.json().catch(() => ({}))) as { message?: string; name?: string };
  if (res.ok) return { ok: true, error: "" };
  const error = json.message || json.name || `Resend ${res.status}`;
  console.error("[prego-email]", res.status, error);
  return { ok: false, error };
}

export async function sendPasswordResetMail(email: string, url: string) {
  const sent = await sendResendEmail({
    to: email,
    subject: "Prego B2B: salasanan vaihto",
    text: [
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
    ].join("\n"),
  });
  if (!sent.ok) {
    console.error("[prego-reset]", email, sent.error);
    throw new Error(sent.error || "Reset email failed");
  }
}

import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapProductRow } from "@/lib/catalog-helpers";
import type { Order, OrderItem, Profile } from "@/lib/types";
import { MIN_ORDER_NET, meetsMinOrder } from "@/lib/commerce-rules";
import { buildOrderPdf, orderPdfFilename } from "@/lib/order-pdf";
import { textToHtml, sendSignupNotice } from "@/lib/server/mail";

function mapProfile(row: Record<string, unknown>): Profile {
  return {
    userId: String(row.user_id),
    email: String(row.email ?? ""),
    displayName: String(row.display_name ?? ""),
    role: (row.role as Profile["role"]) || "customer",
    companyName: String(row.company_name ?? ""),
    vatNumber: String(row.vat_number ?? ""),
    phone: String(row.phone ?? ""),
    addressLine: String(row.address_line ?? ""),
    postalCode: String(row.postal_code ?? ""),
    city: String(row.city ?? ""),
    country: String(row.country ?? "FI"),
    language: String(row.language ?? "fi"),
    createdAt: String(row.created_at ?? ""),
    approvedAt: row.approved_at ? String(row.approved_at) : null,
  };
}

async function requireAdmin(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ role: string }>`select role from profiles where user_id = ${userId}`;
  if (rows[0]?.role !== "admin") {
    const err = new Error("Forbidden");
    (err as Error & { status?: number }).status = 403;
    throw err;
  }
}

export const ensureProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { email?: string | null; displayName?: string | null; language?: string | null }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await sql<Record<string, unknown>>`
      select * from profiles where user_id = ${context.userId} limit 1
    `;
    if (existing[0]) {
      if (data.email || data.displayName) {
        await sql`
          update profiles set
            email = case when ${data.email ?? ""} = '' then email else ${data.email ?? ""} end,
            display_name = case when ${data.displayName ?? ""} = '' then display_name else ${data.displayName ?? ""} end
          where user_id = ${context.userId}
        `;
      }
      const fresh = await sql<Record<string, unknown>>`select * from profiles where user_id = ${context.userId}`;
      return mapProfile(fresh[0]);
    }
    const admins = await sql<{ n: number }>`select count(*)::int as n from profiles where role = 'admin'`;
    const isFirst = (admins[0]?.n ?? 0) === 0;
    const role = isFirst ? "admin" : "pending";
    const email = data.email ?? "";
    const name = data.displayName ?? "";
    const approvedAt = isFirst ? new Date().toISOString() : null;
    await sql`
      insert into profiles (user_id, email, display_name, role, language, approved_at)
      values (${context.userId}, ${email}, ${name}, ${role}, ${data.language ?? "fi"}, ${approvedAt})
    `;
    const created = await sql<Record<string, unknown>>`select * from profiles where user_id = ${context.userId}`;
    return mapProfile(created[0]);
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      displayName: string;
      companyName: string;
      vatNumber: string;
      phone: string;
      addressLine: string;
      postalCode: string;
      city: string;
      country: string;
      language: string;
    }) => d,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update profiles set
        display_name = ${data.displayName},
        company_name = ${data.companyName},
        vat_number = ${data.vatNumber},
        phone = ${data.phone},
        address_line = ${data.addressLine},
        postal_code = ${data.postalCode},
        city = ${data.city},
        country = ${data.country},
        language = ${data.language}
      where user_id = ${context.userId}
    `;
    const rows = await sql<Record<string, unknown>>`select * from profiles where user_id = ${context.userId}`;
    return mapProfile(rows[0]);
  });

export const listCustomers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`select * from profiles order by created_at desc`;
    return rows.map(mapProfile);
  });

export const setCustomerRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { userId: string; role: "pending" | "customer" | "admin" }) => d)
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    if (data.userId === context.userId && data.role !== "admin") {
      throw new Error("Cannot demote yourself");
    }
    const sql = await getSql();
    await sql`
      update profiles set
        role = ${data.role},
        approved_at = case when ${data.role} = 'pending' then null else coalesce(approved_at, now()) end
      where user_id = ${data.userId}
    `;
    return { ok: true };
  });

export const deleteCustomer = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { userId: string }) => d)
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    if (data.userId === context.userId) throw new Error("Et voi poistaa omaa tunnusta");
    const sql = await getSql();
    const target = await sql<{ role: string }>`select role from profiles where user_id = ${data.userId}`;
    if (!target[0]) throw new Error("Käyttäjää ei löydy");
    if (target[0].role === "admin") {
      const [{ n }] = await sql<{ n: number }>`select count(*)::int as n from profiles where role = 'admin'`;
      if (n <= 1) throw new Error("Viimeistä ylläpitäjää ei voi poistaa");
    }
    await sql`delete from session where "userId" = ${data.userId}`;
    await sql`delete from account where "userId" = ${data.userId}`;
    await sql`delete from favorites where user_id = ${data.userId}`;
    await sql`delete from profiles where user_id = ${data.userId}`;
    await sql`delete from "user" where id = ${data.userId}`;
    return { ok: true };
  });

type CheckoutInput = {
  lines: { sku: string; qty: number }[];
  poNumber: string;
  notes: string;
  reverseCharge: boolean;
  deliveryName: string;
  deliveryAddress: string;
  deliveryPostal: string;
  deliveryCity: string;
  deliveryCountry: string;
};

function num(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

export const submitOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: CheckoutInput) => d)
  .handler(async ({ context, data }) => {
    if (!data.lines.length) throw new Error("Empty cart");
    const sql = await getSql();
    const profileRows = await sql<Record<string, unknown>>`
      select * from profiles where user_id = ${context.userId}
    `;
    const profile = profileRows[0] ? mapProfile(profileRows[0]) : null;
    if (!profile) throw new Error("Profile missing");
    if (profile.role === "pending") throw new Error("Account pending approval");

    const items: { sku: string; qty: number; product: ReturnType<typeof mapProductRow>; preorder: boolean }[] = [];
    for (const line of data.lines) {
      const rows = await sql<Record<string, unknown>>`select * from products where sku = ${line.sku} and active = true`;
      if (!rows[0]) throw new Error(`Unknown SKU ${line.sku}`);
      const product = mapProductRow(rows[0]);
      const qty = Math.max(1, Math.round(line.qty) || 1);
      items.push({ sku: line.sku, qty, product, preorder: product.stock <= 0 });
    }

    const vatRows = await sql<{ value: string }>`select value from settings where key = 'vat_rate'`;
    const orderEmailRows = await sql<{ value: string }>`select value from settings where key = 'order_email'`;
    const vatRate = data.reverseCharge ? 0 : num(vatRows[0]?.value ?? 25.5);
    const netTotal = items.reduce((s, i) => s + i.qty * i.product.netPrice, 0);
    if (!meetsMinOrder(netTotal)) {
      throw new Error(`Minimitilaus ${MIN_ORDER_NET} € (alv 0)`);
    }
    const vatTotal = Math.round(netTotal * (vatRate / 100) * 100) / 100;
    const grand = Math.round((netTotal + vatTotal) * 100) / 100;

    const year = new Date().getFullYear();
    const [{ n }] = await sql<{ n: number }>`select count(*)::int as n from orders`;
    const orderNo = `PREGO-${year}-${String((n ?? 0) + 1).padStart(5, "0")}`;

    const inserted = await sql<{ id: number }>`
      insert into orders (
        order_no, user_id, status, company_name, vat_number, email, phone, po_number, notes,
        delivery_name, delivery_address, delivery_postal, delivery_city, delivery_country,
        reverse_charge, net_total, vat_rate, vat_total, grand_total
      ) values (
        ${orderNo}, ${context.userId}, 'submitted', ${profile.companyName}, ${profile.vatNumber},
        ${profile.email}, ${profile.phone}, ${data.poNumber}, ${data.notes},
        ${data.deliveryName}, ${data.deliveryAddress}, ${data.deliveryPostal}, ${data.deliveryCity},
        ${data.deliveryCountry}, ${data.reverseCharge}, ${netTotal}, ${vatRate}, ${vatTotal}, ${grand}
      ) returning id
    `;
    const orderId = inserted[0].id;
    for (const i of items) {
      const name = i.product.nameFi;
      const lineTotal = Math.round(i.qty * i.product.netPrice * 100) / 100;
      await sql`
        insert into order_items (order_id, sku, name, ean, qty, carton_qty, unit_price, line_total, preorder)
        values (${orderId}, ${i.sku}, ${name}, ${i.product.ean}, ${i.qty}, ${i.product.cartonQty}, ${i.product.netPrice}, ${lineTotal}, ${i.preorder})
      `;
    }

    const to = orderEmailRows[0]?.value || "barmanol@gmail.com";
    const body = [
      `Tilaus ${orderNo}`,
      `Yritys: ${profile.companyName} (${profile.vatNumber})`,
      `Yhteys: ${profile.displayName} <${profile.email}> ${profile.phone}`,
      `Ostotilaus: ${data.poNumber || "—"}`,
      `Toimitus: ${data.deliveryName}, ${data.deliveryAddress}, ${data.deliveryPostal} ${data.deliveryCity}, ${data.deliveryCountry}`,
      data.reverseCharge ? "ALV: käännetty verovelvollisuus 0 %" : `ALV: ${vatRate} %`,
      "",
      ...items.map(
        (i) =>
          `${i.sku}  ${i.product.nameFi}${i.preorder ? " (ENNAKKO)" : ""}  ${i.qty} kpl × ${i.product.netPrice.toFixed(2)} € = ${(i.qty * i.product.netPrice).toFixed(2)} €`,
      ),
      "",
      `Veroton: ${netTotal.toFixed(2)} €`,
      `ALV: ${vatTotal.toFixed(2)} €`,
      `Yhteensä: ${grand.toFixed(2)} €`,
      items.some((i) => i.preorder)
        ? "\nENNAKKO: Tilauksella on tuotteita jotka saapuvat varastoon myöhemmin. Varastossa olevat tuotteet lähetetään osatoimituksena heti."
        : "",
      data.notes ? `\nViesti:\n${data.notes}` : "",
      "\nTilausvahvistus PDF on liitteenä.",
    ].join("\n");
    let pdf: { filename: string; bytes: Uint8Array } | undefined;
    try {
      const order = await loadOrder(orderId, context.userId, true);
      if (order) {
        pdf = { filename: orderPdfFilename(order), bytes: await buildOrderPdf(order) };
      }
    } catch (err) {
      console.error("[prego-pdf]", err);
    }
    const sent = await sendOrderEmail({
      to,
      cc: profile.email,
      subject: `Prego B2B tilaus ${orderNo}`,
      text: body,
      pdf,
    });
    await sql`
      insert into email_log (order_id, to_address, subject, body, status, error)
      values (
        ${orderId},
        ${to},
        ${"Prego B2B tilaus " + orderNo},
        ${body},
        ${sent.ok ? "sent" : "failed"},
        ${sent.error}
      )
    `;
    return { orderId, orderNo };
  });

function envVar(name: string): string {
  const g = globalThis as { process?: { env?: Record<string, string | undefined> } };
  return (g.process?.env?.[name] ?? "").trim();
}

function parseEmails(raw: string): string[] {
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

async function resendSend(key: string, payload: Record<string, unknown>): Promise<{ ok: boolean; error: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });
  const json = (await res.json().catch(() => ({}))) as { message?: string; name?: string };
  if (res.ok) return { ok: true, error: "" };
  const error = json.message || json.name || `Resend ${res.status}`;
  console.error("[prego-email]", res.status, error);
  return { ok: false, error };
}

async function sendOrderEmail(input: {
  to: string;
  cc: string;
  subject: string;
  text: string;
  pdf?: { filename: string; bytes: Uint8Array };
}): Promise<{ ok: boolean; error: string }> {
  const key = envVar("RESEND_API_KEY");
  if (!key) return { ok: false, error: "RESEND_API_KEY puuttuu Vercelistä (Redeploy env-lisäyksen jälkeen)." };
  const from = envVar("ORDER_EMAIL_FROM") || "Prego B2B <onboarding@resend.dev>";
  const to = parseEmails(input.to);
  const cc = parseEmails(input.cc).filter((e) => !to.some((t) => t.toLowerCase() === e.toLowerCase()));
  if (!to.length && !cc.length) return { ok: false, error: "Ei vastaanottajaa (admin → tilausten sähköposti)." };

  const attachments = input.pdf
    ? [{ filename: input.pdf.filename, content: Buffer.from(input.pdf.bytes).toString("base64") }]
    : undefined;

  const errors: string[] = [];
  let anyOk = false;

  if (to.length) {
    const first = await resendSend(key, {
      from,
      to,
      subject: input.subject,
      text: input.text,
      html: textToHtml(input.text),
      attachments,
    });
    if (first.ok) anyOk = true;
    else errors.push(`myynti (${to.join(", ")}): ${first.error}`);
  }

  if (cc.length) {
    const copy = await resendSend(key, {
      from,
      to: cc,
      subject: `Tilausvahvistus: ${input.subject}`,
      text: input.text,
      html: textToHtml(input.text),
      attachments,
    });
    if (copy.ok) anyOk = true;
    else errors.push(`asiakas (${cc.join(", ")}): ${copy.error}`);
  }

  return { ok: anyOk, error: errors.join(" | ") };
}

async function loadOrder(id: number, userId: string, admin: boolean): Promise<Order | null> {
  const sql = await getSql();
  const rows = admin
    ? await sql<Record<string, unknown>>`select * from orders where id = ${id}`
    : await sql<Record<string, unknown>>`select * from orders where id = ${id} and user_id = ${userId}`;
  if (!rows[0]) return null;
  const items = await sql<Record<string, unknown>>`select * from order_items where order_id = ${id} order by id`;
  return mapOrder(rows[0], items);
}

function mapOrder(row: Record<string, unknown>, items: Record<string, unknown>[]): Order {
  return {
    id: num(row.id),
    orderNo: String(row.order_no),
    userId: String(row.user_id),
    status: String(row.status),
    companyName: String(row.company_name ?? ""),
    vatNumber: String(row.vat_number ?? ""),
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    poNumber: String(row.po_number ?? ""),
    notes: String(row.notes ?? ""),
    deliveryName: String(row.delivery_name ?? ""),
    deliveryAddress: String(row.delivery_address ?? ""),
    deliveryPostal: String(row.delivery_postal ?? ""),
    deliveryCity: String(row.delivery_city ?? ""),
    deliveryCountry: String(row.delivery_country ?? ""),
    reverseCharge: Boolean(row.reverse_charge),
    netTotal: num(row.net_total),
    vatRate: num(row.vat_rate),
    vatTotal: num(row.vat_total),
    grandTotal: num(row.grand_total),
    createdAt: String(row.created_at ?? ""),
    items: items.map(
      (i): OrderItem => ({
        id: num(i.id),
        sku: String(i.sku),
        name: String(i.name),
        ean: i.ean ? String(i.ean) : null,
        qty: num(i.qty),
        cartonQty: num(i.carton_qty),
        unitPrice: num(i.unit_price),
        lineTotal: num(i.line_total),
        preorder: Boolean(i.preorder) || /\(ENNAKKO\)/i.test(String(i.name ?? "")),
      }),
    ),
  };
}

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select * from orders where user_id = ${context.userId} order by id desc
    `;
    const out: Order[] = [];
    for (const row of rows) {
      const items = await sql<Record<string, unknown>>`select * from order_items where order_id = ${row.id} order by id`;
      out.push(mapOrder(row, items));
    }
    return out;
  });

export const getOrder = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const me = await sql<{ role: string }>`select role from profiles where user_id = ${context.userId}`;
    const admin = me[0]?.role === "admin";
    return loadOrder(id, context.userId, admin);
  });

export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`select * from orders order by id desc`;
    const out: Order[] = [];
    for (const row of rows) {
      const items = await sql<Record<string, unknown>>`select * from order_items where order_id = ${row.id} order by id`;
      out.push(mapOrder(row, items));
    }
    return out;
  });

export const setOrderStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: number; status: string }) => d)
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const allowed = ["submitted", "confirmed", "processing", "shipped", "cancelled"];
    if (!allowed.includes(data.status)) throw new Error("Invalid status");
    const sql = await getSql();
    await sql`update orders set status = ${data.status}, updated_at = now() where id = ${data.id}`;
    return { ok: true };
  });

export const getSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<{ key: string; value: string }>`select key, value from settings`;
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;
    return map;
  });

export const saveSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { orderEmail: string; vatRate: string; companyName: string }) => d)
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql`insert into settings (key, value) values ('order_email', ${data.orderEmail}) on conflict (key) do update set value = excluded.value`;
    await sql`insert into settings (key, value) values ('vat_rate', ${data.vatRate}) on conflict (key) do update set value = excluded.value`;
    await sql`insert into settings (key, value) values ('company_name', ${data.companyName}) on conflict (key) do update set value = excluded.value`;
    return { ok: true };
  });

export const adminOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const [{ products }] = await sql<{ products: number }>`select count(*)::int as products from products where active = true`;
    const [{ orders }] = await sql<{ orders: number }>`select count(*)::int as orders from orders`;
    const [{ open }] = await sql<{ open: number }>`select count(*)::int as open from orders where status in ('submitted','confirmed','processing')`;
    const [{ customers }] = await sql<{ customers: number }>`select count(*)::int as customers from profiles`;
    const [{ low }] = await sql<{ low: number }>`select count(*)::int as low from products where active = true and stock > 0 and stock <= 10`;
    const [{ out }] = await sql<{ out: number }>`select count(*)::int as out from products where active = true and stock <= 0`;
    const emails = await sql<{
      id: number;
      to_address: string;
      subject: string;
      created_at: string;
      status: string;
      error: string;
    }>`
      select id, to_address, subject, created_at,
             coalesce(status, '') as status, coalesce(error, '') as error
      from email_log order by id desc limit 8
    `;
    return { products, orders, open, customers, low, out, emails };
  });

export const listEmailLog = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    return sql<{
      id: number;
      order_id: number | null;
      to_address: string;
      subject: string;
      body: string;
      created_at: string;
    }>`select id, order_id, to_address, subject, body, created_at from email_log order by id desc limit 30`;
  });

export const sendTestEmail = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<{ value: string }>`select value from settings where key = 'order_email'`;
    const to = rows[0]?.value || "";
    const sent = await sendOrderEmail({
      to,
      cc: "",
      subject: "Prego B2B testiviesti",
      text: "Tämä on testiviesti Prego B2B -portaalista. Jos näet tämän, Resend toimii.",
    });
    await sql`
      insert into email_log (order_id, to_address, subject, body, status, error)
      values (null, ${to || "(tyhjä)"}, ${"Prego B2B testiviesti"}, ${sent.error || "ok"}, ${sent.ok ? "sent" : "failed"}, ${sent.error})
    `;
    if (!sent.ok) throw new Error(sent.error);
    return { ok: true, to };
  });

export const notifyNewRegistration = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      email?: string;
      displayName?: string;
      companyName?: string;
      vatNumber?: string;
      phone?: string;
    }) => d,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const profileRows = await sql<Record<string, unknown>>`
      select * from profiles where user_id = ${context.userId} limit 1
    `;
    const profile = profileRows[0] ? mapProfile(profileRows[0]) : null;
    if (profile?.role === "admin") return { ok: true, skipped: "admin" };
    const toRows = await sql<{ value: string }>`select value from settings where key = 'order_email'`;
    const to = toRows[0]?.value || "barmanol@gmail.com";
    const payload = {
      adminTo: to,
      applicantEmail: data.email || profile?.email || "",
      displayName: data.displayName || profile?.displayName || "",
      companyName: data.companyName || profile?.companyName || "",
      vatNumber: data.vatNumber || profile?.vatNumber || "",
      phone: data.phone || profile?.phone || "",
    };
    const sent = await sendSignupNotice(payload);
    await sql`
      insert into email_log (order_id, to_address, subject, body, status, error)
      values (
        null,
        ${to},
        ${"Prego B2B: uusi tili"},
        ${`Yritys: ${payload.companyName}\nEmail: ${payload.applicantEmail}`},
        ${sent.ok ? "sent" : "failed"},
        ${sent.error || ""}
      )
    `;
    if (!sent.ok) {
      console.error("[prego-signup-mail]", sent.error);
      throw new Error(sent.error);
    }
    return { ok: true };
  });

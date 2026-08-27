import { r as createServerFn } from "./ssr.mjs";
import { i as getSql, t as authMiddleware } from "./middleware-D532eKDl.mjs";
import { a as mapProductRow } from "./catalog-helpers-BokSV_Wl.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/commerce-DyyJCWdT.js
function mapProfile(row) {
	return {
		userId: String(row.user_id),
		email: String(row.email ?? ""),
		displayName: String(row.display_name ?? ""),
		role: row.role || "customer",
		companyName: String(row.company_name ?? ""),
		vatNumber: String(row.vat_number ?? ""),
		phone: String(row.phone ?? ""),
		addressLine: String(row.address_line ?? ""),
		postalCode: String(row.postal_code ?? ""),
		city: String(row.city ?? ""),
		country: String(row.country ?? "FI"),
		language: String(row.language ?? "fi"),
		createdAt: String(row.created_at ?? ""),
		approvedAt: row.approved_at ? String(row.approved_at) : null
	};
}
async function requireAdmin(userId) {
	if ((await (await getSql())`select role from profiles where user_id = ${userId}`)[0]?.role !== "admin") {
		const err = /* @__PURE__ */ new Error("Forbidden");
		err.status = 403;
		throw err;
	}
}
var ensureProfile_createServerFn_handler = createServerRpc({
	id: "7b7770099683f908676587ddb7f7cb351d215486140add7c3b1e123c6d2f8c0b",
	name: "ensureProfile",
	filename: "src/lib/server/commerce.ts"
}, (opts) => ensureProfile.__executeServer(opts));
var ensureProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(ensureProfile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await sql`
      select * from profiles where user_id = ${context.userId} limit 1
    `)[0]) {
		if (data.email || data.displayName) await sql`
          update profiles set
            email = case when ${data.email ?? ""} = '' then email else ${data.email ?? ""} end,
            display_name = case when ${data.displayName ?? ""} = '' then display_name else ${data.displayName ?? ""} end
          where user_id = ${context.userId}
        `;
		return mapProfile((await sql`select * from profiles where user_id = ${context.userId}`)[0]);
	}
	const role = ((await sql`select count(*)::int as n from profiles where role = 'admin'`)[0]?.n ?? 0) === 0 ? "admin" : "customer";
	const email = data.email ?? "";
	const name = data.displayName ?? "";
	await sql`
      insert into profiles (user_id, email, display_name, role, language, approved_at)
      values (${context.userId}, ${email}, ${name}, ${role}, ${data.language ?? "fi"}, now())
    `;
	return mapProfile((await sql`select * from profiles where user_id = ${context.userId}`)[0]);
});
var updateProfile_createServerFn_handler = createServerRpc({
	id: "1a9ebb2bf20ca3d40dfc43a60576647b3703244988c8901a91e8fdf54449171d",
	name: "updateProfile",
	filename: "src/lib/server/commerce.ts"
}, (opts) => updateProfile.__executeServer(opts));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(updateProfile_createServerFn_handler, async ({ context, data }) => {
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
	return mapProfile((await sql`select * from profiles where user_id = ${context.userId}`)[0]);
});
var listCustomers_createServerFn_handler = createServerRpc({
	id: "9e9057ba5802657511544213826e3583e78868e5c1011ee09d2f10205d63fe6b",
	name: "listCustomers",
	filename: "src/lib/server/commerce.ts"
}, (opts) => listCustomers.__executeServer(opts));
var listCustomers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listCustomers_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	return (await (await getSql())`select * from profiles order by created_at desc`).map(mapProfile);
});
var setCustomerRole_createServerFn_handler = createServerRpc({
	id: "a3ce2aa9cc58b9d05668e954e7905aac2e15fa6445df4c6f0eb2dbde7fde03db",
	name: "setCustomerRole",
	filename: "src/lib/server/commerce.ts"
}, (opts) => setCustomerRole.__executeServer(opts));
var setCustomerRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(setCustomerRole_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	if (data.userId === context.userId && data.role !== "admin") throw new Error("Cannot demote yourself");
	await (await getSql())`update profiles set role = ${data.role} where user_id = ${data.userId}`;
	return { ok: true };
});
function num(v) {
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : 0;
}
var submitOrder_createServerFn_handler = createServerRpc({
	id: "70c599788dbc2aed83f908f326fab1bb1e4b632ea3bd88662f85456b7cecb5a5",
	name: "submitOrder",
	filename: "src/lib/server/commerce.ts"
}, (opts) => submitOrder.__executeServer(opts));
var submitOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(submitOrder_createServerFn_handler, async ({ context, data }) => {
	if (!data.lines.length) throw new Error("Empty cart");
	const sql = await getSql();
	const profileRows = await sql`
      select * from profiles where user_id = ${context.userId}
    `;
	const profile = profileRows[0] ? mapProfile(profileRows[0]) : null;
	if (!profile) throw new Error("Profile missing");
	if (profile.role === "pending") throw new Error("Account pending approval");
	const items = [];
	for (const line of data.lines) {
		const rows = await sql`select * from products where sku = ${line.sku} and active = true`;
		if (!rows[0]) throw new Error(`Unknown SKU ${line.sku}`);
		const product = mapProductRow(rows[0]);
		const carton = Math.max(1, product.cartonQty);
		const qty = Math.max(carton, Math.ceil(line.qty / carton) * carton);
		items.push({
			sku: line.sku,
			qty,
			product
		});
	}
	const vatRows = await sql`select value from settings where key = 'vat_rate'`;
	const orderEmailRows = await sql`select value from settings where key = 'order_email'`;
	const vatRate = data.reverseCharge ? 0 : num(vatRows[0]?.value ?? 25.5);
	const netTotal = items.reduce((s, i) => s + i.qty * i.product.netPrice, 0);
	const vatTotal = Math.round(netTotal * (vatRate / 100) * 100) / 100;
	const grand = Math.round((netTotal + vatTotal) * 100) / 100;
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const [{ n }] = await sql`select count(*)::int as n from orders`;
	const orderNo = `PREGO-${year}-${String((n ?? 0) + 1).padStart(5, "0")}`;
	const orderId = (await sql`
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
    `)[0].id;
	for (const i of items) {
		const name = i.product.nameFi;
		const lineTotal = Math.round(i.qty * i.product.netPrice * 100) / 100;
		await sql`
        insert into order_items (order_id, sku, name, ean, qty, carton_qty, unit_price, line_total)
        values (${orderId}, ${i.sku}, ${name}, ${i.product.ean}, ${i.qty}, ${i.product.cartonQty}, ${i.product.netPrice}, ${lineTotal})
      `;
	}
	const to = orderEmailRows[0]?.value || "tilaukset@inbound.fi";
	const body = [
		`Tilaus ${orderNo}`,
		`Yritys: ${profile.companyName} (${profile.vatNumber})`,
		`Yhteys: ${profile.displayName} <${profile.email}> ${profile.phone}`,
		`Ostotilaus: ${data.poNumber || "—"}`,
		`Toimitus: ${data.deliveryName}, ${data.deliveryAddress}, ${data.deliveryPostal} ${data.deliveryCity}, ${data.deliveryCountry}`,
		data.reverseCharge ? "ALV: käännetty verovelvollisuus 0 %" : `ALV: ${vatRate} %`,
		"",
		...items.map((i) => `${i.sku}  ${i.product.nameFi}  ${i.qty} kpl × ${i.product.netPrice.toFixed(2)} € = ${(i.qty * i.product.netPrice).toFixed(2)} €`),
		"",
		`Veroton: ${netTotal.toFixed(2)} €`,
		`ALV: ${vatTotal.toFixed(2)} €`,
		`Yhteensä: ${grand.toFixed(2)} €`,
		data.notes ? `\nViesti:\n${data.notes}` : ""
	].join("\n");
	await sql`
      insert into email_log (order_id, to_address, subject, body)
      values (${orderId}, ${to}, ${"Prego B2B tilaus " + orderNo}, ${body})
    `;
	return {
		orderId,
		orderNo
	};
});
async function loadOrder(id, userId, admin) {
	const sql = await getSql();
	const rows = admin ? await sql`select * from orders where id = ${id}` : await sql`select * from orders where id = ${id} and user_id = ${userId}`;
	if (!rows[0]) return null;
	const items = await sql`select * from order_items where order_id = ${id} order by id`;
	return mapOrder(rows[0], items);
}
function mapOrder(row, items) {
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
		items: items.map((i) => ({
			id: num(i.id),
			sku: String(i.sku),
			name: String(i.name),
			ean: i.ean ? String(i.ean) : null,
			qty: num(i.qty),
			cartonQty: num(i.carton_qty),
			unitPrice: num(i.unit_price),
			lineTotal: num(i.line_total)
		}))
	};
}
var listMyOrders_createServerFn_handler = createServerRpc({
	id: "3d504ad47cf26f6058e8d5f7055d28aafb29ac9b3324490542dad038cc9237e6",
	name: "listMyOrders",
	filename: "src/lib/server/commerce.ts"
}, (opts) => listMyOrders.__executeServer(opts));
var listMyOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyOrders_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const rows = await sql`
      select * from orders where user_id = ${context.userId} order by id desc
    `;
	const out = [];
	for (const row of rows) {
		const items = await sql`select * from order_items where order_id = ${row.id} order by id`;
		out.push(mapOrder(row, items));
	}
	return out;
});
var getOrder_createServerFn_handler = createServerRpc({
	id: "c3d790ec40c833220a52f0cd6f87054520c1ee7c5596369e7965c0bf1f1bfa38",
	name: "getOrder",
	filename: "src/lib/server/commerce.ts"
}, (opts) => getOrder.__executeServer(opts));
var getOrder = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getOrder_createServerFn_handler, async ({ context, data: id }) => {
	const admin = (await (await getSql())`select role from profiles where user_id = ${context.userId}`)[0]?.role === "admin";
	return loadOrder(id, context.userId, admin);
});
var adminListOrders_createServerFn_handler = createServerRpc({
	id: "5d33b9af65cb928361020ce22d4bcb349a87fe17d80c012d2a535bc668841f56",
	name: "adminListOrders",
	filename: "src/lib/server/commerce.ts"
}, (opts) => adminListOrders.__executeServer(opts));
var adminListOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminListOrders_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const rows = await sql`select * from orders order by id desc`;
	const out = [];
	for (const row of rows) {
		const items = await sql`select * from order_items where order_id = ${row.id} order by id`;
		out.push(mapOrder(row, items));
	}
	return out;
});
var setOrderStatus_createServerFn_handler = createServerRpc({
	id: "65c594ffeb850e83a58c2c01d4430f510d859d677782d0123b06d7dbb91b17e8",
	name: "setOrderStatus",
	filename: "src/lib/server/commerce.ts"
}, (opts) => setOrderStatus.__executeServer(opts));
var setOrderStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(setOrderStatus_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	if (![
		"submitted",
		"confirmed",
		"processing",
		"shipped",
		"cancelled"
	].includes(data.status)) throw new Error("Invalid status");
	await (await getSql())`update orders set status = ${data.status}, updated_at = now() where id = ${data.id}`;
	return { ok: true };
});
var getSettings_createServerFn_handler = createServerRpc({
	id: "8475ca470bc8e8b51dc66e9d097439d5257d961423f2c3477cfb9a11d91432e8",
	name: "getSettings",
	filename: "src/lib/server/commerce.ts"
}, (opts) => getSettings.__executeServer(opts));
var getSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getSettings_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	const rows = await (await getSql())`select key, value from settings`;
	const map = {};
	for (const r of rows) map[r.key] = r.value;
	return map;
});
var saveSettings_createServerFn_handler = createServerRpc({
	id: "98c3ae98fd3233a2b4f1885d3e217a277f517a67ccf0ebbe249d7796f82d809c",
	name: "saveSettings",
	filename: "src/lib/server/commerce.ts"
}, (opts) => saveSettings.__executeServer(opts));
var saveSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveSettings_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	await sql`insert into settings (key, value) values ('order_email', ${data.orderEmail}) on conflict (key) do update set value = excluded.value`;
	await sql`insert into settings (key, value) values ('vat_rate', ${data.vatRate}) on conflict (key) do update set value = excluded.value`;
	await sql`insert into settings (key, value) values ('company_name', ${data.companyName}) on conflict (key) do update set value = excluded.value`;
	return { ok: true };
});
var adminOverview_createServerFn_handler = createServerRpc({
	id: "00e42519efb45b5e14ffd8900a1f4559de2e5500e61d6c2aebbdffb71ece1793",
	name: "adminOverview",
	filename: "src/lib/server/commerce.ts"
}, (opts) => adminOverview.__executeServer(opts));
var adminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminOverview_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const [{ products }] = await sql`select count(*)::int as products from products where active = true`;
	const [{ orders }] = await sql`select count(*)::int as orders from orders`;
	const [{ open }] = await sql`select count(*)::int as open from orders where status in ('submitted','confirmed','processing')`;
	const [{ customers }] = await sql`select count(*)::int as customers from profiles`;
	const [{ low }] = await sql`select count(*)::int as low from products where active = true and stock > 0 and stock <= 10`;
	const [{ out }] = await sql`select count(*)::int as out from products where active = true and stock <= 0`;
	return {
		products,
		orders,
		open,
		customers,
		low,
		out,
		emails: await sql`
      select id, to_address, subject, created_at from email_log order by id desc limit 8
    `
	};
});
var listEmailLog_createServerFn_handler = createServerRpc({
	id: "da1dd9608ae602def23f246421ba9d86389a24fcefda2aaad9b76119193fc63b",
	name: "listEmailLog",
	filename: "src/lib/server/commerce.ts"
}, (opts) => listEmailLog.__executeServer(opts));
var listEmailLog = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listEmailLog_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	return (await getSql())`select id, order_id, to_address, subject, body, created_at from email_log order by id desc limit 30`;
});
//#endregion
export { adminListOrders_createServerFn_handler, adminOverview_createServerFn_handler, ensureProfile_createServerFn_handler, getOrder_createServerFn_handler, getSettings_createServerFn_handler, listCustomers_createServerFn_handler, listEmailLog_createServerFn_handler, listMyOrders_createServerFn_handler, saveSettings_createServerFn_handler, setCustomerRole_createServerFn_handler, setOrderStatus_createServerFn_handler, submitOrder_createServerFn_handler, updateProfile_createServerFn_handler };

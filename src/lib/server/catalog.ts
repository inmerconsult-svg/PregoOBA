import { createServerFn } from "@tanstack/react-start";
import { getSql, type Sql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapProductRow, guessGroup, featuresJson, GROUPS } from "@/lib/catalog-helpers";
import { parseInventoryFile, splitCategory } from "@/lib/excel-parse";
import type { Product } from "@/lib/types";
import seed from "@/data/products.json";

type SeedItem = Product;

function emptyish(value: unknown): boolean {
  if (value == null) return true;
  const s = String(value).trim();
  return s === "" || s === "[]";
}

async function insertSeedProduct(sql: Sql, p: SeedItem) {
  await sql`
    insert into products (
      sku, ean, name_fi, name_en, name_sv, name_no, name_et,
      category_code, category_fi, category_en, category_sv, category_no, category_et,
      product_group, net_price, carton_qty, stock, incoming, reserved, backorder, eta, active,
      image_url, datasheet_url, features_fi, features_en, features_sv, features_no, features_et
    ) values (
      ${p.sku}, ${p.ean}, ${p.nameFi}, ${p.nameEn}, ${p.nameSv}, ${p.nameNo}, ${p.nameEt},
      ${p.categoryCode}, ${p.categoryFi}, ${p.categoryEn}, ${p.categorySv}, ${p.categoryNo}, ${p.categoryEt},
      ${p.group}, ${p.netPrice}, ${p.cartonQty}, ${p.stock}, ${p.incoming}, ${p.reserved}, ${p.backorder},
      ${p.eta}, ${p.active},
      ${p.imageUrl}, ${p.datasheetUrl},
      ${featuresJson(p.featuresFi)}, ${featuresJson(p.featuresEn)}, ${featuresJson(p.featuresSv)},
      ${featuresJson(p.featuresNo)}, ${featuresJson(p.featuresEt)}
    ) on conflict (sku) do nothing
  `;
}

async function seedIfEmpty() {
  const sql = await getSql();
  const items = seed as SeedItem[];
  const existing = await sql<{
    sku: string;
    image_url: string | null;
    datasheet_url: string | null;
    features_fi: string | null;
  }>`select sku, image_url, datasheet_url, features_fi from products`;
  const bySku = new Map(existing.map((r) => [r.sku, r]));

  for (const p of items) {
    const row = bySku.get(p.sku);
    if (!row) {
      await insertSeedProduct(sql, p);
      continue;
    }
    const needImage = emptyish(row.image_url) && Boolean(p.imageUrl);
    const needSheet = emptyish(row.datasheet_url) && Boolean(p.datasheetUrl);
    const needFeat = emptyish(row.features_fi) && (p.featuresFi?.length ?? 0) > 0;
    if (!needImage && !needSheet && !needFeat) continue;
    await sql`
      update products set
        image_url = case when ${needImage} then ${p.imageUrl} else image_url end,
        datasheet_url = case when ${needSheet} then ${p.datasheetUrl} else datasheet_url end,
        features_fi = case when ${needFeat} then ${featuresJson(p.featuresFi)} else features_fi end,
        features_en = case when ${needFeat} then ${featuresJson(p.featuresEn)} else features_en end,
        features_sv = case when ${needFeat} then ${featuresJson(p.featuresSv)} else features_sv end,
        features_no = case when ${needFeat} then ${featuresJson(p.featuresNo)} else features_no end,
        features_et = case when ${needFeat} then ${featuresJson(p.featuresEt)} else features_et end,
        name_fi = case when ${needFeat} then ${p.nameFi} else name_fi end,
        name_en = case when ${needFeat} then ${p.nameEn} else name_en end,
        name_sv = case when ${needFeat} then ${p.nameSv} else name_sv end,
        name_no = case when ${needFeat} then ${p.nameNo} else name_no end,
        name_et = case when ${needFeat} then ${p.nameEt} else name_et end
      where sku = ${p.sku}
    `;
  }
  await sql`update products set name_fi = replace(name_fi, 'HiusTENS', 'Hiusten') where name_fi like ${"%HiusTENS%"}`;
  const validGroups = new Set<string>(GROUPS.map((g) => g.id));
  const all = await sql<{ sku: string; category_code: string; product_group: string }>`
    select sku, category_code, product_group from products
  `;
  const seedBySku = new Map(items.map((p) => [p.sku, p.group]));
  for (const r of all) {
    if (validGroups.has(r.product_group)) continue;
    const next = seedBySku.get(r.sku) ?? guessGroup(r.category_code);
    if (next !== r.product_group) {
      await sql`update products set product_group = ${next} where sku = ${r.sku}`;
    }
  }
}

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  await seedIfEmpty();
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select * from products
    where active = true
      and (stock > 0 or (eta is not null and btrim(eta) <> ''))
    order by product_group, category_code, sku
  `;
  const order = new Map<string, number>(GROUPS.map((g, i) => [g.id, i]));
  return rows
    .map(mapProductRow)
    .sort((a, b) => (order.get(a.group) ?? 99) - (order.get(b.group) ?? 99) || a.sku.localeCompare(b.sku));
});

export const getProduct = createServerFn({ method: "GET" })
  .validator((sku: string) => sku)
  .handler(async ({ data: sku }) => {
    await seedIfEmpty();
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select * from products
      where sku = ${sku}
        and active = true
        and (stock > 0 or (eta is not null and btrim(eta) <> ''))
      limit 1
    `;
    return rows[0] ? mapProductRow(rows[0]) : null;
  });

async function requireAdmin(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ role: string }>`select role from profiles where user_id = ${userId}`;
  if (rows[0]?.role !== "admin") {
    const err = new Error("Forbidden");
    (err as Error & { status?: number }).status = 403;
    throw err;
  }
}

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    await seedIfEmpty();
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`select * from products order by sku`;
    return rows.map(mapProductRow);
  });

export const upsertProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((p: Product) => p)
  .handler(async ({ context, data: p }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql`
      insert into products (
        sku, ean, name_fi, name_en, name_sv, name_no, name_et,
        category_code, category_fi, category_en, category_sv, category_no, category_et,
        product_group, net_price, carton_qty, stock, incoming, reserved, backorder, eta, active, updated_at,
        image_url, datasheet_url, features_fi, features_en, features_sv, features_no, features_et
      ) values (
        ${p.sku}, ${p.ean}, ${p.nameFi}, ${p.nameEn}, ${p.nameSv}, ${p.nameNo}, ${p.nameEt},
        ${p.categoryCode}, ${p.categoryFi}, ${p.categoryEn}, ${p.categorySv}, ${p.categoryNo}, ${p.categoryEt},
        ${p.group}, ${p.netPrice}, ${p.cartonQty}, ${p.stock}, ${p.incoming}, ${p.reserved}, ${p.backorder},
        ${p.eta}, ${p.active}, now(),
        ${p.imageUrl}, ${p.datasheetUrl},
        ${featuresJson(p.featuresFi)}, ${featuresJson(p.featuresEn)}, ${featuresJson(p.featuresSv)},
        ${featuresJson(p.featuresNo)}, ${featuresJson(p.featuresEt)}
      )
      on conflict (sku) do update set
        ean = excluded.ean,
        name_fi = excluded.name_fi,
        name_en = excluded.name_en,
        name_sv = excluded.name_sv,
        name_no = excluded.name_no,
        name_et = excluded.name_et,
        category_code = excluded.category_code,
        category_fi = excluded.category_fi,
        category_en = excluded.category_en,
        category_sv = excluded.category_sv,
        category_no = excluded.category_no,
        category_et = excluded.category_et,
        product_group = excluded.product_group,
        net_price = excluded.net_price,
        carton_qty = excluded.carton_qty,
        stock = excluded.stock,
        incoming = excluded.incoming,
        reserved = excluded.reserved,
        backorder = excluded.backorder,
        eta = excluded.eta,
        active = excluded.active,
        image_url = excluded.image_url,
        datasheet_url = excluded.datasheet_url,
        features_fi = excluded.features_fi,
        features_en = excluded.features_en,
        features_sv = excluded.features_sv,
        features_no = excluded.features_no,
        features_et = excluded.features_et,
        updated_at = now()
    `;
    return { ok: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((sku: string) => sku)
  .handler(async ({ context, data: sku }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql`delete from products where sku = ${sku}`;
    return { ok: true };
  });

export const importInventory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { filename: string; text: string; deactivateMissing: boolean }) => input)
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    await seedIfEmpty();
    const rows = parseInventoryFile(data.text);
    if (rows.length === 0) throw new Error("No product rows found in file");
    const sql = await getSql();
    let updated = 0;
    let added = 0;
    const skus: string[] = [];
    for (const r of rows) {
      skus.push(r.sku);
      const cat = splitCategory(r.categoryRaw);
      const group = guessGroup(cat.code);
      const existing = await sql<{ sku: string }>`select sku from products where sku = ${r.sku}`;
      if (existing.length === 0) {
        added += 1;
        const name = r.nameFi || r.sku;
        await sql`
          insert into products (
            sku, ean, name_fi, name_en, name_sv, name_no, name_et,
            category_code, category_fi, category_en, category_sv, category_no, category_et,
            product_group, net_price, carton_qty, stock, incoming, reserved, backorder, eta, active, updated_at
          ) values (
            ${r.sku}, ${r.ean}, ${name}, ${name}, ${name}, ${name}, ${name},
            ${cat.code}, ${cat.fi}, ${cat.fi}, ${cat.fi}, ${cat.fi}, ${cat.fi},
            ${group}, ${r.netPrice}, ${r.cartonQty}, ${r.stock}, ${r.incoming}, ${r.reserved}, ${r.backorder},
            ${r.eta}, true, now()
          )
        `;
      } else {
        updated += 1;
        await sql`
          update products set
            ean = case when ${r.ean} = '' then ean else ${r.ean} end,
            category_code = case when ${cat.code} = '000' then category_code else ${cat.code} end,
            category_fi = case when ${cat.fi} = 'Muut' then category_fi else ${cat.fi} end,
            product_group = ${group},
            net_price = ${r.netPrice},
            carton_qty = ${r.cartonQty},
            stock = ${r.stock},
            incoming = ${r.incoming},
            reserved = ${r.reserved},
            backorder = ${r.backorder},
            eta = ${r.eta},
            active = true,
            updated_at = now()
          where sku = ${r.sku}
        `;
      }
    }
    if (data.deactivateMissing && skus.length > 0) {
      const keep = new Set(skus);
      const all = await sql<{ sku: string }>`select sku from products`;
      for (const row of all) {
        if (!keep.has(row.sku)) {
          await sql`update products set active = false, updated_at = now() where sku = ${row.sku}`;
        }
      }
    }
    await sql`
      insert into import_logs (user_id, filename, products_updated, products_added)
      values (${context.userId}, ${data.filename}, ${updated}, ${added})
    `;
    return { updated, added, total: rows.length };
  });

export const listImportLogs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    return sql<{
      id: number;
      filename: string;
      products_updated: number;
      products_added: number;
      created_at: string;
    }>`select id, filename, products_updated, products_added, created_at from import_logs order by id desc limit 20`;
  });

//#region node_modules/.nitro/vite/services/ssr/assets/catalog-helpers-BokSV_Wl.js
var GROUPS = [
	{
		id: "kitchen",
		image: "/images/hero-kitchen.jpg"
	},
	{
		id: "household",
		image: "/images/hero-household.jpg"
	},
	{
		id: "beauty",
		image: "/images/hero-beauty.jpg"
	},
	{
		id: "wellness",
		image: "/images/hero-wellness.jpg"
	},
	{
		id: "medical",
		image: "/images/hero-wellness.jpg"
	},
	{
		id: "electronics",
		image: "/images/hero-electronics.jpg"
	}
];
function productName(p, lang) {
	return {
		fi: p.nameFi,
		en: p.nameEn,
		sv: p.nameSv,
		no: p.nameNo,
		et: p.nameEt
	}[lang] || p.nameFi;
}
function categoryName(p, lang) {
	return {
		fi: p.categoryFi,
		en: p.categoryEn,
		sv: p.categorySv,
		no: p.categoryNo,
		et: p.categoryEt
	}[lang] || p.categoryFi;
}
function groupImage(group) {
	return GROUPS.find((g) => g.id === group)?.image ?? "/images/hero-kitchen.jpg";
}
function mapProductRow(row) {
	const n = (v) => {
		const x = typeof v === "number" ? v : Number(v);
		return Number.isFinite(x) ? x : 0;
	};
	return {
		sku: String(row.sku ?? ""),
		ean: row.ean == null || row.ean === "" ? null : String(row.ean),
		nameFi: String(row.name_fi ?? ""),
		nameEn: String(row.name_en ?? ""),
		nameSv: String(row.name_sv ?? ""),
		nameNo: String(row.name_no ?? ""),
		nameEt: String(row.name_et ?? ""),
		categoryCode: String(row.category_code ?? ""),
		categoryFi: String(row.category_fi ?? ""),
		categoryEn: String(row.category_en ?? ""),
		categorySv: String(row.category_sv ?? ""),
		categoryNo: String(row.category_no ?? ""),
		categoryEt: String(row.category_et ?? ""),
		group: String(row.product_group ?? "kitchen"),
		netPrice: n(row.net_price),
		cartonQty: Math.max(1, Math.round(n(row.carton_qty) || 1)),
		stock: Math.round(n(row.stock)),
		incoming: Math.round(n(row.incoming)),
		reserved: Math.round(n(row.reserved)),
		backorder: Math.round(n(row.backorder)),
		eta: row.eta == null || row.eta === "" ? null : String(row.eta),
		active: Boolean(row.active)
	};
}
function guessGroup(categoryCode) {
	const c = Number(categoryCode);
	if (c >= 100 && c <= 106) return "kitchen";
	if (c === 140) return "kitchen";
	if (c >= 110 && c <= 118) return "household";
	if (c >= 200 && c <= 206) return "beauty";
	if (c === 150 || c === 152) return "wellness";
	if (c === 151) return "medical";
	return "electronics";
}
//#endregion
export { mapProductRow as a, guessGroup as i, categoryName as n, productName as o, groupImage as r, GROUPS as t };

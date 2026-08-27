import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as useI18n, T as roundToCarton, a as Shell, i as Route$7, y as useCart } from "./router-C5YXss2X.mjs";
import { i as Textarea, r as Input, t as Button } from "./ui-e6pFHy_K.mjs";
import { o as listProducts } from "./catalog-Cv5ZcB3M.mjs";
import { o as productName, t as GROUPS } from "./catalog-helpers-BokSV_Wl.mjs";
import { t as ProductCard } from "./product-card-DYGh2RNl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-1sYoiW1K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Catalog() {
	const { t, lang } = useI18n();
	const search = Route$7.useSearch();
	const add = useCart((s) => s.add);
	const [q, setQ] = (0, import_react.useState)(search.q ?? "");
	const [sort, setSort] = (0, import_react.useState)("name");
	const [quick, setQuick] = (0, import_react.useState)("");
	const [quickMsg, setQuickMsg] = (0, import_react.useState)(null);
	const productsQ = useQuery({
		queryKey: ["products"],
		queryFn: () => listProducts()
	});
	const products = productsQ.data ?? [];
	const filtered = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		let list = products;
		if (search.group) list = list.filter((p) => p.group === search.group);
		if (needle) list = list.filter((p) => {
			return `${p.sku} ${p.ean ?? ""} ${productName(p, lang)} ${p.nameFi} ${p.categoryFi}`.toLowerCase().includes(needle);
		});
		const copy = [...list];
		copy.sort((a, b) => {
			if (sort === "sku") return a.sku.localeCompare(b.sku);
			if (sort === "price") return a.netPrice - b.netPrice;
			if (sort === "stock") return b.stock - a.stock;
			return productName(a, lang).localeCompare(productName(b, lang), lang);
		});
		return copy;
	}, [
		products,
		q,
		search.group,
		sort,
		lang
	]);
	function addQuick() {
		const lines = quick.split(/\n+/).map((l) => l.trim()).filter(Boolean);
		let n = 0;
		for (const line of lines) {
			const m = line.match(/^([A-Za-z0-9]+)\s+(\d+)/);
			if (!m) continue;
			const sku = m[1].toUpperCase();
			const qty = Number(m[2]);
			const p = products.find((x) => x.sku.toUpperCase() === sku);
			if (!p) continue;
			add(p.sku, roundToCarton(qty, p.cartonQty), p.cartonQty);
			n += 1;
		}
		setQuickMsg(t("catalog.count", { n }));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-medium tracking-tight",
					children: t("catalog.title")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: t("catalog.count", { n: filtered.length })
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "max-w-md",
					placeholder: t("catalog.search"),
					value: q,
					onChange: (e) => setQ(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/catalog",
						search: {},
						className: `rounded-full border px-3 py-1.5 text-sm ${!search.group ? "border-ink bg-ink text-paper" : "border-line bg-surface"}`,
						children: t("catalog.all")
					}),
					GROUPS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/catalog",
						search: { group: g.id },
						className: `rounded-full border px-3 py-1.5 text-sm ${search.group === g.id ? "border-ink bg-ink text-paper" : "border-line bg-surface"}`,
						children: t(`groups.${g.id}`)
					}, g.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "ml-auto h-9 rounded-full border border-line bg-surface px-3 text-sm",
						value: sort,
						onChange: (e) => setSort(e.target.value),
						"aria-label": t("catalog.sort"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "name",
								children: t("catalog.sortName")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "sku",
								children: t("catalog.sortSku")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "price",
								children: t("catalog.sortPrice")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "stock",
								children: t("catalog.sortStock")
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "mt-6 rounded-xl border border-line bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "cursor-pointer text-sm font-medium",
						children: t("catalog.quick")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: t("catalog.quickHint")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "mt-3",
						value: quick,
						onChange: (e) => setQuick(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							onClick: addQuick,
							children: t("catalog.addLines")
						}), quickMsg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted",
							children: quickMsg
						}) : null]
					})
				]
			}),
			productsQ.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-sm text-muted",
				children: t("common.loading")
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-sm text-muted",
				children: t("catalog.empty")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.sku))
			})
		]
	}) });
}
//#endregion
export { Catalog as component };

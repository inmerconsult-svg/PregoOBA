import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as useI18n, T as roundToCarton, a as Shell, n as Route$1, w as formatEur, y as useCart } from "./router-C5YXss2X.mjs";
import { t as Button } from "./ui-e6pFHy_K.mjs";
import { o as listProducts, r as getProduct } from "./catalog-Cv5ZcB3M.mjs";
import { n as categoryName, o as productName, r as groupImage } from "./catalog-helpers-BokSV_Wl.mjs";
import { n as StockBadge, t as ProductCard } from "./product-card-DYGh2RNl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._sku-BBipVc5U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductPage() {
	const { sku } = Route$1.useParams();
	const { t, lang } = useI18n();
	const add = useCart((s) => s.add);
	const productQ = useQuery({
		queryKey: ["product", sku],
		queryFn: () => getProduct({ data: sku })
	});
	const allQ = useQuery({
		queryKey: ["products"],
		queryFn: () => listProducts()
	});
	const p = productQ.data;
	const [qty, setQty] = (0, import_react.useState)(null);
	if (productQ.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-10 text-sm text-muted",
		children: t("common.loading")
	}) });
	if (!p) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-10 text-sm text-muted",
		children: t("catalog.empty")
	}) });
	const amount = qty ?? p.cartonQty;
	const related = (allQ.data ?? []).filter((x) => x.categoryCode === p.categoryCode && x.sku !== p.sku).slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl bg-ink",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: groupImage(p.group),
				alt: "",
				className: "h-full min-h-80 w-full object-cover opacity-90"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs uppercase tracking-[0.18em] text-muted",
				children: [
					t(`groups.${p.group}`),
					" · ",
					categoryName(p, lang)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-3xl font-medium tracking-tight",
				children: productName(p, lang)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 font-mono text-sm text-muted",
				children: [
					t("product.sku"),
					" ",
					p.sku,
					p.ean ? ` · ${t("product.ean")} ${p.ean}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockBadge, {
					stock: p.stock,
					incoming: p.incoming,
					eta: p.eta
				})
			}),
			p.stock <= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: t("product.backorderNote")
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-xs uppercase tracking-wider text-muted",
				children: t("product.net")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-3xl font-medium tabular-nums",
				children: formatEur(p.netPrice, lang)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					t("product.carton"),
					" ",
					p.cartonQty,
					" ",
					t("product.pcs")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "number",
					min: p.cartonQty,
					step: p.cartonQty,
					value: amount,
					onChange: (e) => setQty(roundToCarton(Number(e.target.value), p.cartonQty)),
					className: "h-11 w-28 rounded-lg border border-line bg-surface px-3 tabular-nums"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						add(p.sku, amount, p.cartonQty);
					},
					children: t("product.add")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/catalog",
				search: { group: p.group },
				className: "mt-8 inline-block text-sm text-muted underline",
				children: t("catalog.title")
			})
		] })]
	}), related.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xl font-medium",
			children: t("product.related")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-4 sm:grid-cols-3",
			children: related.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: r }, r.sku))
		})]
	}) : null] });
}
//#endregion
export { ProductPage as component };

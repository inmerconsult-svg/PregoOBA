import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Plus } from "../_libs/lucide-react.mjs";
import { E as stockLevel, S as useI18n, w as formatEur, y as useCart } from "./router-C5YXss2X.mjs";
import { t as Button } from "./ui-e6pFHy_K.mjs";
import { n as categoryName, o as productName, r as groupImage } from "./catalog-helpers-BokSV_Wl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-card-DYGh2RNl.js
var import_jsx_runtime = require_jsx_runtime();
function StockBadge({ stock, incoming, eta }) {
	const { t } = useI18n();
	const level = stockLevel(stock);
	const label = t(`stock.${level}`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-2 text-xs font-medium",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: level === "ok" ? "size-2 rounded-full bg-stock-ok" : level === "low" ? "size-2 rounded-full bg-stock-low" : "size-2 rounded-full bg-stock-out",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: level === "ok" ? "text-stock-ok" : level === "low" ? "text-stock-low" : "text-stock-out",
				children: label
			}),
			stock <= 0 && incoming && incoming > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-muted",
				children: [
					"· ",
					t("stock.incoming"),
					eta ? ` ${eta}` : ""
				]
			}) : null
		]
	});
}
function ProductCard({ product }) {
	const { lang, t } = useI18n();
	const add = useCart((s) => s.add);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group flex flex-col overflow-hidden rounded-xl border border-line bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/product/$sku",
			params: { sku: product.sku },
			className: "block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-card overflow-hidden bg-ink",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: groupImage(product.group),
						alt: "",
						className: "h-full w-full object-cover opacity-80 transition-transform duration-300 group-hover:scale-[1.03]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-linear-to-t from-ink/70 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs tracking-wide text-paper/90",
							children: product.sku
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-paper/90 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-ink",
							children: categoryName(product, lang)
						})]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-3 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/product/$sku",
					params: { sku: product.sku },
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-medium leading-snug tracking-tight text-ink",
						children: productName(product, lang)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockBadge, {
					stock: product.stock,
					incoming: product.incoming,
					eta: product.eta
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto flex items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wider text-muted",
							children: t("product.net")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium tabular-nums text-ink",
							children: formatEur(product.netPrice, lang)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								t("product.carton"),
								" ",
								product.cartonQty,
								" ",
								t("product.pcs")
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => add(product.sku, product.cartonQty, product.cartonQty),
						"aria-label": t("product.add"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), t("product.add")]
					})]
				})
			]
		})]
	});
}
//#endregion
export { StockBadge as n, ProductCard as t };

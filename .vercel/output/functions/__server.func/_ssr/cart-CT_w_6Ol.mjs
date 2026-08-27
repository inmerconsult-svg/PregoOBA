import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as useI18n, a as Shell, w as formatEur, y as useCart } from "./router-C5YXss2X.mjs";
import { t as Button } from "./ui-e6pFHy_K.mjs";
import { o as listProducts } from "./catalog-Cv5ZcB3M.mjs";
import { o as productName } from "./catalog-helpers-BokSV_Wl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-CT_w_6Ol.js
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const { t, lang } = useI18n();
	const lines = useCart((s) => s.lines);
	const setQty = useCart((s) => s.setQty);
	const remove = useCart((s) => s.remove);
	const clear = useCart((s) => s.clear);
	const products = useQuery({
		queryKey: ["products"],
		queryFn: () => listProducts()
	}).data ?? [];
	const rows = lines.map((l) => {
		const p = products.find((x) => x.sku === l.sku);
		return p ? {
			...l,
			product: p
		} : null;
	}).filter((x) => x != null);
	const net = rows.reduce((s, r) => s + r.qty * r.product.netPrice, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-medium tracking-tight",
				children: t("cart.title")
			}),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-xl border border-line bg-surface p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: t("cart.empty")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/catalog",
					className: "mt-4 inline-block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: t("cart.browse") })
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 overflow-x-auto rounded-xl border border-line bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-lg text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-line text-left text-xs uppercase tracking-wider text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: t("product.sku")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: t("catalog.sortName")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: t("product.pcs")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: t("product.net")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-line last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-mono text-xs",
								children: r.sku
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/product/$sku",
									params: { sku: r.sku },
									className: "hover:underline",
									children: productName(r.product, lang)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									className: "h-9 w-24 rounded-md border border-line px-2 tabular-nums",
									min: r.product.cartonQty,
									step: r.product.cartonQty,
									value: r.qty,
									onChange: (e) => setQty(r.sku, Number(e.target.value), r.product.cartonQty)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 tabular-nums",
								children: formatEur(r.qty * r.product.netPrice, lang)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-xs text-muted hover:text-accent",
									onClick: () => remove(r.sku),
									children: t("admin.remove")
								})
							})
						]
					}, r.sku)) })]
				})
			}),
			rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm text-muted underline",
					onClick: () => clear(),
					children: t("cart.clear")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wider text-muted",
							children: t("cart.subtotal")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl font-medium tabular-nums",
							children: formatEur(net, lang)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/checkout",
							className: "mt-3 inline-block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: t("cart.checkout") })
						})
					]
				})]
			}) : null
		]
	}) });
}
//#endregion
export { CartPage as component };

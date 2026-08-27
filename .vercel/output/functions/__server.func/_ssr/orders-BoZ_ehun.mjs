import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as useI18n, a as Shell, b as RedirectToSignIn, f as listMyOrders, w as formatEur, x as useCurrentUserState } from "./router-C5YXss2X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-BoZ_ehun.js
var import_jsx_runtime = require_jsx_runtime();
function OrdersPage() {
	const { user, isPending } = useCurrentUserState();
	const { t, lang } = useI18n();
	const ordersQ = useQuery({
		queryKey: ["my-orders", user?.id],
		queryFn: () => listMyOrders(),
		enabled: Boolean(user)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-10 text-sm text-muted",
		children: t("common.loading")
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const orders = ordersQ.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl px-4 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl font-medium tracking-tight",
			children: t("orders.title")
		}), orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-8 text-sm text-muted",
			children: t("orders.empty")
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-8 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface",
			children: orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/orders/$id",
				params: { id: String(o.id) },
				className: "flex items-center justify-between gap-4 px-4 py-4 hover:bg-paper",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: o.orderNo
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						o.createdAt.slice(0, 10),
						" · ",
						t(`orders.status.${o.status}`),
						" · ",
						o.items.length,
						" ",
						t("cart.lines", { n: o.items.length })
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "tabular-nums",
					children: formatEur(o.grandTotal, lang)
				})]
			}) }, o.id))
		})]
	}) });
}
//#endregion
export { OrdersPage as component };

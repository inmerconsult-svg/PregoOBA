import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as useI18n, _ as updateProfile, a as Shell, b as RedirectToSignIn, c as ensureProfile, g as submitOrder, w as formatEur, x as useCurrentUserState, y as useCart } from "./router-C5YXss2X.mjs";
import { i as Textarea, n as Field, r as Input, t as Button } from "./ui-e6pFHy_K.mjs";
import { o as listProducts } from "./catalog-Cv5ZcB3M.mjs";
import { o as productName } from "./catalog-helpers-BokSV_Wl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-B0xT0lMm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CheckoutPage() {
	const { user, isPending } = useCurrentUserState();
	const { t, lang } = useI18n();
	const nav = useNavigate();
	const lines = useCart((s) => s.lines);
	const clear = useCart((s) => s.clear);
	const productsQ = useQuery({
		queryKey: ["products"],
		queryFn: () => listProducts()
	});
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [po, setPo] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [reverse, setReverse] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		companyName: "",
		vatNumber: "",
		phone: "",
		deliveryName: "",
		deliveryAddress: "",
		deliveryPostal: "",
		deliveryCity: "",
		deliveryCountry: "FI"
	});
	(0, import_react.useEffect)(() => {
		if (!user) return;
		ensureProfile({ data: {
			email: user.primaryEmail,
			displayName: user.displayName,
			language: lang
		} }).then((p) => {
			setProfile(p);
			setForm({
				companyName: p.companyName,
				vatNumber: p.vatNumber,
				phone: p.phone,
				deliveryName: p.displayName || p.companyName,
				deliveryAddress: p.addressLine,
				deliveryPostal: p.postalCode,
				deliveryCity: p.city,
				deliveryCountry: p.country || "FI"
			});
		});
	}, [user, lang]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-10 text-sm text-muted",
		children: t("common.loading")
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const products = productsQ.data ?? [];
	const rows = lines.map((l) => {
		const p = products.find((x) => x.sku === l.sku);
		return p ? {
			...l,
			product: p
		} : null;
	}).filter((x) => x != null);
	const net = rows.reduce((s, r) => s + r.qty * r.product.netPrice, 0);
	const vatRate = reverse ? 0 : 25.5;
	const vat = Math.round(net * (vatRate / 100) * 100) / 100;
	const grand = net + vat;
	async function onSubmit(e) {
		e.preventDefault();
		if (!rows.length) return;
		setBusy(true);
		try {
			await updateProfile({ data: {
				displayName: profile?.displayName || user?.displayName || "",
				companyName: form.companyName,
				vatNumber: form.vatNumber,
				phone: form.phone,
				addressLine: form.deliveryAddress,
				postalCode: form.deliveryPostal,
				city: form.deliveryCity,
				country: form.deliveryCountry,
				language: lang
			} });
			const res = await submitOrder({ data: {
				lines: rows.map((r) => ({
					sku: r.sku,
					qty: r.qty
				})),
				poNumber: po,
				notes,
				reverseCharge: reverse,
				deliveryName: form.deliveryName,
				deliveryAddress: form.deliveryAddress,
				deliveryPostal: form.deliveryPostal,
				deliveryCity: form.deliveryCity,
				deliveryCountry: form.deliveryCountry
			} });
			clear();
			toast.message(t("checkout.ok", { n: res.orderNo }));
			nav({
				to: "/orders/$id",
				params: { id: String(res.orderId) }
			});
		} catch (err) {
			toast.message(err instanceof Error ? err.message : t("auth.error"));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-5",
		onSubmit,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:col-span-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-medium tracking-tight",
				children: t("checkout.title")
			}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-sm text-muted",
				children: [
					t("cart.empty"),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/catalog",
						className: "underline",
						children: t("cart.browse")
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("account.company"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: form.companyName,
							onChange: (e) => setForm({
								...form,
								companyName: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("account.vat"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.vatNumber,
								onChange: (e) => setForm({
									...form,
									vatNumber: e.target.value
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("account.phone"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.phone,
								onChange: (e) => setForm({
									...form,
									phone: e.target.value
								})
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "pt-2 text-sm font-medium",
						children: t("checkout.delivery")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("account.name"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: form.deliveryName,
							onChange: (e) => setForm({
								...form,
								deliveryName: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("account.address"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: form.deliveryAddress,
							onChange: (e) => setForm({
								...form,
								deliveryAddress: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t("account.postal"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									value: form.deliveryPostal,
									onChange: (e) => setForm({
										...form,
										deliveryPostal: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t("account.city"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									value: form.deliveryCity,
									onChange: (e) => setForm({
										...form,
										deliveryCity: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t("account.country"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									value: form.deliveryCountry,
									onChange: (e) => setForm({
										...form,
										deliveryCountry: e.target.value
									})
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("checkout.po"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: po,
							onChange: (e) => setPo(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("checkout.notes"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: notes,
							onChange: (e) => setNotes(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: reverse,
							onChange: (e) => setReverse(e.target.checked)
						}), t("checkout.reverse")]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "lg:col-span-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-line bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: t("cart.title")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-3 text-sm",
						children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								r.sku,
								" · ",
								productName(r.product, lang),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-xs text-muted",
									children: [
										r.qty,
										" × ",
										formatEur(r.product.netPrice, lang)
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: formatEur(r.qty * r.product.netPrice, lang)
							})]
						}, r.sku))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 space-y-1 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: t("cart.subtotal")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "tabular-nums",
									children: formatEur(net, lang)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: t("checkout.vat", { n: vatRate })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "tabular-nums",
									children: formatEur(vat, lang)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-base font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: t("checkout.total") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "tabular-nums",
									children: formatEur(grand, lang)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "mt-6 w-full",
						disabled: busy || rows.length === 0,
						children: t("checkout.submit")
					})
				]
			})
		})]
	}) });
}
//#endregion
export { CheckoutPage as component };

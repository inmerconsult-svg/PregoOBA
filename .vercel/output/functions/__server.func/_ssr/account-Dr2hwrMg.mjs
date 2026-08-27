import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as useI18n, _ as updateProfile, a as Shell, b as RedirectToSignIn, c as ensureProfile, x as useCurrentUserState } from "./router-C5YXss2X.mjs";
import { n as Field, r as Input, t as Button } from "./ui-e6pFHy_K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-Dr2hwrMg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AccountPage() {
	const { user, isPending } = useCurrentUserState();
	const { t, lang } = useI18n();
	const [form, setForm] = (0, import_react.useState)({
		displayName: "",
		companyName: "",
		vatNumber: "",
		phone: "",
		addressLine: "",
		postalCode: "",
		city: "",
		country: "FI"
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		ensureProfile({ data: {
			email: user.primaryEmail,
			displayName: user.displayName,
			language: lang
		} }).then((p) => {
			setForm({
				displayName: p.displayName,
				companyName: p.companyName,
				vatNumber: p.vatNumber,
				phone: p.phone,
				addressLine: p.addressLine,
				postalCode: p.postalCode,
				city: p.city,
				country: p.country || "FI"
			});
		});
	}, [user, lang]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-10 text-sm text-muted",
		children: t("common.loading")
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			await updateProfile({ data: {
				...form,
				language: lang
			} });
			toast.message(t("account.saved"));
		} catch (err) {
			toast.message(err instanceof Error ? err.message : t("auth.error"));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mx-auto max-w-lg space-y-4 px-4 py-10",
		onSubmit,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-medium tracking-tight",
				children: t("account.title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("account.name"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: form.displayName,
					onChange: (e) => setForm({
						...form,
						displayName: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("account.company"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: form.companyName,
					onChange: (e) => setForm({
						...form,
						companyName: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("account.vat"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: form.vatNumber,
					onChange: (e) => setForm({
						...form,
						vatNumber: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("account.phone"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: form.phone,
					onChange: (e) => setForm({
						...form,
						phone: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("account.address"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: form.addressLine,
					onChange: (e) => setForm({
						...form,
						addressLine: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("account.postal"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.postalCode,
							onChange: (e) => setForm({
								...form,
								postalCode: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("account.city"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.city,
							onChange: (e) => setForm({
								...form,
								city: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("account.country"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.country,
							onChange: (e) => setForm({
								...form,
								country: e.target.value
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: busy,
				children: t("account.save")
			})
		]
	}) });
}
//#endregion
export { AccountPage as component };

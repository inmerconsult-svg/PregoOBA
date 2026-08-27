import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as authClient } from "./client-B40BzJxt.mjs";
import { S as useI18n, _ as updateProfile, a as Shell, c as ensureProfile } from "./router-C5YXss2X.mjs";
import { n as Field, r as Input, t as Button } from "./ui-e6pFHy_K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-ChsMzQbM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Register() {
	const { t, lang } = useI18n();
	const nav = useNavigate();
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		password: "",
		company: "",
		vat: "",
		phone: ""
	});
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		const { error: err } = await authClient.signUp.email({
			email: form.email,
			password: form.password,
			name: form.name
		});
		if (err) {
			setBusy(false);
			setError(err.message ?? t("auth.error"));
			return;
		}
		try {
			await ensureProfile({ data: {
				email: form.email,
				displayName: form.name,
				language: lang
			} });
			await updateProfile({ data: {
				displayName: form.name,
				companyName: form.company,
				vatNumber: form.vat,
				phone: form.phone,
				addressLine: "",
				postalCode: "",
				city: "",
				country: "FI",
				language: lang
			} });
		} catch {}
		setBusy(false);
		nav({ to: "/catalog" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-lg px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-line bg-surface p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-medium tracking-tight",
					children: t("auth.signup")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: t("auth.lead")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-8 space-y-4",
					onSubmit,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("auth.name"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								value: form.name,
								onChange: (e) => setForm({
									...form,
									name: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("account.company"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								value: form.company,
								onChange: (e) => setForm({
									...form,
									company: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("account.vat"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.vat,
								onChange: (e) => setForm({
									...form,
									vat: e.target.value
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
							label: t("auth.email"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								required: true,
								value: form.email,
								onChange: (e) => setForm({
									...form,
									email: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("auth.password"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								required: true,
								minLength: 8,
								value: form.password,
								onChange: (e) => setForm({
									...form,
									password: e.target.value
								})
							})
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-accent",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: busy,
							children: t("auth.signup")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-sm text-muted",
					children: [
						t("auth.hasAccount"),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "font-medium text-ink underline",
							children: t("auth.signin")
						})
					]
				})
			]
		})
	}) });
}
//#endregion
export { Register as component };

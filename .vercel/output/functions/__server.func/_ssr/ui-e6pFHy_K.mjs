import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as cn } from "./router-C5YXss2X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-e6pFHy_K.js
var import_jsx_runtime = require_jsx_runtime();
function Button({ className, variant = "primary", size = "md", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn("inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-40", size === "sm" && "h-9 rounded-md px-3 text-sm", size === "md" && "h-11 rounded-lg px-4 text-sm", size === "lg" && "h-12 rounded-xl px-5 text-base", variant === "primary" && "bg-ink text-paper hover:opacity-90", variant === "secondary" && "border border-line bg-surface text-ink hover:bg-paper", variant === "ghost" && "text-ink hover:bg-line/60", variant === "danger" && "bg-accent text-paper hover:bg-accent-dark", className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink outline-none transition-shadow placeholder:text-muted focus:border-ink focus:ring-2 focus:ring-ink/10", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-24 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none placeholder:text-muted focus:border-ink focus:ring-2 focus:ring-ink/10", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted", className),
		...props
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children] });
}
//#endregion
export { Textarea as i, Field as n, Input as r, Button as t };

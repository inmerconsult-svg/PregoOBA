import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as useI18n, a as Shell, b as RedirectToSignIn, c as ensureProfile, d as listCustomers, h as setOrderStatus, m as setCustomerRole, o as adminListOrders, p as saveSettings, s as adminOverview, u as getSettings, w as formatEur, x as useCurrentUserState } from "./router-C5YXss2X.mjs";
import { n as Field, r as Input, t as Button } from "./ui-e6pFHy_K.mjs";
import { a as listImportLogs, i as importInventory, n as deleteProduct, s as upsertProduct, t as adminListProducts } from "./catalog-Cv5ZcB3M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CkD36OfM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const { user, isPending } = useCurrentUserState();
	const { t, lang } = useI18n();
	const [tab, setTab] = (0, import_react.useState)("overview");
	const [role, setRole] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		ensureProfile({ data: {
			email: user.primaryEmail,
			displayName: user.displayName,
			language: lang
		} }).then((p) => setRole(p.role)).catch(() => setRole(null));
	}, [user, lang]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-10 text-sm text-muted",
		children: t("common.loading")
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (role && role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-10 text-sm text-muted",
		children: "Forbidden"
	}) });
	const tabs = [
		{
			id: "overview",
			label: t("admin.overview")
		},
		{
			id: "products",
			label: t("admin.products")
		},
		{
			id: "import",
			label: t("admin.import")
		},
		{
			id: "orders",
			label: t("admin.orders")
		},
		{
			id: "customers",
			label: t("admin.customers")
		},
		{
			id: "settings",
			label: t("admin.settings")
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-medium tracking-tight",
				children: t("admin.title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: tabs.map((tb) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(tb.id),
					className: `rounded-full border px-3 py-1.5 text-sm ${tab === tb.id ? "border-ink bg-ink text-paper" : "border-line bg-surface"}`,
					children: tb.label
				}, tb.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [
					tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overview, {}),
					tab === "products" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductsAdmin, {}),
					tab === "import" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportAdmin, {}),
					tab === "orders" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrdersAdmin, {}),
					tab === "customers" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomersAdmin, {}),
					tab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsAdmin, {})
				]
			})
		]
	}) });
}
function Overview() {
	const { t } = useI18n();
	const d = useQuery({
		queryKey: ["admin-overview"],
		queryFn: () => adminOverview()
	}).data;
	if (!d) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: t("common.loading")
	});
	const cards = [
		{
			label: t("admin.products"),
			value: d.products
		},
		{
			label: t("admin.orders"),
			value: d.orders
		},
		{
			label: t("orders.status.submitted"),
			value: d.open
		},
		{
			label: t("admin.customers"),
			value: d.customers
		},
		{
			label: t("stock.low"),
			value: d.low
		},
		{
			label: t("stock.out"),
			value: d.out
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-line bg-surface p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-wider text-muted",
					children: c.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-3xl font-medium tabular-nums",
					children: c.value
				})]
			}, c.label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-10 text-lg font-medium",
			children: "Email"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 divide-y divide-line rounded-xl border border-line bg-surface text-sm",
			children: d.emails.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: e.subject
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						e.to_address,
						" · ",
						String(e.created_at).slice(0, 16)
					]
				})]
			}, e.id))
		})
	] });
}
function emptyProduct() {
	return {
		sku: "",
		ean: "",
		nameFi: "",
		nameEn: "",
		nameSv: "",
		nameNo: "",
		nameEt: "",
		categoryCode: "100",
		categoryFi: "",
		categoryEn: "",
		categorySv: "",
		categoryNo: "",
		categoryEt: "",
		group: "kitchen",
		netPrice: 0,
		cartonQty: 1,
		stock: 0,
		incoming: 0,
		reserved: 0,
		backorder: 0,
		eta: null,
		active: true
	};
}
function ProductsAdmin() {
	const { t } = useI18n();
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["admin-products"],
		queryFn: () => adminListProducts()
	});
	const [term, setTerm] = (0, import_react.useState)("");
	const [edit, setEdit] = (0, import_react.useState)(null);
	const products = q.data ?? [];
	const filtered = (0, import_react.useMemo)(() => {
		const n = term.trim().toLowerCase();
		if (!n) return products;
		return products.filter((p) => `${p.sku} ${p.nameFi} ${p.ean ?? ""}`.toLowerCase().includes(n));
	}, [products, term]);
	const save = useMutation({
		mutationFn: (p) => upsertProduct({ data: p }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-products"] });
			qc.invalidateQueries({ queryKey: ["products"] });
			setEdit(null);
			toast.message(t("account.saved"));
		}
	});
	const del = useMutation({
		mutationFn: (sku) => deleteProduct({ data: sku }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-products"] });
			qc.invalidateQueries({ queryKey: ["products"] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "max-w-sm",
				placeholder: t("catalog.search"),
				value: term,
				onChange: (e) => setTerm(e.target.value)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				onClick: () => setEdit(emptyProduct()),
				children: t("admin.addProduct")
			})]
		}),
		edit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-6 grid gap-3 rounded-xl border border-line bg-surface p-5 sm:grid-cols-2",
			onSubmit: (e) => {
				e.preventDefault();
				if (!edit.sku) return;
				save.mutate(edit);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t("product.sku"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: edit.sku,
						onChange: (e) => setEdit({
							...edit,
							sku: e.target.value
						}),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t("product.ean"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: edit.ean ?? "",
						onChange: (e) => setEdit({
							...edit,
							ean: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "FI",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: edit.nameFi,
						onChange: (e) => setEdit({
							...edit,
							nameFi: e.target.value
						}),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "EN",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: edit.nameEn,
						onChange: (e) => setEdit({
							...edit,
							nameEn: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t("product.net"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						step: "0.01",
						value: edit.netPrice,
						onChange: (e) => setEdit({
							...edit,
							netPrice: Number(e.target.value)
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t("product.carton"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: edit.cartonQty,
						onChange: (e) => setEdit({
							...edit,
							cartonQty: Number(e.target.value)
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Stock",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: edit.stock,
						onChange: (e) => setEdit({
							...edit,
							stock: Number(e.target.value)
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Incoming",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: edit.incoming,
						onChange: (e) => setEdit({
							...edit,
							incoming: Number(e.target.value)
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t("admin.products") + " group",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: edit.group,
						onChange: (e) => setEdit({
							...edit,
							group: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Category",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: edit.categoryFi,
						onChange: (e) => setEdit({
							...edit,
							categoryFi: e.target.value,
							categoryEn: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: save.isPending,
						children: t("admin.save")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						onClick: () => setEdit(null),
						children: t("common.cancel")
					})]
				})
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 overflow-x-auto rounded-xl border border-line bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-2xl text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-left text-xs uppercase tracking-wider text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2",
							children: "SKU"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2",
							children: "FI"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2",
							children: t("product.net")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2",
							children: "Stock"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-line",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 font-mono text-xs",
							children: p.sku
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: p.nameFi
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 tabular-nums",
							children: p.netPrice.toFixed(2)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 tabular-nums",
							children: p.stock
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2 text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mr-3 text-xs underline",
								onClick: () => setEdit(p),
								children: "Edit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-xs text-accent underline",
								onClick: () => {
									if (confirm(p.sku)) del.mutate(p.sku);
								},
								children: t("admin.remove")
							})]
						})
					]
				}, p.sku)) })]
			})
		})
	] });
}
function ImportAdmin() {
	const { t } = useI18n();
	const qc = useQueryClient();
	const logs = useQuery({
		queryKey: ["import-logs"],
		queryFn: () => listImportLogs()
	});
	const [deactivate, setDeactivate] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onFile(file) {
		setBusy(true);
		try {
			const text = await file.text();
			const res = await importInventory({ data: {
				filename: file.name,
				text,
				deactivateMissing: deactivate
			} });
			toast.message(t("admin.imported", {
				u: res.updated,
				a: res.added
			}));
			qc.invalidateQueries({ queryKey: ["admin-products"] });
			qc.invalidateQueries({ queryKey: ["products"] });
			qc.invalidateQueries({ queryKey: ["import-logs"] });
		} catch (err) {
			toast.message(err instanceof Error ? err.message : t("auth.error"));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-2xl text-sm text-muted",
			children: t("admin.importLead")
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: "/prego-stock-template.xls",
			className: "mt-3 inline-block text-sm underline",
			download: true,
			children: t("admin.template")
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-6 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface px-4 text-sm text-muted",
			children: [busy ? t("common.loading") : t("admin.drop"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "file",
				accept: ".xls,.xlsx,.csv,.xml,text/xml,application/xml,text/csv",
				className: "hidden",
				onChange: (e) => {
					const f = e.target.files?.[0];
					if (f) onFile(f);
				}
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-4 flex items-center gap-2 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "checkbox",
				checked: deactivate,
				onChange: (e) => setDeactivate(e.target.checked)
			}), t("admin.deactivateMissing")]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-8 divide-y divide-line rounded-xl border border-line bg-surface text-sm",
			children: (logs.data ?? []).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "px-4 py-3",
				children: [
					l.filename,
					" · +",
					l.products_added,
					" / ~",
					l.products_updated,
					" · ",
					String(l.created_at).slice(0, 16)
				]
			}, l.id))
		})
	] });
}
function OrdersAdmin() {
	const { t, lang } = useI18n();
	const qc = useQueryClient();
	const orders = useQuery({
		queryKey: ["admin-orders"],
		queryFn: () => adminListOrders()
	}).data ?? [];
	const statuses = [
		"submitted",
		"confirmed",
		"processing",
		"shipped",
		"cancelled"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-xl border border-line bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-2xl text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "text-left text-xs uppercase tracking-wider text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2",
						children: "No"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2",
						children: t("account.company")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2",
						children: t("checkout.total")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2",
						children: "Status"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-line",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2 font-medium",
						children: o.orderNo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: "px-3 py-2",
						children: [o.companyName, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-muted",
							children: o.email
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2 tabular-nums",
						children: formatEur(o.grandTotal, lang)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-9 rounded-md border border-line bg-surface px-2 text-sm",
							value: o.status,
							onChange: (e) => {
								setOrderStatus({ data: {
									id: o.id,
									status: e.target.value
								} }).then(() => qc.invalidateQueries({ queryKey: ["admin-orders"] }));
							},
							children: statuses.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: s,
								children: t(`orders.status.${s}`)
							}, s))
						})
					})
				]
			}, o.id)) })]
		})
	});
}
function CustomersAdmin() {
	const { t } = useI18n();
	const qc = useQueryClient();
	const customers = useQuery({
		queryKey: ["admin-customers"],
		queryFn: () => listCustomers()
	}).data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-xl border border-line bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-2xl text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "text-left text-xs uppercase tracking-wider text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2",
						children: t("auth.email")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2",
						children: t("account.company")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2",
						children: "Role"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: customers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-line",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: "px-3 py-2",
						children: [c.email, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-muted",
							children: c.displayName
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2",
						children: c.companyName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-9 rounded-md border border-line bg-surface px-2 text-sm",
							value: c.role,
							onChange: (e) => {
								setCustomerRole({ data: {
									userId: c.userId,
									role: e.target.value
								} }).then(() => qc.invalidateQueries({ queryKey: ["admin-customers"] }));
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "pending",
									children: t("admin.role.pending")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "customer",
									children: t("admin.role.customer")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "admin",
									children: t("admin.role.admin")
								})
							]
						})
					})
				]
			}, c.userId)) })]
		})
	});
}
function SettingsAdmin() {
	const { t } = useI18n();
	const q = useQuery({
		queryKey: ["settings"],
		queryFn: () => getSettings()
	});
	const [form, setForm] = (0, import_react.useState)({
		orderEmail: "",
		vatRate: "25.5",
		companyName: ""
	});
	(0, import_react.useEffect)(() => {
		if (!q.data) return;
		setForm({
			orderEmail: q.data.order_email ?? "",
			vatRate: q.data.vat_rate ?? "25.5",
			companyName: q.data.company_name ?? ""
		});
	}, [q.data]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "max-w-lg space-y-4",
		onSubmit: (e) => {
			e.preventDefault();
			saveSettings({ data: form }).then(() => toast.message(t("account.saved")));
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("admin.orderEmail"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "email",
					value: form.orderEmail,
					onChange: (e) => setForm({
						...form,
						orderEmail: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("admin.vatRate"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: form.vatRate,
					onChange: (e) => setForm({
						...form,
						vatRate: e.target.value
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				children: t("admin.save")
			})
		]
	});
}
//#endregion
export { AdminPage as component };

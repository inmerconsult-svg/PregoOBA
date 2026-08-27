import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { S as useRouter, _ as createFileRoute, b as Navigate, d as HeadContent, f as useRouterState, g as lazyRouteComponent, h as Outlet, m as createRouter, u as Scripts, v as createRootRoute, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { i as signOut, t as authClient } from "./client-B40BzJxt.mjs";
import { t as authMiddleware } from "./middleware-D532eKDl.mjs";
import { n as auth } from "./server-CfgXpA7G.mjs";
import { a as Menu, n as TriangleAlert, r as ShoppingBag, t as X } from "../_libs/lucide-react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-C5YXss2X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var LANGS = [
	{
		id: "fi",
		label: "Suomi"
	},
	{
		id: "en",
		label: "English"
	},
	{
		id: "sv",
		label: "Svenska"
	},
	{
		id: "no",
		label: "Norsk"
	},
	{
		id: "et",
		label: "Eesti"
	}
];
function formatEur(n, lang = "fi") {
	const locale = lang === "en" ? "en-GB" : lang === "sv" ? "sv-SE" : lang === "no" ? "nb-NO" : lang === "et" ? "et-EE" : "fi-FI";
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency: "EUR",
		minimumFractionDigits: 2
	}).format(n);
}
function stockLevel(stock) {
	if (stock <= 0) return "out";
	if (stock <= 10) return "low";
	return "ok";
}
function roundToCarton(qty, carton) {
	const c = Math.max(1, carton || 1);
	if (qty <= 0) return c;
	return Math.ceil(qty / c) * c;
}
var fi = {
	"brand.sub": "B2B-tilausportaali",
	"brand.line": "Keittiö · Koti · Kauneus · Hyvinvointi · Lääkintä · Elektroniikka",
	"nav.catalog": "Tuotteet",
	"nav.orders": "Tilaukset",
	"nav.account": "Tili",
	"nav.admin": "Ylläpito",
	"nav.cart": "Ostoskori",
	"nav.login": "Kirjaudu",
	"nav.register": "Avaa tili",
	"nav.logout": "Kirjaudu ulos",
	"hero.title": "Tukkutilaukset ilman kassahässäkkää.",
	"hero.lead": "Prego-kumppaneille: selaa valikoimaa, kokoa myyntierät ja lähetä tilaus käsiteltäväksi. Maksu hoidetaan laskulla — portaali ei peri korttimaksuja.",
	"hero.cta": "Selaa valikoimaa",
	"hero.secondary": "Avaa yritystili",
	"how.title": "Näin tilaus etenee",
	"how.1.t": "Kirjaudu",
	"how.1.d": "Yritystili, Y-tunnus ja toimitustiedot. Ensimmäinen tili on ylläpitäjä.",
	"how.2.t": "Kokoa tilaus",
	"how.2.d": "Hinnat verottomina. Määrät myyntierän kerrannaisina.",
	"how.3.t": "Lähetä",
	"how.3.d": "Tilaus menee sähköpostitse myyntiin. Et maksa verkossa.",
	"how.4.t": "Vahvistus",
	"how.4.d": "Käsittelijä vahvistaa saatavuuden ja toimitusajan.",
	"groups.kitchen": "Keittiö",
	"groups.household": "Koti",
	"groups.beauty": "Kauneus",
	"groups.wellness": "Hyvinvointi",
	"groups.medical": "Lääkintä",
	"groups.electronics": "Elektroniikka",
	"stock.ok": "Varastossa",
	"stock.low": "Vähän jäljellä",
	"stock.out": "Loppu",
	"stock.incoming": "Tulossa",
	"catalog.title": "Tuotevalikoima",
	"catalog.search": "Hae nimellä, SKU:lla tai EAN:illa",
	"catalog.quick": "Pikatilaus",
	"catalog.quickHint": "SKU ja määrä, yksi rivi per tuote. Esim. P932 12",
	"catalog.addLines": "Lisää koriin",
	"catalog.all": "Kaikki",
	"catalog.sort": "Järjestä",
	"catalog.sortName": "Nimi",
	"catalog.sortSku": "SKU",
	"catalog.sortPrice": "Hinta",
	"catalog.sortStock": "Saatavuus",
	"catalog.empty": "Ei tuotteita hakuehdoilla.",
	"catalog.count": "{n} tuotetta",
	"product.net": "Veroton hinta",
	"product.carton": "Myyntierä",
	"product.pcs": "kpl",
	"product.add": "Lisää koriin",
	"product.added": "Lisätty",
	"product.ean": "EAN",
	"product.sku": "Tuotekoodi",
	"product.related": "Saman ryhmän tuotteet",
	"product.backorderNote": "Ei vapaata saldoa — tilaus käsitellään jälkitoimituksena tai saapuvan erän mukaan.",
	"cart.title": "Ostoskori",
	"cart.empty": "Kori on tyhjä.",
	"cart.browse": "Siirry valikoimaan",
	"cart.checkout": "Jatka tilaukseen",
	"cart.clear": "Tyhjennä",
	"cart.subtotal": "Veroton yhteensä",
	"cart.lines": "{n} riviä",
	"checkout.title": "Lähetä tilaus",
	"checkout.needLogin": "Kirjaudu lähettääksesi tilauksen.",
	"checkout.po": "Ostotilausnumero (valinnainen)",
	"checkout.notes": "Tilausviesti",
	"checkout.delivery": "Toimitusosoite",
	"checkout.reverse": "EU-käännetty verovelvollisuus (ALV 0 %)",
	"checkout.submit": "Lähetä tilaus",
	"checkout.vat": "ALV {n} %",
	"checkout.total": "Yhteensä",
	"checkout.ok": "Tilaus {n} lähetetty. Saat vahvistuksen, kun se on käsitelty.",
	"orders.title": "Tilaukseni",
	"orders.empty": "Ei tilauksia vielä.",
	"orders.status.submitted": "Lähetetty",
	"orders.status.confirmed": "Vahvistettu",
	"orders.status.processing": "Käsittelyssä",
	"orders.status.shipped": "Toimitettu",
	"orders.status.cancelled": "Peruttu",
	"account.title": "Yritystili",
	"account.company": "Yritys",
	"account.vat": "Y-tunnus / VAT",
	"account.phone": "Puhelin",
	"account.address": "Osoite",
	"account.postal": "Postinumero",
	"account.city": "Kaupunki",
	"account.country": "Maa",
	"account.name": "Yhteyshenkilö",
	"account.save": "Tallenna",
	"account.saved": "Tallennettu",
	"auth.welcome": "Kirjaudu Prego B2B:hen",
	"auth.lead": "Hinnat ja tilaus vain kirjautuneille kumppaneille.",
	"auth.email": "Sähköposti",
	"auth.password": "Salasana",
	"auth.name": "Nimi",
	"auth.signin": "Kirjaudu",
	"auth.signup": "Luo tili",
	"auth.or": "tai jatka",
	"auth.noAccount": "Ei tiliä?",
	"auth.hasAccount": "Onko sinulla jo tili?",
	"auth.error": "Kirjautuminen epäonnistui",
	"admin.title": "Ylläpito",
	"admin.overview": "Yhteenveto",
	"admin.products": "Tuotteet",
	"admin.import": "Varastoexcel",
	"admin.orders": "Tilaukset",
	"admin.customers": "Asiakkaat",
	"admin.settings": "Asetukset",
	"admin.importLead": "Lataa samanmuotoinen tuoteraportti (.xls SpreadsheetML tai CSV). Päivittää saldot, hinnat ja myyntierät SKU:n mukaan.",
	"admin.drop": "Pudota tiedosto tai valitse",
	"admin.template": "Lataa malli",
	"admin.deactivateMissing": "Piilota SKU:t joita ei ole tiedostossa",
	"admin.imported": "Päivitetty {u}, lisätty {a}",
	"admin.orderEmail": "Tilausten sähköposti",
	"admin.vatRate": "ALV-%",
	"admin.confirm": "Vahvista",
	"admin.role.admin": "Ylläpitäjä",
	"admin.role.customer": "Asiakas",
	"admin.role.pending": "Odottaa",
	"admin.addProduct": "Lisää tuote",
	"admin.remove": "Poista",
	"admin.save": "Tallenna",
	"footer.op": "Operoi Inbound Finland Oy",
	"footer.prices": "Hinnat EUR, alv 0 (veroton). Myyntierät noudattavat tukkuerää.",
	"common.loading": "Ladataan…",
	"common.cancel": "Peruuta",
	"common.close": "Sulje",
	"common.search": "Haku"
};
var en = {
	"brand.sub": "B2B order portal",
	"brand.line": "Kitchen · Household · Beauty · Wellness · Medical · Electronics",
	"nav.catalog": "Products",
	"nav.orders": "Orders",
	"nav.account": "Account",
	"nav.admin": "Admin",
	"nav.cart": "Cart",
	"nav.login": "Sign in",
	"nav.register": "Open account",
	"nav.logout": "Sign out",
	"hero.title": "Wholesale orders without a checkout circus.",
	"hero.lead": "For Prego partners: browse the range, build carton multiples and send the order for processing. Payment is invoiced — this portal never takes cards.",
	"hero.cta": "Browse the range",
	"hero.secondary": "Open a company account",
	"how.title": "How an order moves",
	"how.1.t": "Sign in",
	"how.1.d": "Company account, VAT number and delivery details. The first account becomes admin.",
	"how.2.t": "Build the order",
	"how.2.d": "Net prices. Quantities in carton multiples.",
	"how.3.t": "Send",
	"how.3.d": "The order is emailed to sales. You do not pay online.",
	"how.4.t": "Confirmation",
	"how.4.d": "A handler confirms availability and lead time.",
	"groups.kitchen": "Kitchen",
	"groups.household": "Household",
	"groups.beauty": "Beauty",
	"groups.wellness": "Wellness",
	"groups.medical": "Medical",
	"groups.electronics": "Electronics",
	"stock.ok": "In stock",
	"stock.low": "Low stock",
	"stock.out": "Out of stock",
	"stock.incoming": "Incoming",
	"catalog.title": "Product range",
	"catalog.search": "Search by name, SKU or EAN",
	"catalog.quick": "Quick order",
	"catalog.quickHint": "SKU and quantity, one line per product. e.g. P932 12",
	"catalog.addLines": "Add to cart",
	"catalog.all": "All",
	"catalog.sort": "Sort",
	"catalog.sortName": "Name",
	"catalog.sortSku": "SKU",
	"catalog.sortPrice": "Price",
	"catalog.sortStock": "Availability",
	"catalog.empty": "No products match.",
	"catalog.count": "{n} products",
	"product.net": "Net price",
	"product.carton": "Carton",
	"product.pcs": "pcs",
	"product.add": "Add to cart",
	"product.added": "Added",
	"product.ean": "EAN",
	"product.sku": "SKU",
	"product.related": "In the same group",
	"product.backorderNote": "No free stock — the line will be treated as a backorder or against incoming goods.",
	"cart.title": "Cart",
	"cart.empty": "Your cart is empty.",
	"cart.browse": "Go to the range",
	"cart.checkout": "Continue to order",
	"cart.clear": "Clear",
	"cart.subtotal": "Net total",
	"cart.lines": "{n} lines",
	"checkout.title": "Submit order",
	"checkout.needLogin": "Sign in to submit an order.",
	"checkout.po": "Purchase order no. (optional)",
	"checkout.notes": "Order message",
	"checkout.delivery": "Delivery address",
	"checkout.reverse": "EU reverse charge (VAT 0%)",
	"checkout.submit": "Submit order",
	"checkout.vat": "VAT {n}%",
	"checkout.total": "Total",
	"checkout.ok": "Order {n} submitted. You will receive a confirmation once it is processed.",
	"orders.title": "My orders",
	"orders.empty": "No orders yet.",
	"orders.status.submitted": "Submitted",
	"orders.status.confirmed": "Confirmed",
	"orders.status.processing": "Processing",
	"orders.status.shipped": "Shipped",
	"orders.status.cancelled": "Cancelled",
	"account.title": "Company account",
	"account.company": "Company",
	"account.vat": "VAT / business ID",
	"account.phone": "Phone",
	"account.address": "Address",
	"account.postal": "Postal code",
	"account.city": "City",
	"account.country": "Country",
	"account.name": "Contact person",
	"account.save": "Save",
	"account.saved": "Saved",
	"auth.welcome": "Sign in to Prego B2B",
	"auth.lead": "Prices and ordering are for signed-in partners.",
	"auth.email": "Email",
	"auth.password": "Password",
	"auth.name": "Name",
	"auth.signin": "Sign in",
	"auth.signup": "Create account",
	"auth.or": "or continue with",
	"auth.noAccount": "No account?",
	"auth.hasAccount": "Already have an account?",
	"auth.error": "Sign-in failed",
	"admin.title": "Admin",
	"admin.overview": "Overview",
	"admin.products": "Products",
	"admin.import": "Stock Excel",
	"admin.orders": "Orders",
	"admin.customers": "Customers",
	"admin.settings": "Settings",
	"admin.importLead": "Upload a product report in the same format (.xls SpreadsheetML or CSV). Updates stock, prices and carton sizes by SKU.",
	"admin.drop": "Drop a file or browse",
	"admin.template": "Download template",
	"admin.deactivateMissing": "Hide SKUs not present in the file",
	"admin.imported": "Updated {u}, added {a}",
	"admin.orderEmail": "Order notification email",
	"admin.vatRate": "VAT %",
	"admin.confirm": "Confirm",
	"admin.role.admin": "Admin",
	"admin.role.customer": "Customer",
	"admin.role.pending": "Pending",
	"admin.addProduct": "Add product",
	"admin.remove": "Remove",
	"admin.save": "Save",
	"footer.op": "Operated by Inbound Finland Oy",
	"footer.prices": "Prices in EUR, net of VAT. Quantities follow wholesale cartons.",
	"common.loading": "Loading…",
	"common.cancel": "Cancel",
	"common.close": "Close",
	"common.search": "Search"
};
var TABLES = {
	fi,
	en,
	sv: {
		...en,
		"brand.sub": "B2B-beställningsportal",
		"nav.catalog": "Produkter",
		"nav.orders": "Beställningar",
		"nav.account": "Konto",
		"nav.cart": "Varukorg",
		"nav.login": "Logga in",
		"nav.register": "Öppna konto",
		"nav.logout": "Logga ut",
		"hero.title": "Grossistbeställningar utan kassakaos.",
		"hero.lead": "För Prego-partners: bläddra sortimentet, bygg förpackningsmultiplar och skicka ordern för hantering. Betalning sker mot faktura.",
		"hero.cta": "Bläddra sortimentet",
		"hero.secondary": "Öppna företagskonto",
		"how.title": "Så går ordern",
		"stock.ok": "I lager",
		"stock.low": "Få kvar",
		"stock.out": "Slut",
		"stock.incoming": "På ingående",
		"catalog.title": "Sortiment",
		"catalog.search": "Sök namn, SKU eller EAN",
		"product.net": "Nettopris",
		"product.carton": "Förpackning",
		"product.add": "Lägg i korgen",
		"cart.title": "Varukorg",
		"cart.empty": "Korgen är tom.",
		"cart.checkout": "Fortsätt till order",
		"checkout.title": "Skicka order",
		"checkout.submit": "Skicka order",
		"orders.title": "Mina ordrar",
		"account.title": "Företagskonto",
		"account.company": "Företag",
		"auth.welcome": "Logga in på Prego B2B",
		"auth.signin": "Logga in",
		"auth.signup": "Skapa konto",
		"admin.title": "Admin",
		"groups.kitchen": "Kök",
		"groups.household": "Hem",
		"groups.beauty": "Skönhet",
		"groups.wellness": "Wellness",
		"groups.medical": "Medicinskt",
		"groups.electronics": "Elektronik",
		"footer.op": "Drivs av Inbound Finland Oy"
	},
	no: {
		...en,
		"brand.sub": "B2B-bestillingsportal",
		"nav.catalog": "Produkter",
		"nav.orders": "Ordre",
		"nav.account": "Konto",
		"nav.cart": "Handlekurv",
		"nav.login": "Logg inn",
		"nav.register": "Åpne konto",
		"nav.logout": "Logg ut",
		"hero.title": "Engrosordre uten kassekaos.",
		"hero.lead": "For Prego-partnere: bla i sortimentet, bygg emballasjemultipler og send ordren til behandling. Betaling skjer mot faktura.",
		"hero.cta": "Se sortimentet",
		"hero.secondary": "Åpne bedriftskonto",
		"how.title": "Slik går ordren",
		"stock.ok": "På lager",
		"stock.low": "Få igjen",
		"stock.out": "Utsolgt",
		"stock.incoming": "På vei",
		"catalog.title": "Sortiment",
		"product.net": "Nettopris",
		"product.carton": "Emballasje",
		"product.add": "Legg i kurv",
		"cart.title": "Handlekurv",
		"cart.empty": "Kurven er tom.",
		"cart.checkout": "Fortsett til ordre",
		"checkout.title": "Send ordre",
		"checkout.submit": "Send ordre",
		"orders.title": "Mine ordre",
		"account.title": "Bedriftskonto",
		"account.company": "Selskap",
		"auth.welcome": "Logg inn på Prego B2B",
		"auth.signin": "Logg inn",
		"auth.signup": "Opprett konto",
		"groups.kitchen": "Kjøkken",
		"groups.household": "Hjem",
		"groups.beauty": "Skjønnhet",
		"groups.wellness": "Velvære",
		"groups.medical": "Medisinsk",
		"groups.electronics": "Elektronikk",
		"footer.op": "Drevet av Inbound Finland Oy"
	},
	et: {
		...en,
		"brand.sub": "B2B tellimisportaal",
		"nav.catalog": "Tooted",
		"nav.orders": "Tellimused",
		"nav.account": "Konto",
		"nav.cart": "Ostukorv",
		"nav.login": "Logi sisse",
		"nav.register": "Ava konto",
		"nav.logout": "Logi välja",
		"hero.title": "Hulgimüügi tellimused ilma kassata.",
		"hero.lead": "Prego partneritele: sirvi valikut, kogu müügikastid ja saada tellimus töötlusesse. Tasumine toimub arvega.",
		"hero.cta": "Sirvi valikut",
		"hero.secondary": "Ava ettevõttekonto",
		"how.title": "Kuidas tellimus liigub",
		"stock.ok": "Laos",
		"stock.low": "Vähe jäänud",
		"stock.out": "Otsas",
		"stock.incoming": "Teel",
		"catalog.title": "Tootevalik",
		"product.net": "Netohind",
		"product.carton": "Müügipakk",
		"product.add": "Lisa korvi",
		"cart.title": "Ostukorv",
		"cart.empty": "Korv on tühi.",
		"cart.checkout": "Jätka tellimusega",
		"checkout.title": "Saada tellimus",
		"checkout.submit": "Saada tellimus",
		"orders.title": "Minu tellimused",
		"account.title": "Ettevõttekonto",
		"account.company": "Ettevõte",
		"auth.welcome": "Logi Prego B2B-sse",
		"auth.signin": "Logi sisse",
		"auth.signup": "Loo konto",
		"groups.kitchen": "Köök",
		"groups.household": "Kodu",
		"groups.beauty": "Ilu",
		"groups.wellness": "Heaolu",
		"groups.medical": "Meditsiin",
		"groups.electronics": "Elektroonika",
		"footer.op": "Haldab Inbound Finland Oy"
	}
};
var I18nCtx = (0, import_react.createContext)(null);
function I18nProvider({ children }) {
	const [lang, setLangState] = (0, import_react.useState)("fi");
	(0, import_react.useEffect)(() => {
		try {
			const s = localStorage.getItem("prego-lang");
			if (s && LANGS.some((l) => l.id === s)) setLangState(s);
		} catch {}
	}, []);
	const setLang = (l) => {
		setLangState(l);
		try {
			localStorage.setItem("prego-lang", l);
		} catch {}
	};
	const t = (0, import_react.useMemo)(() => {
		const table = TABLES[lang];
		return (key, vars) => {
			let s = table[key] ?? TABLES.en[key] ?? key;
			if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
			return s;
		};
	}, [lang]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nCtx.Provider, {
		value: {
			lang,
			setLang,
			t
		},
		children
	});
}
function useI18n() {
	const ctx = (0, import_react.useContext)(I18nCtx);
	if (!ctx) throw new Error("I18nProvider missing");
	return ctx;
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Render children only once we KNOW the visitor is signed out (`isPending` has
* cleared and there is no user). Hidden while the session is still loading.
*/
function SignedOut({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending || user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
var useCart = create()(persist((set, get) => ({
	lines: [],
	add: (sku, qty, carton) => {
		const next = roundToCarton(qty, carton);
		const lines = [...get().lines];
		const i = lines.findIndex((l) => l.sku === sku);
		if (i >= 0) lines[i] = {
			sku,
			qty: roundToCarton(lines[i].qty + next, carton)
		};
		else lines.push({
			sku,
			qty: next
		});
		set({ lines });
	},
	setQty: (sku, qty, carton) => {
		if (qty <= 0) {
			set({ lines: get().lines.filter((l) => l.sku !== sku) });
			return;
		}
		set({ lines: get().lines.map((l) => l.sku === sku ? {
			sku,
			qty: roundToCarton(qty, carton)
		} : l) });
	},
	remove: (sku) => set({ lines: get().lines.filter((l) => l.sku !== sku) }),
	clear: () => set({ lines: [] })
}), { name: "prego-cart" }));
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var ensureProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("7b7770099683f908676587ddb7f7cb351d215486140add7c3b1e123c6d2f8c0b"));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("1a9ebb2bf20ca3d40dfc43a60576647b3703244988c8901a91e8fdf54449171d"));
var listCustomers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9e9057ba5802657511544213826e3583e78868e5c1011ee09d2f10205d63fe6b"));
var setCustomerRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("a3ce2aa9cc58b9d05668e954e7905aac2e15fa6445df4c6f0eb2dbde7fde03db"));
var submitOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("70c599788dbc2aed83f908f326fab1bb1e4b632ea3bd88662f85456b7cecb5a5"));
var listMyOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3d504ad47cf26f6058e8d5f7055d28aafb29ac9b3324490542dad038cc9237e6"));
var getOrder = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("c3d790ec40c833220a52f0cd6f87054520c1ee7c5596369e7965c0bf1f1bfa38"));
var adminListOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("5d33b9af65cb928361020ce22d4bcb349a87fe17d80c012d2a535bc668841f56"));
var setOrderStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("65c594ffeb850e83a58c2c01d4430f510d859d677782d0123b06d7dbb91b17e8"));
var getSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("8475ca470bc8e8b51dc66e9d097439d5257d961423f2c3477cfb9a11d91432e8"));
var saveSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("98c3ae98fd3233a2b4f1885d3e217a277f517a67ccf0ebbe249d7796f82d809c"));
var adminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("00e42519efb45b5e14ffd8900a1f4559de2e5500e61d6c2aebbdffb71ece1793"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("da1dd9608ae602def23f246421ba9d86389a24fcefda2aaad9b76119193fc63b"));
function Shell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function Header() {
	const { t, lang, setLang } = useI18n();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
	(0, import_react.useEffect)(() => setMounted(true), []);
	(0, import_react.useEffect)(() => setOpen(false), [pathname]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex min-w-0 items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/prego-logo.webp",
						alt: "Prego",
						className: "h-8 w-auto"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden text-xs uppercase tracking-widest text-muted lg:block",
						children: t("brand.sub")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-6 text-sm font-medium md:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/catalog",
						className: "hover:text-accent",
						children: t("nav.catalog")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SignedIn, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/orders",
							className: "hover:text-accent",
							children: t("nav.orders")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/account",
							className: "hover:text-accent",
							children: t("nav.account")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLink, { label: t("nav.admin") })
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 sm:gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-0.5 text-xs font-medium",
							children: LANGS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setLang(l.id),
								className: lang === l.id ? "rounded-md bg-ink px-1.5 py-1 text-paper" : "rounded-md px-1.5 py-1 text-muted hover:text-ink",
								children: l.id.toUpperCase()
							}, l.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/cart",
							className: "relative grid size-11 place-items-center rounded-lg hover:bg-line/50",
							"aria-label": t("nav.cart"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5" }), mounted && count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-xs font-semibold text-paper",
								children: count
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {
							loginLabel: t("nav.login"),
							mounted
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-11 place-items-center rounded-lg md:hidden",
							onClick: () => setOpen((v) => !v),
							"aria-label": "Menu",
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						})
					]
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-line px-4 py-3 md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 text-sm font-medium",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/catalog",
						children: t("nav.catalog")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SignedIn, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/orders",
							children: t("nav.orders")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/account",
							children: t("nav.account")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLink, { label: t("nav.admin") })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SignedOut, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						children: t("nav.login")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/register",
						children: t("nav.register")
					})] })
				]
			})
		}) : null]
	});
}
function AuthSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden h-9 w-20 rounded-lg bg-line sm:block" });
}
function AuthSlot({ loginLabel, mounted }) {
	const { user, isPending } = useCurrentUserState();
	if (!mounted || isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/login",
		className: "hidden h-9 items-center rounded-lg border border-line px-3 text-sm font-medium sm:flex",
		children: loginLabel
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountChip, {});
}
function AccountChip() {
	const user = useCurrentUser();
	const { t } = useI18n();
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hidden items-center gap-2 sm:flex",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/account",
			className: "max-w-32 truncate text-sm font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "text-xs text-muted hover:text-ink",
			disabled: busy,
			onClick: () => {
				setBusy(true);
				signOut().catch(() => setBusy(false));
			},
			children: t("nav.logout")
		})]
	});
}
function AdminLink({ label }) {
	const { user, isPending } = useCurrentUserState();
	const [role, setRole] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		ensureProfile({ data: {
			email: user.primaryEmail,
			displayName: user.displayName
		} }).then((p) => setRole(p.role)).catch(() => setRole(null));
	}, [user]);
	if (isPending || role !== "admin") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/admin",
		className: "hover:text-accent",
		children: label
	});
}
function Footer() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-16 border-t border-line",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/prego-logo.webp",
				alt: "Prego",
				className: "h-7 w-auto"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-sm text-sm text-muted",
				children: t("brand.line")
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("footer.op") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1",
					children: t("footer.prices")
				})]
			})]
		})
	});
}
function ProfileSync() {
	const { user } = useCurrentUserState();
	const { lang } = useI18n();
	(0, import_react.useEffect)(() => {
		if (!user) return;
		ensureProfile({ data: {
			email: user.primaryEmail,
			displayName: user.displayName,
			language: lang
		} }).catch(() => void 0);
	}, [user, lang]);
	return null;
}
var styles_default = "/assets/styles-FaY_WDh4.css";
var APP_NAME = "Prego B2B";
var Route$12 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#141414"
			},
			{
				name: "description",
				content: "Prego B2B partner portal — wholesale orders for kitchen, household, beauty, wellness, medical and electronics."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	const [queryClient] = (0, import_react.useState)(() => new QueryClient());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "fi",
		suppressHydrationWarning: true,
		className: "antialiased",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
				client: queryClient,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileSync, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
						position: "top-right",
						richColors: false
					})
				]
			}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$10 = () => import("./routes-zcepmFTY.mjs");
var Route$11 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./account-Dr2hwrMg.mjs");
var Route$10 = createFileRoute("/account")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./admin-CkD36OfM.mjs");
var Route$9 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./cart-CT_w_6Ol.mjs");
var Route$8 = createFileRoute("/cart")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./catalog-1sYoiW1K.mjs");
var Route$7 = createFileRoute("/catalog")({
	validateSearch: (s) => ({
		group: typeof s.group === "string" ? s.group : void 0,
		q: typeof s.q === "string" ? s.q : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./checkout-B0xT0lMm.mjs");
var Route$6 = createFileRoute("/checkout")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./login-BzTTrfdS.mjs");
var Route$5 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./orders-BoZ_ehun.mjs");
var Route$4 = createFileRoute("/orders")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./register-ChsMzQbM.mjs");
var Route$3 = createFileRoute("/register")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./orders._id-_iXnRDwc.mjs");
var Route$2 = createFileRoute("/orders/$id")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./product._sku-BBipVc5U.mjs");
var Route$1 = createFileRoute("/product/$sku")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var IndexRoute = Route$11.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$12
});
var AccountRoute = Route$10.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => Route$12
});
var AdminRoute = Route$9.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$12
});
var CartRoute = Route$8.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$12
});
var CatalogRoute = Route$7.update({
	id: "/catalog",
	path: "/catalog",
	getParentRoute: () => Route$12
});
var CheckoutRoute = Route$6.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$12
});
var LoginRoute = Route$5.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$12
});
var OrdersRoute = Route$4.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => Route$12
});
var RegisterRoute = Route$3.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$12
});
var OrdersIdRoute = Route$2.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => OrdersRoute
});
var ProductSkuRoute = Route$1.update({
	id: "/product/$sku",
	path: "/product/$sku",
	getParentRoute: () => Route$12
});
var ApiAuthSplatRoute = Route.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$12
});
var OrdersRouteChildren = { OrdersIdRoute };
var rootRouteChildren = {
	IndexRoute,
	AccountRoute,
	AdminRoute,
	CartRoute,
	CatalogRoute,
	CheckoutRoute,
	LoginRoute,
	OrdersRoute: OrdersRoute._addFileChildren(OrdersRouteChildren),
	RegisterRoute,
	ProductSkuRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { cn as C, stockLevel as E, useI18n as S, roundToCarton as T, updateProfile as _, Shell as a, RedirectToSignIn as b, ensureProfile as c, listCustomers as d, listMyOrders as f, submitOrder as g, setOrderStatus as h, Route$7 as i, getOrder as l, setCustomerRole as m, Route$1 as n, adminListOrders as o, saveSettings as p, Route$2 as r, adminOverview as s, router_exports as t, getSettings as u, createSsrRpc as v, formatEur as w, useCurrentUserState as x, useCart as y };

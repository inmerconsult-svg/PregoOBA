import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-D532eKDl.mjs";
import { v as createSsrRpc } from "./router-C5YXss2X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-Cv5ZcB3M.js
var listProducts = createServerFn({ method: "GET" }).handler(createSsrRpc("2f3cb902609e50ac96044f7e96228fa2f59f70d4c357ba5479010af2a225aea2"));
var getProduct = createServerFn({ method: "GET" }).validator((sku) => sku).handler(createSsrRpc("156b687369b554bbe5eac173a37fb87e373f38706d45f3e72a364fbc9126b6f3"));
var adminListProducts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("53116ca225076ed86944b86f9de2c9cdcc763a754bf62971027bfde3918e68bd"));
var upsertProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((p) => p).handler(createSsrRpc("7f62f859e64ed1146e3ffa17ef378eb3cc1b638b8a87edd607491b7b9ac16943"));
var deleteProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((sku) => sku).handler(createSsrRpc("d6eeef7b0d95b10bf5d10a020a920628a8a2dca9176d9ee3549af392e9e37229"));
var importInventory = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("901fa75ed2bb41a3e165acfa634657a875ce4474ad8b67795ef572822fb3859a"));
var listImportLogs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("05956527fec7fa2bad707e9f72f1622dc70dcd2cf4199641135c95f16716685c"));
//#endregion
export { listImportLogs as a, importInventory as i, deleteProduct as n, listProducts as o, getProduct as r, upsertProduct as s, adminListProducts as t };

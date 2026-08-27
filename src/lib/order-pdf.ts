import { PDFDocument, rgb } from "pdf-lib";
import type { Order } from "./types";

const INK = rgb(0.08, 0.08, 0.08);
const MUTED = rgb(0.42, 0.41, 0.39);
const LINE = rgb(0.89, 0.87, 0.84);
const ACCENT = rgb(0.88, 0.16, 0.09);

let fontCache: { regular: ArrayBuffer; bold: ArrayBuffer } | null = null;

async function loadFonts() {
  if (fontCache) return fontCache;
  const [regular, bold] = await Promise.all([
    fetch("/fonts/LiberationSans-Regular.ttf").then((r) => r.arrayBuffer()),
    fetch("/fonts/LiberationSans-Bold.ttf").then((r) => r.arrayBuffer()),
  ]);
  fontCache = { regular, bold };
  return fontCache;
}

function money(n: number) {
  return `${n.toFixed(2).replace(".", ",")} €`;
}

function wrap(text: string, font: { widthOfTextAtSize: (t: string, s: number) => number }, size: number, max: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (font.widthOfTextAtSize(next, size) <= max) cur = next;
    else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

export function orderPdfFilename(o: Order): string {
  const company = o.companyName.replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim() || "tilaus";
  return `Prego-tilaus-${o.orderNo}-${company}.pdf`;
}

export async function buildOrderPdf(o: Order): Promise<Uint8Array> {
  const fonts = await loadFonts();
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(fonts.regular);
  const bold = await doc.embedFont(fonts.bold);
  const page = doc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const left = 48;
  const right = width - 48;
  let y = height - 48;

  page.drawText("PREGO B2B", { x: left, y, size: 11, font: bold, color: INK });
  page.drawText("TILAUS / ORDER", { x: right - bold.widthOfTextAtSize("TILAUS / ORDER", 11), y, size: 11, font: bold, color: ACCENT });
  y -= 18;
  page.drawText(o.orderNo, { x: left, y, size: 18, font: bold, color: INK });
  const date = o.createdAt.slice(0, 16).replace("T", " ");
  page.drawText(date, { x: right - regular.widthOfTextAtSize(date, 10), y: y + 4, size: 10, font: regular, color: MUTED });
  y -= 10;
  page.drawRectangle({ x: left, y, width: right - left, height: 2, color: ACCENT });
  y -= 28;

  const colW = (right - left - 24) / 2;
  page.drawText("Tilaaja", { x: left, y, size: 8, font: bold, color: MUTED });
  page.drawText("Toimitus", { x: left + colW + 24, y, size: 8, font: bold, color: MUTED });
  y -= 14;

  const buyer = [
    o.companyName || "—",
    o.vatNumber ? `Y-tunnus ${o.vatNumber}` : "",
    o.email,
    o.phone,
    o.poNumber ? `Ostotilaus ${o.poNumber}` : "",
  ].filter(Boolean);
  const ship = [
    o.deliveryName,
    o.deliveryAddress,
    `${o.deliveryPostal} ${o.deliveryCity}`.trim(),
    o.deliveryCountry,
  ].filter(Boolean);

  const startY = y;
  let by = y;
  for (const line of buyer) {
    page.drawText(line, { x: left, y: by, size: 10, font: line === o.companyName ? bold : regular, color: INK });
    by -= 13;
  }
  let sy = startY;
  for (const line of ship) {
    page.drawText(line, { x: left + colW + 24, y: sy, size: 10, font: sy === startY ? bold : regular, color: INK });
    sy -= 13;
  }
  y = Math.min(by, sy) - 18;

  const cols = [
    { k: "sku", x: left, w: 70, label: "SKU", align: "left" as const },
    { k: "name", x: left + 70, w: 230, label: "Tuote", align: "left" as const },
    { k: "qty", x: left + 300, w: 50, label: "Kpl", align: "right" as const },
    { k: "unit", x: left + 350, w: 80, label: "À-hinta", align: "right" as const },
    { k: "sum", x: left + 430, w: right - (left + 430), label: "Yhteensä", align: "right" as const },
  ];
  page.drawText(cols[0].label, { x: cols[0].x, y, size: 8, font: bold, color: MUTED });
  page.drawText(cols[1].label, { x: cols[1].x, y, size: 8, font: bold, color: MUTED });
  for (const c of cols.slice(2)) {
    const tw = bold.widthOfTextAtSize(c.label, 8);
    page.drawText(c.label, { x: c.x + c.w - tw, y, size: 8, font: bold, color: MUTED });
  }
  y -= 6;
  page.drawLine({ start: { x: left, y }, end: { x: right, y }, thickness: 0.6, color: LINE });
  y -= 14;

  for (const item of o.items) {
    const nameLines = wrap(item.name, regular, 9, cols[1].w - 6);
    const rowH = Math.max(14, nameLines.length * 11);
    if (y - rowH < 80) break;
    page.drawText(item.sku, { x: cols[0].x, y, size: 8, font: regular, color: MUTED });
    nameLines.forEach((ln, i) => {
      page.drawText(ln, { x: cols[1].x, y: y - i * 11, size: 9, font: regular, color: INK });
    });
    const qty = String(item.qty);
    page.drawText(qty, { x: cols[2].x + cols[2].w - regular.widthOfTextAtSize(qty, 9), y, size: 9, font: regular, color: INK });
    const unit = money(item.unitPrice);
    page.drawText(unit, { x: cols[3].x + cols[3].w - regular.widthOfTextAtSize(unit, 9), y, size: 9, font: regular, color: INK });
    const sum = money(item.lineTotal);
    page.drawText(sum, { x: cols[4].x + cols[4].w - regular.widthOfTextAtSize(sum, 9), y, size: 9, font: regular, color: INK });
    y -= rowH;
  }

  y -= 8;
  page.drawLine({ start: { x: left, y }, end: { x: right, y }, thickness: 0.6, color: LINE });
  y -= 18;

  const totals = [
    ["Veroton", money(o.netTotal)],
    [o.reverseCharge ? "ALV 0 % (käännetty)" : `ALV ${o.vatRate} %`, money(o.vatTotal)],
    ["Yhteensä", money(o.grandTotal)],
  ];
  for (const [label, val] of totals) {
    const isGrand = label === "Yhteensä";
    const f = isGrand ? bold : regular;
    page.drawText(label, { x: left + 300, y, size: isGrand ? 11 : 9, font: f, color: INK });
    page.drawText(val, { x: right - f.widthOfTextAtSize(val, isGrand ? 11 : 9), y, size: isGrand ? 11 : 9, font: f, color: INK });
    y -= isGrand ? 16 : 14;
  }

  if (o.notes) {
    y -= 10;
    page.drawText("Viesti", { x: left, y, size: 8, font: bold, color: MUTED });
    y -= 13;
    for (const ln of wrap(o.notes, regular, 9, right - left)) {
      if (y < 56) break;
      page.drawText(ln, { x: left, y, size: 9, font: regular, color: INK });
      y -= 12;
    }
  }

  page.drawLine({ start: { x: left, y: 42 }, end: { x: right, y: 42 }, thickness: 0.6, color: LINE });
  page.drawText("Myynti ja sivuston operointi: Suomen 585 Oy  ·  Maahantuonti: Inbound Finland Oy", {
    x: left,
    y: 28,
    size: 7,
    font: regular,
    color: MUTED,
  });
  page.drawText("Hinnat EUR, alv 0 ellei toisin ilmoitettu. Tämä on tilausvahvistus, ei lasku.", {
    x: left,
    y: 18,
    size: 7,
    font: regular,
    color: MUTED,
  });

  return doc.save();
}

export async function downloadOrderPdf(o: Order) {
  const bytes = await buildOrderPdf(o);
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = orderPdfFilename(o);
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

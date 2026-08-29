import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { toast } from "sonner";
import type { Order } from "./types";

const INK = rgb(0.08, 0.08, 0.08);
const MUTED = rgb(0.42, 0.41, 0.39);
const LINE = rgb(0.89, 0.87, 0.84);
const ACCENT = rgb(0.88, 0.16, 0.09);

type PdfFont = { widthOfTextAtSize: (t: string, s: number) => number };

function money(n: number) {
  return `${n.toFixed(2).replace(".", ",")} EUR`;
}

function wrap(text: string, font: PdfFont, size: number, max: number) {
  const words = String(text || "").split(/\s+/);
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
  const company = (o.companyName || "tilaus").replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim();
  return `Prego-tilaus-${o.orderNo}-${company}.pdf`;
}

async function embedFonts(doc: PDFDocument) {
  try {
    const [regRes, boldRes] = await Promise.all([
      fetch("/fonts/LiberationSans-Regular.ttf"),
      fetch("/fonts/LiberationSans-Bold.ttf"),
    ]);
    if (regRes.ok && boldRes.ok) {
      return {
        regular: await doc.embedFont(await regRes.arrayBuffer()),
        bold: await doc.embedFont(await boldRes.arrayBuffer()),
      };
    }
  } catch {
    /* use built-in fonts */
  }
  return {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
  };
}

export async function buildOrderPdf(o: Order): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const { regular, bold } = await embedFonts(doc);
  const page = doc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const left = 48;
  const right = width - 48;
  let y = height - 48;

  const text = (s: string, x: number, yy: number, size: number, font: typeof regular, color = INK) => {
    page.drawText(String(s ?? ""), { x, y: yy, size, font, color });
  };

  text("PREGO B2B", left, y, 11, bold);
  const title = "TILAUS / ORDER";
  text(title, right - bold.widthOfTextAtSize(title, 11), y, 11, bold, ACCENT);
  y -= 18;
  text(o.orderNo, left, y, 18, bold);
  const date = String(o.createdAt || "").slice(0, 16).replace("T", " ");
  text(date, right - regular.widthOfTextAtSize(date, 10), y + 4, 10, regular, MUTED);
  y -= 10;
  page.drawRectangle({ x: left, y, width: right - left, height: 2, color: ACCENT });
  y -= 28;

  const colW = (right - left - 24) / 2;
  text("Tilaaja", left, y, 8, bold, MUTED);
  text("Toimitus", left + colW + 24, y, 8, bold, MUTED);
  y -= 14;

  const buyer = [
    o.companyName || "-",
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
    text(line, left, by, 10, line === o.companyName ? bold : regular);
    by -= 13;
  }
  let sy = startY;
  for (const line of ship) {
    text(line, left + colW + 24, sy, 10, sy === startY ? bold : regular);
    sy -= 13;
  }
  y = Math.min(by, sy) - 18;

  const cols = [
    { x: left, w: 70, label: "SKU" },
    { x: left + 70, w: 230, label: "Tuote" },
    { x: left + 300, w: 50, label: "Kpl" },
    { x: left + 350, w: 80, label: "a-hinta" },
    { x: left + 430, w: right - (left + 430), label: "Yhteensa" },
  ];
  text(cols[0].label, cols[0].x, y, 8, bold, MUTED);
  text(cols[1].label, cols[1].x, y, 8, bold, MUTED);
  for (const c of cols.slice(2)) {
    text(c.label, c.x + c.w - bold.widthOfTextAtSize(c.label, 8), y, 8, bold, MUTED);
  }
  y -= 6;
  page.drawLine({ start: { x: left, y }, end: { x: right, y }, thickness: 0.6, color: LINE });
  y -= 14;

  for (const item of o.items ?? []) {
    const label = item.preorder ? `${item.name} (ENNAKKO)` : item.name;
    const nameLines = wrap(label, regular, 9, cols[1].w - 6);
    const rowH = Math.max(14, nameLines.length * 11);
    if (y - rowH < 80) break;
    text(item.sku, cols[0].x, y, 8, regular, MUTED);
    nameLines.forEach((ln, i) => text(ln, cols[1].x, y - i * 11, 9, regular));
    const qty = String(item.qty);
    text(qty, cols[2].x + cols[2].w - regular.widthOfTextAtSize(qty, 9), y, 9, regular);
    const unit = money(item.unitPrice);
    text(unit, cols[3].x + cols[3].w - regular.widthOfTextAtSize(unit, 9), y, 9, regular);
    const sum = money(item.lineTotal);
    text(sum, cols[4].x + cols[4].w - regular.widthOfTextAtSize(sum, 9), y, 9, regular);
    y -= rowH;
  }

  y -= 8;
  page.drawLine({ start: { x: left, y }, end: { x: right, y }, thickness: 0.6, color: LINE });
  y -= 18;

  const totals: [string, string][] = [
    ["Veroton", money(o.netTotal)],
    [o.reverseCharge ? "ALV 0 % (kaannetty)" : `ALV ${o.vatRate} %`, money(o.vatTotal)],
    ["Yhteensa", money(o.grandTotal)],
  ];
  for (const [label, val] of totals) {
    const isGrand = label === "Yhteensa";
    const f = isGrand ? bold : regular;
    text(label, left + 300, y, isGrand ? 11 : 9, f);
    text(val, right - f.widthOfTextAtSize(val, isGrand ? 11 : 9), y, isGrand ? 11 : 9, f);
    y -= isGrand ? 16 : 14;
  }

  if ((o.items ?? []).some((i) => i.preorder)) {
    y -= 10;
    const note =
      "ENNAKKO: Tilauksella on tuotteita jotka saapuvat varastoon myohemmin. Varastossa olevat tuotteet lahetetaan osatoimituksena heti.";
    for (const ln of wrap(note, regular, 8, right - left)) {
      if (y < 56) break;
      text(ln, left, y, 8, regular, ACCENT);
      y -= 11;
    }
  }

  if (o.notes) {
    y -= 10;
    text("Viesti", left, y, 8, bold, MUTED);
    y -= 13;
    for (const ln of wrap(o.notes, regular, 9, right - left)) {
      if (y < 56) break;
      text(ln, left, y, 9, regular);
      y -= 12;
    }
  }

  page.drawLine({ start: { x: left, y: 42 }, end: { x: right, y: 42 }, thickness: 0.6, color: LINE });
  text("Myynti ja sivuston operointi: Suomen 585 Oy  |  Maahantuonti: Inbound Finland Oy", left, 28, 7, regular, MUTED);
  text("Hinnat EUR, alv 0 ellei toisin ilmoitettu. Tama on tilausvahvistus, ei lasku.", left, 18, 7, regular, MUTED);

  return doc.save();
}

export async function downloadOrderPdf(o: Order) {
  try {
    const bytes = await buildOrderPdf(o);
    const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = orderPdfFilename(o);
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  } catch (err) {
    console.error("[prego-pdf]", err);
    toast.message(err instanceof Error ? err.message : "PDF-lataus epaonnistui");
    throw err;
  }
}

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { auth } from "@/lib/auth/server";
import { getSql } from "@/lib/db";

const SAFE = /^[A-Za-z0-9._-]{1,80}$/;

function fileName(raw: string): string | null {
  const base = decodeURIComponent(raw || "").split("/").pop() || "";
  const name = base.toLowerCase().endsWith(".pdf") ? base : `${base}.pdf`;
  if (!SAFE.test(name)) return null;
  return name;
}

async function readPdf(name: string): Promise<Buffer | null> {
  const roots = [
    join(process.cwd(), "private", "datasheets"),
    join(process.cwd(), "public", "datasheets"),
  ];
  for (const root of roots) {
    const path = join(root, name);
    if (!path.startsWith(root)) continue;
    if (existsSync(path)) return readFile(path);
  }
  return null;
}

export async function serveDatasheet(request: Request, rawName: string): Promise<Response> {
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user?.id;
  if (!userId) {
    const login = new URL("/login", request.url);
    login.searchParams.set("redirect", request.url);
    return Response.redirect(login.toString(), 302);
  }

  const sql = await getSql();
  const rows = await sql<{ role: string }>`select role from profiles where user_id = ${userId}`;
  const role = rows[0]?.role;
  if (role !== "admin" && role !== "customer") {
    return Response.redirect(new URL("/pending", request.url).toString(), 302);
  }

  const name = fileName(rawName);
  if (!name) return new Response("Not found", { status: 404 });
  const buf = await readPdf(name);
  if (!buf) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(buf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

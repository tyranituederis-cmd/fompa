import type { Session } from "next-auth";
import { NextResponse } from "next/server";
import { getAdminClient } from "./supabase/admin";
import { roleAtLeast } from "./utils";

/** Cek apakah sesi punya role minimal tertentu */
export function hasRole(session: Session | null, minimum: string) {
  return roleAtLeast(session?.user?.role, minimum);
}

/** Response 401 bila belum login */
export function unauthorized() {
  return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
}

/** Response 403 bila role tidak cukup */
export function forbidden() {
  return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
}

/** Response 400 validasi gagal */
export function badRequest(message = "Data tidak valid") {
  return NextResponse.json({ error: message }, { status: 400 });
}

/** Response 500 */
export function serverError(error?: unknown) {
  console.error("[API Error]", error);
  return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
}

/** CSRF: pastikan Origin/Sec-Fetch-Site berasal dari domain sendiri untuk method non-GET */
export function csrfCheck(req: Request) {
  const method = req.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return true;
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Catat aktivitas ke tabel activity_logs */
export async function logActivity(params: {
  userId?: string | null;
  aksi: string;
  entitas: string;
  entitasId?: string | null;
  meta?: Record<string, unknown> | null;
}) {
  const { userId, aksi, entitas, entitasId, meta } = params;
  try {
    await getAdminClient().from("activity_logs").insert({
      user_id: userId ?? null,
      aksi,
      entitas,
      entitas_id: entitasId ?? null,
      meta: meta ?? null,
    });
  } catch (e) {
    console.error("logActivity gagal", e);
  }
}

/** Broadcast notifikasi ke semua user aktif */
export async function broadcastNotification(params: {
  judul: string;
  pesan?: string | null;
  tipe: string;
  link?: string | null;
}) {
  const { judul, pesan, tipe, link } = params;
  try {
    await getAdminClient().from("notifikasi").insert({
      judul,
      pesan: pesan ?? null,
      tipe,
      link: link ?? null,
    });
  } catch (e) {
    console.error("broadcastNotification gagal", e);
  }
}

/** Pagination helper: parse limit/offset dari URL */
export function getPagination(url: string, defaultLimit = 10) {
  const { searchParams } = new URL(url);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") ?? String(defaultLimit), 10) || defaultLimit, 1), 100);
  const page = Math.max(parseInt(searchParams.get("page") ?? "1", 10) || 1, 1);
  const offset = (page - 1) * limit;
  return { limit, page, offset };
}

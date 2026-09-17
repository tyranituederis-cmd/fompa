import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { badRequest, broadcastNotification, csrfCheck, forbidden, getPagination, hasRole, logActivity, serverError, unauthorized } from "@/lib/api-helpers";
import { beritaSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

/** GET — daftar berita (publik: hanya published; admin: semua) */
export async function GET(req: Request) {
  const session = await getSession();
  const isAdmin = hasRole(session, "admin");
  const { limit, offset } = getPagination(req.url, 12);
  const { searchParams } = new URL(req.url);
  const kategori = searchParams.get("kategori");
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  const supabase = getAdminClient();
  let query = supabase.from("berita").select("*, kategori_berita(nama), users(name)", { count: "exact" });

  if (!isAdmin) {
    query = query.eq("status", "published");
  } else if (status) {
    query = query.eq("status", status);
  }
  if (kategori) query = query.eq("kategori_id", kategori);
  if (q) query = query.ilike("judul", `%${q}%`);

  const { data, error, count } = await query.order("published_at", { ascending: false, nullsFirst: false }).range(offset, offset + limit - 1);
  if (error) return serverError(error);

  const items = (data ?? []).map((b) => ({
    ...b,
    kategori: (b.kategori_berita as { nama?: string } | null)?.nama ?? null,
    penulis: (b.users as { name?: string } | null)?.name ?? null,
    kategori_berita: undefined,
    users: undefined,
  }));

  return NextResponse.json({ data: items, count, limit, page: offset / limit + 1 });
}

/** POST — tulis berita (admin+) */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!hasRole(session, "admin")) return forbidden();
  if (!csrfCheck(req)) return NextResponse.json({ error: "CSRF tidak valid" }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest();
  }
  const parsed = beritaSchema.safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.errors[0]?.message);

  const supabase = getAdminClient();
  let slug = slugify(parsed.data.judul);
  const { data: dup } = await supabase.from("berita").select("id").eq("slug", slug).maybeSingle();
  if (dup) slug = `${slug}-${Date.now().toString(36)}`;

  const { data, error } = await supabase
    .from("berita")
    .insert({
      ...parsed.data,
      slug,
      penulis_id: session.user.uid,
      published_at: parsed.data.status === "published" ? new Date().toISOString() : parsed.data.published_at,
    })
    .select()
    .single();
  if (error) return serverError(error);

  await logActivity({ userId: session.user.uid, aksi: "membuat", entitas: "berita", entitasId: data.id, meta: { judul: data.judul } });
  if (data.status === "published") {
    await broadcastNotification({ judul: "Berita baru: " + data.judul, pesan: data.ringkasan, tipe: "berita", link: `/berita/${data.slug}` });
  }
  return NextResponse.json({ data }, { status: 201 });
}

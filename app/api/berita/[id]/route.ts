import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { badRequest, csrfCheck, forbidden, hasRole, logActivity, serverError, unauthorized } from "@/lib/api-helpers";
import { beritaSchema } from "@/lib/validators";

/** GET — detail berita (draft hanya untuk admin) */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const isAdmin = hasRole(session, "admin");
  const supabase = getAdminClient();
  const { data, error } = await supabase.from("berita").select("*").eq("id", id).maybeSingle();
  if (error) return serverError(error);
  if (!data) return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 });
  if (!isAdmin && data.status !== "published") {
    return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ data });
}

/** PUT — perbarui berita (admin+) */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
  const parsed = beritaSchema.partial().safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.errors[0]?.message);

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("berita")
    .update({
      ...parsed.data,
      published_at: parsed.data.status === "published" && !parsed.data.published_at ? new Date().toISOString() : parsed.data.published_at,
    })
    .eq("id", id)
    .select()
    .single();
  if (error) return serverError(error);

  await logActivity({ userId: session.user.uid, aksi: "memperbarui", entitas: "berita", entitasId: id, meta: { judul: data.judul } });
  return NextResponse.json({ data });
}

/** DELETE — hapus berita (admin+) */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return unauthorized();
  if (!hasRole(session, "admin")) return forbidden();
  if (!csrfCheck(req)) return NextResponse.json({ error: "CSRF tidak valid" }, { status: 403 });

  const supabase = getAdminClient();
  const { error } = await supabase.from("berita").delete().eq("id", id);
  if (error) return serverError(error);

  await logActivity({ userId: session.user.uid, aksi: "menghapus", entitas: "berita", entitasId: id });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { badRequest, csrfCheck, forbidden, hasRole, logActivity, serverError, unauthorized } from "@/lib/api-helpers";
import { pengurusSchema } from "@/lib/validators";

/** PUT — perbarui pengurus (admin+ atau pemilik profil) */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return unauthorized();
  if (!csrfCheck(req)) return NextResponse.json({ error: "CSRF tidak valid" }, { status: 403 });

  const supabase = getAdminClient();
  const { data: existing } = await supabase.from("pengurus").select("user_id").eq("id", id).maybeSingle();
  const isOwner = existing?.user_id === session.user.uid;

  // Pengurus biasa hanya boleh ubah profil sendiri; admin bisa semua
  if (!hasRole(session, "admin") && !isOwner) return forbidden();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest();
  }
  const parsed = pengurusSchema.partial().safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.errors[0]?.message);

  const { data, error } = await supabase.from("pengurus").update(parsed.data).eq("id", id).select().single();
  if (error) return serverError(error);

  await logActivity({ userId: session.user.uid, aksi: "memperbarui", entitas: "pengurus", entitasId: id, meta: { nama: data.nama } });
  return NextResponse.json({ data });
}

/** DELETE — hapus pengurus (admin+) */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return unauthorized();
  if (!hasRole(session, "admin")) return forbidden();
  if (!csrfCheck(req)) return NextResponse.json({ error: "CSRF tidak valid" }, { status: 403 });

  const supabase = getAdminClient();
  const { error } = await supabase.from("pengurus").delete().eq("id", id);
  if (error) return serverError(error);

  await logActivity({ userId: session.user.uid, aksi: "menghapus", entitas: "pengurus", entitasId: id });
  return NextResponse.json({ ok: true });
}

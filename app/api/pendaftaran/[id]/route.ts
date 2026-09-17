import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { csrfCheck, forbidden, hasRole, logActivity, serverError, unauthorized } from "@/lib/api-helpers";

/** PUT — ubah status pendaftaran (admin+) */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return unauthorized();
  if (!hasRole(session, "admin")) return forbidden();
  if (!csrfCheck(req)) return NextResponse.json({ error: "CSRF tidak valid" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  if (!["pending", "diterima", "ditolak"].includes(body.status)) {
    return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
  }

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("pendaftaran")
    .update({ status: body.status })
    .eq("id", id)
    .select("id, nama_lengkap, status")
    .single();
  if (error) return serverError(error);
  await logActivity({ userId: session.user.uid, aksi: "memperbarui", entitas: "pendaftaran", entitasId: id, meta: { status: body.status } });
  return NextResponse.json({ data });
}

/** DELETE — hapus pendaftaran (admin+) */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return unauthorized();
  if (!hasRole(session, "admin")) return forbidden();
  if (!csrfCheck(req)) return NextResponse.json({ error: "CSRF tidak valid" }, { status: 403 });

  const supabase = getAdminClient();
  const { error } = await supabase.from("pendaftaran").delete().eq("id", id);
  if (error) return serverError(error);
  await logActivity({ userId: session.user.uid, aksi: "menghapus", entitas: "pendaftaran", entitasId: id });
  return NextResponse.json({ ok: true });
}

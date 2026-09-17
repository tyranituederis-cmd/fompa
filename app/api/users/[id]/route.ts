import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { csrfCheck, forbidden, hasRole, logActivity, serverError, unauthorized } from "@/lib/api-helpers";

/** PUT — ubah role/status user (admin+); ganti password (pemilik atau admin) */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return unauthorized();
  if (!csrfCheck(req)) return NextResponse.json({ error: "CSRF tidak valid" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const supabase = getAdminClient();
  const isSelf = session.user.uid === id;
  const isAdmin = hasRole(session, "admin");

  const updates: Record<string, unknown> = {};
  if (body.role) {
    if (!isAdmin) return forbidden();
    const { data: role } = await supabase.from("roles").select("id").eq("name", body.role).maybeSingle();
    if (!role) return NextResponse.json({ error: "Role tidak valid" }, { status: 400 });
    updates.role_id = role.id;
  }
  if (body.status !== undefined) {
    if (!isAdmin) return forbidden();
    updates.status = body.status;
  }
  if (body.name) updates.name = body.name;
  if (body.password) {
    if (!isSelf && !isAdmin) return forbidden();
    if (String(body.password).length < 8) return NextResponse.json({ error: "Password minimal 8 karakter" }, { status: 400 });
    updates.password_hash = await bcrypt.hash(String(body.password), 10);
  }

  const { data, error } = await supabase.from("users").update(updates).eq("id", id).select("id, email, name").single();
  if (error) return serverError(error);
  await logActivity({ userId: session.user.uid, aksi: "memperbarui", entitas: "user", entitasId: id, meta: { email: data.email } });
  return NextResponse.json({ data });
}

/** DELETE — hapus user (super admin) */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return unauthorized();
  if (session.user.role !== "super_admin") return forbidden();
  if (!csrfCheck(req)) return NextResponse.json({ error: "CSRF tidak valid" }, { status: 403 });

  const supabase = getAdminClient();
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) return serverError(error);
  await logActivity({ userId: session.user.uid, aksi: "menghapus", entitas: "user", entitasId: id });
  return NextResponse.json({ ok: true });
}

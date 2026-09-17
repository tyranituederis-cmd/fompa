import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { csrfCheck, forbidden, hasRole, logActivity, serverError, unauthorized } from "@/lib/api-helpers";
import { agendaSchema } from "@/lib/validators";

/** GET — detail agenda */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getAdminClient();
  const { data, error } = await supabase.from("agenda").select("*").eq("id", id).maybeSingle();
  if (error) return serverError(error);
  if (!data) return NextResponse.json({ error: "Agenda tidak ditemukan" }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return unauthorized();
  if (!hasRole(session, "admin")) return forbidden();
  if (!csrfCheck(req)) return NextResponse.json({ error: "CSRF tidak valid" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = agendaSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });

  const supabase = getAdminClient();
  const { data, error } = await supabase.from("agenda").update(parsed.data).eq("id", id).select().single();
  if (error) return serverError(error);
  await logActivity({ userId: session.user.uid, aksi: "memperbarui", entitas: "agenda", entitasId: id, meta: { judul: data.judul } });
  return NextResponse.json({ data });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return unauthorized();
  if (!hasRole(session, "admin")) return forbidden();
  if (!csrfCheck(req)) return NextResponse.json({ error: "CSRF tidak valid" }, { status: 403 });

  const supabase = getAdminClient();
  const { error } = await supabase.from("agenda").delete().eq("id", id);
  if (error) return serverError(error);
  await logActivity({ userId: session.user.uid, aksi: "menghapus", entitas: "agenda", entitasId: id });
  return NextResponse.json({ ok: true });
}

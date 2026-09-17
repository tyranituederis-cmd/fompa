import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { badRequest, csrfCheck, forbidden, hasRole, logActivity, serverError, unauthorized } from "@/lib/api-helpers";
import { programSchema } from "@/lib/validators";

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
  const parsed = programSchema.partial().safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.errors[0]?.message);

  const supabase = getAdminClient();
  const { data, error } = await supabase.from("program_kerja").update(parsed.data).eq("id", id).select().single();
  if (error) return serverError(error);
  await logActivity({ userId: session.user.uid, aksi: "memperbarui", entitas: "program", entitasId: id, meta: { nama: data.nama } });
  return NextResponse.json({ data });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return unauthorized();
  if (!hasRole(session, "admin")) return forbidden();
  if (!csrfCheck(req)) return NextResponse.json({ error: "CSRF tidak valid" }, { status: 403 });

  const supabase = getAdminClient();
  const { error } = await supabase.from("program_kerja").delete().eq("id", id);
  if (error) return serverError(error);
  await logActivity({ userId: session.user.uid, aksi: "menghapus", entitas: "program", entitasId: id });
  return NextResponse.json({ ok: true });
}

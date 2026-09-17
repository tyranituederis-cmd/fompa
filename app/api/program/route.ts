import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { badRequest, broadcastNotification, csrfCheck, forbidden, hasRole, logActivity, serverError, unauthorized } from "@/lib/api-helpers";
import { programSchema } from "@/lib/validators";

export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase.from("program_kerja").select("*").order("created_at", { ascending: false });
  if (error) return serverError(error);
  return NextResponse.json({ data });
}

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
  const parsed = programSchema.safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.errors[0]?.message);

  const supabase = getAdminClient();
  const { data, error } = await supabase.from("program_kerja").insert(parsed.data).select().single();
  if (error) return serverError(error);

  await logActivity({ userId: session.user.uid, aksi: "membuat", entitas: "program", entitasId: data.id, meta: { nama: data.nama } });
  await broadcastNotification({ judul: "Program kerja baru: " + data.nama, pesan: data.kategori, tipe: "info", link: `/program-kerja/${data.id}` });
  return NextResponse.json({ data }, { status: 201 });
}

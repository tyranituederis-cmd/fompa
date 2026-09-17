import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { badRequest, broadcastNotification, csrfCheck, forbidden, hasRole, logActivity, serverError, unauthorized } from "@/lib/api-helpers";
import { agendaSchema } from "@/lib/validators";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const upcoming = searchParams.get("upcoming");
  const supabase = getAdminClient();

  let query = supabase.from("agenda").select("*");
  if (upcoming === "true") query = query.gte("tanggal", new Date().toISOString());

  const { data, error } = await query.order("tanggal");
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
  const parsed = agendaSchema.safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.errors[0]?.message);

  const supabase = getAdminClient();
  const { data, error } = await supabase.from("agenda").insert(parsed.data).select().single();
  if (error) return serverError(error);
  await logActivity({ userId: session.user.uid, aksi: "membuat", entitas: "agenda", entitasId: data.id, meta: { judul: data.judul } });
  await broadcastNotification({ judul: "Agenda baru: " + data.judul, pesan: data.lokasi, tipe: "agenda", link: "/agenda" });
  return NextResponse.json({ data }, { status: 201 });
}

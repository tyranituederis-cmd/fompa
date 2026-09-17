import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { csrfCheck, serverError, unauthorized } from "@/lib/api-helpers";

/** GET — riwayat presensi saya pada agenda tertentu, atau semua (admin) */
export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  const { searchParams } = new URL(req.url);
  const agendaId = searchParams.get("agenda_id");

  const supabase = getAdminClient();
  let query = supabase.from("presensi").select("*, users(name), agenda(judul, tanggal)");
  if (agendaId) query = query.eq("agenda_id", agendaId);

  if (!agendaId) {
    query = query.eq("user_id", session.user.uid);
  } else {
    // Untuk laporan admin: tampilkan semua; untuk pengurus: hanya miliknya
    const { data: roleRow } = await supabase.from("users").select("roles(name)").eq("id", session.user.uid).maybeSingle();
    const isAdmin = ["admin", "super_admin", "koordinator_bidang"].includes((roleRow?.roles as { name?: string } | null)?.name ?? "");
    if (!isAdmin) query = query.eq("user_id", session.user.uid);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return serverError(error);

  const items = (data ?? []).map((p) => ({
    ...p,
    user_name: (p.users as { name?: string } | null)?.name ?? null,
    users: undefined,
  }));

  if (agendaId && items.length === 1 && items[0].user_id === session.user.uid) {
    return NextResponse.json({ record: items[0] });
  }
  return NextResponse.json({ data: items });
}

/** POST — isi presensi (pengurus login) */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!csrfCheck(req)) return NextResponse.json({ error: "CSRF tidak valid" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const agendaId = String(body.agenda_id ?? "");
  const status = ["hadir", "izin", "sakit", "alpha"].includes(body.status) ? body.status : "hadir";
  if (!agendaId) return NextResponse.json({ error: "Agenda wajib diisi" }, { status: 400 });

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("presensi")
    .upsert({ agenda_id: agendaId, user_id: session.user.uid, status, catatan: body.catatan ?? null }, { onConflict: "agenda_id,user_id" })
    .select()
    .single();
  if (error) return serverError(error);
  return NextResponse.json({ data }, { status: 201 });
}

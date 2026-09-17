import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { csrfCheck, forbidden, hasRole, logActivity, serverError, unauthorized } from "@/lib/api-helpers";

/**
 * POST — generate e-sertifikat untuk peserta yang hadir pada agenda.
 * Body opsional: { peserta_name? } → buat untuk satu peserta.
 * Tanpa body: buat otomatis untuk semua peserta berstatus hadir/izin.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return unauthorized();
  if (!hasRole(session, "admin")) return forbidden();
  if (!csrfCheck(req)) return NextResponse.json({ error: "CSRF tidak valid" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const supabase = getAdminClient();

  const { data: agenda } = await supabase.from("agenda").select("judul").eq("id", id).maybeSingle();
  if (!agenda) return NextResponse.json({ error: "Agenda tidak ditemukan" }, { status: 404 });

  let peserta: { name: string }[] = [];
  if (body.peserta_name) {
    peserta = [{ name: String(body.peserta_name) }];
  } else {
    const { data: rows } = await supabase
      .from("presensi")
      .select("users(name)")
      .eq("agenda_id", id)
      .in("status", ["hadir", "izin"]);
    peserta = (rows ?? [])
      .map((r) => (r.users as { name?: string } | null)?.name)
      .filter((n): n is string => Boolean(n))
      .map((name) => ({ name }));
  }

  if (peserta.length === 0) {
    return NextResponse.json({ error: "Tidak ada peserta untuk disertifikasi" }, { status: 400 });
  }

  const inserted: { id: string; peserta_name: string; nomor: string }[] = [];
  for (const p of peserta) {
    const nomor = `FOMPA-${new Date().getFullYear()}-${randomUUID().slice(0, 6).toUpperCase()}`;
    const { data, error } = await supabase
      .from("sertifikat")
      .insert({ agenda_id: id, peserta_name: p.name, nomor })
      .select("id, peserta_name, nomor")
      .single();
    if (error) return serverError(error);
    inserted.push(data);
  }

  await logActivity({
    userId: session.user.uid,
    aksi: "membuat",
    entitas: "sertifikat",
    entitasId: id,
    meta: { agenda: agenda.judul, jumlah: inserted.length },
  });
  return NextResponse.json({ data: inserted }, { status: 201 });
}

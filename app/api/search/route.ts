import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

/** GET — pencarian global dengan autocomplete */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json({ results: [] });

  const supabase = getAdminClient();
  const [berita, pengurus, agenda, dokumen] = await Promise.all([
    supabase.from("berita").select("id, judul, slug").eq("status", "published").ilike("judul", `%${q}%`).limit(5),
    supabase.from("pengurus").select("id, nama, jabatan").eq("status", "aktif").ilike("nama", `%${q}%`).limit(5),
    supabase.from("agenda").select("id, judul, tanggal").ilike("judul", `%${q}%`).limit(5),
    supabase.from("dokumen").select("id, nama, kategori").eq("is_public", true).ilike("nama", `%${q}%`).limit(5),
  ]);

  const results = [
    ...(berita.data ?? []).map((b) => ({ type: "Berita", id: b.id, judul: b.judul, subtitle: "Berita", href: `/berita/${b.slug}` })),
    ...(pengurus.data ?? []).map((p) => ({ type: "Pengurus", id: p.id, judul: p.nama, subtitle: p.jabatan, href: "/kepengurusan" })),
    ...(agenda.data ?? []).map((a) => ({ type: "Agenda", id: a.id, judul: a.judul, subtitle: new Date(a.tanggal).toLocaleDateString("id-ID"), href: "/agenda" })),
    ...(dokumen.data ?? []).map((d) => ({ type: "Dokumen", id: d.id, judul: d.nama, subtitle: d.kategori, href: "/dokumen" })),
  ];

  return NextResponse.json({ results });
}

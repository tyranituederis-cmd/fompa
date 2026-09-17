import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SectionHeading } from "@/components/section-heading";
import { BeritaList } from "./berita-list";

export const metadata: Metadata = { title: "Berita" };
export const dynamic = "force-dynamic";

export default async function BeritaPage() {
  const supabase = await createClient();
  const [beritaRes, kategoriRes] = await Promise.all([
    supabase
      .from("berita")
      .select("*, kategori_berita(nama)")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(50),
    supabase.from("kategori_berita").select("*").order("nama"),
  ]);

  const berita = (beritaRes.data ?? []).map((b) => ({
    ...b,
    kategori: (b.kategori_berita as { nama?: string } | null)?.nama ?? null,
  }));

  return (
    <div className="container py-16">
      <SectionHeading eyebrow="Berita" title="Berita & Informasi" subtitle="Kabar terbaru dari kegiatan FOMPA." />
      <BeritaList initial={berita} kategori={kategoriRes.data ?? []} />
    </div>
  );
}

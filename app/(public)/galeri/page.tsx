import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SectionHeading } from "@/components/section-heading";
import { GaleriGrid } from "./galeri-grid";

export const metadata: Metadata = { title: "Galeri" };
export const dynamic = "force-dynamic";

export default async function GaleriPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("galeri").select("*").order("created_at", { ascending: false });

  return (
    <div className="container py-16">
      <SectionHeading eyebrow="Galeri" title="Dokumentasi Kegiatan" subtitle="Jejak dokumentasi kegiatan FOMPA. Klik gambar untuk melihat lebih besar." />
      <GaleriGrid initial={data ?? []} />
    </div>
  );
}

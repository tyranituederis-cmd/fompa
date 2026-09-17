import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SectionHeading } from "@/components/section-heading";
import { ProgramList } from "./program-list";

export const metadata: Metadata = { title: "Program Kerja" };
export const dynamic = "force-dynamic";

const KATEGORI = [
  "Semua",
  "Kaderisasi",
  "Musyawarah Kerja",
  "Latihan Kepemimpinan Organisasi",
  "Seminar Pendidikan",
  "Workshop",
  "Open Recruitment",
];

export default async function ProgramKerjaPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("program_kerja").select("*").order("created_at", { ascending: false });

  return (
    <div className="container py-16">
      <SectionHeading
        eyebrow="Program Kerja"
        title="Program Kerja FOMPA"
        subtitle="Berbagai program unggulan untuk pengembangan pelajar Purwakarta."
      />
      <ProgramList initial={data ?? []} kategori={KATEGORI} />
    </div>
  );
}

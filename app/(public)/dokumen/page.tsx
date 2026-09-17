import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SectionHeading } from "@/components/section-heading";
import { DokumenList } from "./dokumen-list";

export const metadata: Metadata = { title: "Dokumen" };
export const dynamic = "force-dynamic";

export default async function DokumenPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("dokumen").select("*").order("created_at", { ascending: false });

  return (
    <div className="container py-16">
      <SectionHeading
        eyebrow="Dokumen"
        title="Repository Dokumen"
        subtitle="AD/ART, TOR, proposal, LPJ, sertifikat, dan surat resmi FOMPA."
      />

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
        <Lock className="h-4 w-4 shrink-0" />
        Sebagian dokumen bersifat internal dan hanya dapat diakses setelah login sebagai pengurus.
      </div>

      <DokumenList initial={data ?? []} />
    </div>
  );
}

import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Arsip Generasi" };
export const dynamic = "force-dynamic";

export default async function ArsipPage() {
  const supabase = await createClient();
  const { data: generasi } = await supabase.from("generasi").select("*").order("id");

  return (
    <div className="container py-16">
      <SectionHeading
        eyebrow="Arsip"
        title="Arsip Generasi FOMPA"
        subtitle="Perjalanan empat belas generasi kepengurusan Forum OSIS MPK Purwakarta."
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(generasi ?? []).map((g, i) => (
          <Reveal key={g.id} delay={(i % 3) * 0.08}>
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="absolute -right-6 -top-6 text-8xl font-extrabold text-primary/5 transition-colors group-hover:text-primary/10">
                {g.nama.replace("FOMPA ", "")}
              </div>
              <div className="relative">
                <Badge>{g.nama}</Badge>
                {g.tahun && <p className="mt-2 text-sm font-medium text-primary">{g.tahun}</p>}
                {g.ketua && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400">Ketua:</span> {g.ketua}
                  </p>
                )}
                {g.deskripsi && <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{g.deskripsi}</p>}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

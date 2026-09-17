import type { Metadata } from "next";
import { Compass, Flag, Target, Gem, History } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Tentang Kami" };
export const dynamic = "force-dynamic";

export default async function TentangPage() {
  const supabase = await createClient();
  const { data: generasi } = await supabase.from("generasi").select("*").order("id").limit(14);

  return (
    <div className="container py-16">
      <SectionHeading
        eyebrow="Tentang"
        title="Sejarah & Identitas FOMPA"
        subtitle="Perjalanan panjang Forum OSIS MPK Purwakarta dalam membina pelajar."
      />

      {/* Sejarah */}
      <Reveal className="mx-auto mt-12 max-w-3xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <History className="h-5 w-5 text-primary" /> Sejarah FOMPA
          </h3>
          <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
            Forum OSIS MPK Purwakarta (FOMPA) lahir dari semangat kolaborasi para pengurus OSIS dan MPK
            sekolah menengah se-Kabupaten Purwakarta. Berawal dari pertemuan informal antar sekolah,
            FOMPA berkembang menjadi wadah resmi yang mewadahi kaderisasi kepemimpinan, pertukaran ide,
            dan sinergi program antar sekolah.
          </p>
          <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
            Hingga kini FOMPA telah melalui empat belas generasi kepengurusan dengan ribuan alumni yang
            tersebar di berbagai perguruan tinggi dan dunia profesional. Motto{" "}
            <span className="font-semibold text-primary">"Bersama dalam Organisasi"</span> menjadi
            pengingat bahwa setiap kemajuan dicapai secara kolektif.
          </p>
        </div>
      </Reveal>

      {/* Visi Misi Tujuan */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Reveal>
          <div className="h-full rounded-2xl border border-slate-200 bg-white p-7 shadow-card dark:border-slate-800 dark:bg-slate-900">
            <span className="inline-flex rounded-xl bg-primary/10 p-3 text-primary">
              <Compass className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Visi</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Terwujudnya pelajar Purwakarta yang unggul dalam kepemimpinan, berkarakter, dan berdaya
              saing melalui organisasi yang kolaboratif dan berintegritas.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="h-full rounded-2xl border border-slate-200 bg-white p-7 shadow-card dark:border-slate-800 dark:bg-slate-900">
            <span className="inline-flex rounded-xl bg-primary/10 p-3 text-primary">
              <Flag className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Misi</h3>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <li>• Menyelenggarakan kaderisasi kepemimpinan yang berkelanjutan.</li>
              <li>• Memfasilitasi kolaborasi dan sinergi antar OSIS/MPK sekolah.</li>
              <li>• Mengembangkan potensi akademik dan non-akademik pelajar.</li>
              <li>• Menjaga nilai budaya Sunda dalam setiap kegiatan.</li>
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="h-full rounded-2xl border border-slate-200 bg-white p-7 shadow-card dark:border-slate-800 dark:bg-slate-900">
            <span className="inline-flex rounded-xl bg-primary/10 p-3 text-primary">
              <Target className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Tujuan</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Menghasilkan kader pemimpin muda yang siap berkontribusi bagi sekolah, masyarakat, dan
              bangsa, serta mempererat persaudaraan antar pelajar se-Kabupaten Purwakarta.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Nilai organisasi */}
      <Reveal className="mt-16">
        <SectionHeading eyebrow="Nilai" title="Nilai Organisasi" />
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { nama: "Kepemimpinan", desc: "Menumbuhkan pemimpin yang melayani." },
            { nama: "Integritas", desc: "Jujur dan konsisten dalam setiap tindakan." },
            { nama: "Kolaborasi", desc: "Mengutamakan kebersamaan dan gotong royong." },
            { nama: "Kreativitas", desc: "Berinovasi dalam setiap program kerja." },
          ].map((n) => (
            <div
              key={n.nama}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card transition-transform duration-300 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900"
            >
              <Gem className="mx-auto h-6 w-6 text-primary" />
              <h4 className="mt-3 font-semibold text-slate-900 dark:text-white">{n.nama}</h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{n.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Timeline */}
      <Reveal className="mt-16">
        <SectionHeading eyebrow="Perjalanan" title="Timeline Generasi FOMPA" subtitle="Dari FOMPA I hingga FOMPA XIV." />
        <div className="relative mx-auto mt-10 max-w-3xl">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-primary to-primary/20 md:left-1/2" />
          <div className="space-y-8">
            {(generasi ?? []).map((g, i) => (
              <div key={g.id} className={`relative flex items-start gap-5 pl-12 md:w-1/2 md:pl-0 ${i % 2 === 0 ? "md:pr-10 md:text-right" : "md:ml-auto md:pl-10"}`}>
                <span
                  className={`absolute left-2 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-white dark:bg-slate-900 md:left-auto ${i % 2 === 0 ? "md:-right-2.5" : "md:-left-2.5"}`}
                >
                  <span className="h-2 w-2 rounded-full bg-primary" />
                </span>
                <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2">
                    <Badge>{g.nama}</Badge>
                    {g.tahun && <span className="text-xs text-slate-400">{g.tahun}</span>}
                  </div>
                  {g.ketua && <p className="mt-2 text-sm font-medium text-primary">Ketua: {g.ketua}</p>}
                  {g.deskripsi && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{g.deskripsi}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

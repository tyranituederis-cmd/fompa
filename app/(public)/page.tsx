import Link from "next/link";
import { ArrowRight, CalendarDays, FileText, Newspaper, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { BeritaCard } from "@/components/cards/berita-card";
import { ProgramCard } from "@/components/cards/program-card";
import { AgendaCard } from "@/components/cards/agenda-card";
import { Button } from "@/components/ui/button";
import type { Berita, ProgramKerja, Agenda } from "@/lib/types";

export const dynamic = "force-dynamic";

const DEFAULT_SETTINGS = {
  org_name: "Forum OSIS MPK Purwakarta",
  motto: "Bersama dalam Organisasi",
  hero_title: "Forum OSIS MPK Purwakarta",
  hero_subtitle: "Wadah Kolaborasi, Kepemimpinan, dan Sinergi Pelajar Kabupaten Purwakarta.",
};

export default async function LandingPage() {
  const supabase = await createClient();

  const [{ data: settingsData }, beritaRes, agendaRes, programRes] = await Promise.all([
    supabase.from("settings").select("value").eq("key", "site").maybeSingle(),
    supabase
      .from("berita")
      .select("*, kategori_berita(nama)")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3),
    supabase.from("agenda").select("*").gte("tanggal", new Date().toISOString()).order("tanggal").limit(3),
    supabase.from("program_kerja").select("*").order("created_at", { ascending: false }).limit(3),
  ]);

  const settings = { ...DEFAULT_SETTINGS, ...((settingsData?.value as Record<string, unknown>) ?? {}) };

  const berita: Berita[] = (beritaRes.data ?? []).map((b) => ({
    ...b,
    kategori: (b.kategori_berita as { nama?: string } | null)?.nama ?? null,
  }));
  const agenda: Agenda[] = agendaRes.data ?? [];
  const program: ProgramKerja[] = programRes.data ?? [];

  const stats = [
    { label: "Generasi", value: "XIV", icon: <Users className="h-5 w-5" /> },
    { label: "Sekolah Terhubung", value: "40+", icon: <FileText className="h-5 w-5" /> },
    { label: "Program Kerja", value: "6", icon: <CalendarDays className="h-5 w-5" /> },
    { label: "Kegiatan / Tahun", value: "20+", icon: <Newspaper className="h-5 w-5" /> },
  ];

  return (
    <>
      <Hero title={String(settings.hero_title)} subtitle={String(settings.hero_subtitle)} />

      {/* Statistik singkat */}
      <section className="container -mt-14 relative z-20">
        <Reveal>
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-glass backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="rounded-xl bg-primary/10 p-2.5 text-primary">{s.icon}</span>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Tentang singkat */}
      <section className="container py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <div>
              <SectionHeading
                align="left"
                eyebrow="Tentang Kami"
                title="Bersama dalam Organisasi"
                subtitle="FOMPA adalah wadah kolaborasi OSIS dan MPK se-Kabupaten Purwakarta yang berfokus pada pengembangan kepemimpinan, kaderisasi, dan sinergi antar pelajar."
              />
              <div className="mt-6 flex gap-3">
                <Link href="/tentang">
                  <Button>Selengkapnya</Button>
                </Link>
                <Link href="/kepengurusan">
                  <Button variant="outline">Lihat Pengurus</Button>
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="grid grid-cols-2 gap-4">
              {["Kepemimpinan", "Kaderisasi", "Kolaborasi", "Integritas"].map((v, i) => (
                <div
                  key={v}
                  className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card transition-transform duration-300 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="text-3xl font-extrabold text-primary/30">0{i + 1}</span>
                  <p className="mt-2 font-semibold text-slate-800 dark:text-slate-100">{v}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Program Kerja */}
      <section className="bg-slate-50 py-20 dark:bg-slate-900/50">
        <div className="container">
          <SectionHeading eyebrow="Program Kerja" title="Program Unggulan" subtitle="Program kerja FOMPA yang berjalan dan akan datang." />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {program.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <ProgramCard program={p} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 text-center">
            <Link href="/program-kerja">
              <Button variant="outline">
                Semua Program Kerja <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Berita terbaru */}
      <section className="container py-20">
        <SectionHeading eyebrow="Berita" title="Berita Terbaru" subtitle="Kabar terbaru seputar kegiatan dan pengumuman FOMPA." />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {berita.map((b, i) => (
            <Reveal key={b.id} delay={i * 0.08}>
              <BeritaCard berita={b} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center">
          <Link href="/berita">
            <Button variant="outline">
              Semua Berita <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Reveal>
      </section>

      {/* Agenda terdekat */}
      {agenda.length > 0 && (
        <section className="bg-slate-50 py-20 dark:bg-slate-900/50">
          <div className="container">
            <SectionHeading eyebrow="Agenda" title="Agenda Terdekat" subtitle="Jangan lewatkan kegiatan FOMPA selanjutnya." />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {agenda.map((a, i) => (
                <Reveal key={a.id} delay={i * 0.08}>
                  <AgendaCard agenda={a} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-dark p-10 text-center text-white md:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <h2 className="relative text-3xl font-bold md:text-4xl">Siap Menjadi Bagian dari FOMPA?</h2>
            <p className="relative mx-auto mt-3 max-w-xl text-white/85">
              Bergabunglah dengan puluhan pelajar terbaik Kabupaten Purwakarta dan kembangkan potensi kepemimpinanmu.
            </p>
            <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/daftar">
                <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90 sm:w-auto">
                  Gabung FOMPA
                </Button>
              </Link>
              <Link href="/kontak">
                <Button size="lg" variant="outline" className="w-full border-white/40 text-white hover:bg-white/10 sm:w-auto">
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

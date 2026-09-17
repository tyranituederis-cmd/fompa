import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate, truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  berjalan: { label: "Berjalan", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  selesai: { label: "Selesai", cls: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" },
  akan_datang: { label: "Akan Datang", cls: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  ditunda: { label: "Ditunda", cls: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("program_kerja").select("nama, deskripsi").eq("id", id).maybeSingle();
  return { title: data?.nama ?? "Program Kerja", description: truncate(data?.deskripsi ?? "", 150) };
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: program } = await supabase.from("program_kerja").select("*").eq("id", id).maybeSingle();
  if (!program) notFound();

  const status = STATUS_LABEL[program.status] ?? STATUS_LABEL.akan_datang;

  return (
    <article className="container max-w-4xl py-16">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="relative aspect-[16/7] overflow-hidden bg-slate-100 dark:bg-slate-800">
          {program.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={program.cover} alt={program.nama} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/25 via-white to-white dark:via-slate-900 dark:to-slate-900">
              <span className="px-6 text-center text-3xl font-extrabold text-primary/50">{program.kategori}</span>
            </div>
          )}
          <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${status.cls}`}>{status.label}</span>
        </div>

        <div className="p-6 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{program.kategori}</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">{program.nama}</h1>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
            {program.tanggal && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-primary" /> {formatDate(program.tanggal)}
              </span>
            )}
          </div>

          <div className="prose mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">{program.deskripsi}</div>

          {program.dokumentasi && program.dokumentasi.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Dokumentasi</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {program.dokumentasi.map((url: string, i: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={url} alt={`Dokumentasi ${i + 1}`} className="aspect-video w-full rounded-xl object-cover" />
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center gap-3 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/60">
            <Badge>{program.kategori}</Badge>
            <p className="text-sm text-slate-500 dark:text-slate-400">Program kerja FOMPA — {program.status === "selesai" ? "telah dilaksanakan" : "terjadwal"}.</p>
          </div>
        </div>
      </div>
    </article>
  );
}

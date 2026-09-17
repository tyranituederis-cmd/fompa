import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AbsensiForm } from "./absensi-form";

export const metadata: Metadata = { title: "Absensi Kegiatan" };
export const dynamic = "force-dynamic";

export default async function AbsensiPage({ params }: { params: Promise<{ agendaId: string }> }) {
  const { agendaId } = await params;
  const supabase = await createClient();
  const { data: agenda } = await supabase.from("agenda").select("*").eq("id", agendaId).maybeSingle();
  if (!agenda) notFound();

  return (
    <div className="container max-w-md py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Presensi Kegiatan</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{agenda.judul}</h1>
        <p className="mt-1 text-sm text-slate-400">{agenda.lokasi ?? "Lokasi menyusul"}</p>
      </div>
      <AbsensiForm agendaId={agendaId} />
    </div>
  );
}

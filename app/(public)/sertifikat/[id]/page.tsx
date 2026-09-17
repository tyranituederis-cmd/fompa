import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Award, Printer } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SertifikatQr } from "./sertifikat-qr";

export const metadata: Metadata = { title: "E-Sertifikat" };
export const dynamic = "force-dynamic";

export default async function SertifikatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: sertifikat } = await supabase
    .from("sertifikat")
    .select("*, agenda(judul, tanggal)")
    .eq("id", id)
    .maybeSingle();
  if (!sertifikat) notFound();

  const verifyUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/sertifikat/${id}`;

  return (
    <div className="container max-w-4xl py-16">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-slate-400">Nomor: {sertifikat.nomor}</p>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300"
        >
          <Printer className="h-4 w-4" /> Cetak / Simpan PDF
        </button>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-card print:border-0 print:shadow-none dark:border-slate-800 dark:bg-slate-900 md:p-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/15 to-transparent" />

        <img src="/logo.jpg" alt="Logo FOMPA" className="mx-auto h-24 w-24 rounded-full object-contain" />

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Forum OSIS MPK Purwakarta</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Sertifikat Penghargaan</h1>
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Diberikan kepada</p>
        <p className="mt-2 text-3xl font-extrabold tracking-wide text-slate-900 dark:text-white md:text-4xl">
          {sertifikat.peserta_name}
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          atas partisipasi aktifnya dalam kegiatan{" "}
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {(sertifikat.agenda as { judul?: string } | null)?.judul ?? "kegiatan FOMPA"}
          </span>
          {sertifikat.agenda && (
            <>
              {" "}
              pada tanggal{" "}
              {new Date((sertifikat.agenda as { tanggal: string }).tanggal).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </>
          )}
          .
        </p>

        <div className="mt-10 flex items-end justify-between">
          <div className="text-left">
            <p className="text-xs text-slate-400">Ketua Umum</p>
            <p className="mt-6 text-sm font-semibold text-slate-700 dark:text-slate-200">Raka Aditya</p>
            <div className="mt-1 h-px w-40 bg-slate-300 dark:bg-slate-600" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <SertifikatQr value={verifyUrl} />
            <p className="text-[10px] text-slate-400">Scan untuk verifikasi</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { FileText, Download, FileType2 } from "lucide-react";
import type { Dokumen } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const KATEGORI_STYLE: Record<string, string> = {
  "AD/ART": "bg-primary/10 text-primary border-primary/20",
  TOR: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300",
  Proposal: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
  LPJ: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
  Sertifikat: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300",
  Surat: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300",
};

export function DokumenCard({ dokumen }: { dokumen: Dokumen }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="rounded-xl bg-primary/10 p-3 text-primary">
        <FileText className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-semibold text-slate-900 dark:text-white">{dokumen.nama}</h3>
          <Badge className={KATEGORI_STYLE[dokumen.kategori] ?? ""}>{dokumen.kategori}</Badge>
        </div>
        <p className="mt-1 flex items-center gap-2 text-xs text-slate-400">
          <FileType2 className="h-3.5 w-3.5" /> {dokumen.tipe?.split("/").pop()?.toUpperCase() ?? "FILE"}
          {dokumen.ukuran ? ` · ${Math.max(1, Math.round(dokumen.ukuran / 1024))} KB` : ""}
          <span>· {formatDate(dokumen.created_at)}</span>
        </p>
      </div>
      <a
        href={dokumen.file_url}
        target="_blank"
        rel="noreferrer"
        download
        className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition-all hover:border-primary hover:bg-primary hover:text-white dark:border-slate-700 dark:text-slate-400"
        aria-label={`Unduh ${dokumen.nama}`}
      >
        <Download className="h-4 w-4" />
      </a>
    </div>
  );
}

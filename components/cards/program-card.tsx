import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";
import type { ProgramKerja } from "@/lib/types";
import { formatDate, truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const STATUS_STYLE: Record<string, { label: string; variant: "success" | "warning" | "info" | "danger" }> = {
  berjalan: { label: "Berjalan", variant: "success" },
  selesai: { label: "Selesai", variant: "info" },
  akan_datang: { label: "Akan Datang", variant: "warning" },
  ditunda: { label: "Ditunda", variant: "danger" },
};

export function ProgramCard({ program }: { program: ProgramKerja }) {
  const status = STATUS_STYLE[program.status] ?? STATUS_STYLE.akan_datang;
  return (
    <Link
      href={`/program-kerja/${program.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
        {program.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={program.cover}
            alt={program.nama}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="px-4 text-center text-2xl font-bold text-primary/50">{program.kategori}</span>
          </div>
        )}
        <Badge variant={status.variant} className="absolute left-3 top-3 bg-white/90 backdrop-blur dark:bg-slate-900/90">
          {status.label}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{program.kategori}</p>
        <h3 className="line-clamp-2 font-semibold text-slate-900 group-hover:text-primary dark:text-white">{program.nama}</h3>
        <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{truncate(program.deskripsi, 110)}</p>
        {program.tanggal && (
          <p className="flex items-center gap-1.5 pt-1 text-xs text-slate-400">
            <CalendarDays className="h-3.5 w-3.5" /> {formatDate(program.tanggal)}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary">
          Selengkapnya <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

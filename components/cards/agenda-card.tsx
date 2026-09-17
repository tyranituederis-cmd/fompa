import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { Agenda } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Countdown } from "@/components/countdown";

const STATUS_STYLE: Record<string, { label: string; variant: "success" | "warning" | "info" | "danger" }> = {
  akan_datang: { label: "Akan Datang", variant: "warning" },
  berlangsung: { label: "Berlangsung", variant: "success" },
  selesai: { label: "Selesai", variant: "info" },
  batal: { label: "Dibatalkan", variant: "danger" },
};

export function AgendaCard({ agenda }: { agenda: Agenda }) {
  const status = STATUS_STYLE[agenda.status] ?? STATUS_STYLE.akan_datang;
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">{agenda.judul}</h3>
          {agenda.kategori && <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-primary">{agenda.kategori}</p>}
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
        <p className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" /> {formatDateTime(agenda.tanggal)}
        </p>
        {agenda.lokasi && (
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> {agenda.lokasi}
          </p>
        )}
      </div>

      {agenda.status === "akan_datang" && (
        <div className="mt-auto">
          <Countdown target={agenda.tanggal} />
        </div>
      )}
    </div>
  );
}

export function AgendaLink({ agenda }: { agenda: Agenda }) {
  return (
    <Link href={`/agenda?id=${agenda.id}`} className="block">
      <AgendaCard agenda={agenda} />
    </Link>
  );
}

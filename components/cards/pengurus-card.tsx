import { GraduationCap, School, Instagram, Music2 } from "lucide-react";
import type { Pengurus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function PengurusCard({ pengurus }: { pengurus: Pengurus }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-white to-white dark:from-primary/25 dark:via-slate-900 dark:to-slate-900">
        {pengurus.foto_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={pengurus.foto_url} alt={pengurus.nama} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <span className="text-6xl font-extrabold text-primary/30">{pengurus.nama.charAt(0)}</span>
        )}
        {pengurus.bidang && (
          <Badge className="absolute left-3 top-3 bg-white/90 backdrop-blur dark:bg-slate-900/90">{pengurus.bidang}</Badge>
        )}
      </div>
      <div className="p-5 text-center">
        <h3 className="font-semibold text-slate-900 dark:text-white">{pengurus.nama}</h3>
        <p className="mt-0.5 text-sm font-medium text-primary">{pengurus.jabatan}</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-400">
          {pengurus.generasi && (
            <span className="flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5" /> {pengurus.generasi}
            </span>
          )}
          {pengurus.sekolah && (
            <span className="flex items-center gap-1">
              <School className="h-3.5 w-3.5" /> {pengurus.sekolah}
            </span>
          )}
        </div>
        {pengurus.sosmed && (pengurus.sosmed.instagram || pengurus.sosmed.tiktok) && (
          <div className="mt-3 flex items-center justify-center gap-2">
            {pengurus.sosmed.instagram && (
              <a
                href={`https://instagram.com/${pengurus.sosmed.instagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-400"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {pengurus.sosmed.tiktok && (
              <a
                href={`https://tiktok.com/@${pengurus.sosmed.tiktok.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-400"
                aria-label="TikTok"
              >
                <Music2 className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

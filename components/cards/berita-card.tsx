import Link from "next/link";
import { CalendarDays, Eye, ThumbsUp } from "lucide-react";
import type { Berita } from "@/lib/types";
import { formatDate, truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function BeritaCard({ berita }: { berita: Berita }) {
  return (
    <Link
      href={`/berita/${berita.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
        {berita.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={berita.thumbnail}
            alt={berita.judul}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="text-4xl font-extrabold text-primary/40">FOMPA</span>
          </div>
        )}
        {berita.kategori && (
          <Badge className="absolute left-3 top-3 bg-white/90 backdrop-blur dark:bg-slate-900/90">{berita.kategori}</Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" /> {formatDate(berita.published_at ?? berita.created_at)}
          </span>
        </div>
        <h3 className="line-clamp-2 font-semibold leading-snug text-slate-900 transition-colors group-hover:text-primary dark:text-white">
          {berita.judul}
        </h3>
        <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{truncate(berita.ringkasan ?? "", 120)}</p>
        <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" /> {berita.views}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-3.5 w-3.5" /> {berita.likes}
          </span>
        </div>
      </div>
    </Link>
  );
}

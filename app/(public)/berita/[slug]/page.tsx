import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Eye, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate, truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BeritaActions } from "./berita-actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("berita").select("judul, ringkasan").eq("slug", slug).maybeSingle();
  return { title: data?.judul ?? "Berita", description: truncate(data?.ringkasan ?? "", 150) };
}

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: berita } = await supabase
    .from("berita")
    .select("*, kategori_berita(nama), users(name)")
    .eq("slug", slug)
    .maybeSingle();

  if (!berita) notFound();

  return (
    <article className="container max-w-3xl py-16">
      <Badge>{berita.kategori ? (berita.kategori_berita as { nama?: string } | null)?.nama ?? "Umum" : "Umum"}</Badge>
      <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 dark:text-white md:text-4xl">{berita.judul}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4" /> {formatDate(berita.published_at ?? berita.created_at)}
        </span>
        <span className="flex items-center gap-1.5">
          <User className="h-4 w-4" /> {(berita.users as { name?: string } | null)?.name ?? "Admin FOMPA"}
        </span>
        <span className="flex items-center gap-1.5">
          <Eye className="h-4 w-4" /> {berita.views} dilihat
        </span>
      </div>

      {berita.tags && berita.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {berita.tags.map((t: string) => (
            <span key={t} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              #{t}
            </span>
          ))}
        </div>
      )}

      {berita.thumbnail && (
        <div className="mt-6 overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={berita.thumbnail} alt={berita.judul} className="w-full object-cover" />
        </div>
      )}

      <div className="prose mt-8" dangerouslySetInnerHTML={{ __html: berita.konten }} />

      <BeritaActions beritaId={berita.id} judul={berita.judul} likes={berita.likes} />

      <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
        <h3 className="font-semibold text-slate-900 dark:text-white">Tentang FOMPA</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Forum OSIS MPK Purwakarta (FOMPA) adalah wadah kolaborasi, kepemimpinan, dan sinergi pelajar
          Kabupaten Purwakarta. Motto kami: <span className="font-medium text-primary">"Bersama dalam Organisasi"</span>.
        </p>
      </div>
    </article>
  );
}

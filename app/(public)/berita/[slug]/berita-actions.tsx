"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ThumbsUp, Share2, Link as LinkIcon, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function BeritaActions({ beritaId, judul, likes }: { beritaId: string; judul: string; likes: number }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [count, setCount] = React.useState(likes);
  const [liked, setLiked] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  // Hit views sekali per sesi
  React.useEffect(() => {
    const key = `fompa_view_${beritaId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch(`/api/berita/${beritaId}/view`, { method: "POST" }).catch(() => {});
  }, [beritaId]);

  const toggleLike = async () => {
    if (!session) {
      toast("Silakan login untuk menyukai berita", "info");
      router.push("/login");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/berita/${beritaId}/like`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setLiked(data.liked);
        setCount((c) => Math.max(0, c + (data.liked ? 1 : -1)));
      } else {
        toast(data.error ?? "Gagal", "error");
      }
    } finally {
      setBusy(false);
    }
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: judul, url });
        return;
      } catch {
        /* batal */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast("Tautan disalin ke clipboard");
    } catch {
      toast("Gagal menyalin tautan", "error");
    }
  };

  return (
    <div className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
      <button
        onClick={toggleLike}
        disabled={busy}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
          liked
            ? "border-primary bg-primary text-white shadow-md shadow-primary/25"
            : "border-slate-200 text-slate-600 hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300"
        )}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
        Suka ({count})
      </button>
      <button
        onClick={share}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-300 hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300"
      >
        <Share2 className="h-4 w-4" /> Bagikan
      </button>
      <button
        onClick={share}
        className="rounded-full border border-slate-200 p-2.5 text-slate-500 transition-all hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300"
        aria-label="Salin tautan"
        title="Salin tautan"
      >
        <LinkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

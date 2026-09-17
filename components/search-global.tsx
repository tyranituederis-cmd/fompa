"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, FileText, Users, CalendarDays, FolderOpen, Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Result {
  type: string;
  id: string;
  judul: string;
  subtitle?: string;
  href: string;
}

const TYPE_META: Record<string, { label: string; icon: React.ReactNode }> = {
  Berita: { label: "Berita", icon: <FileText className="h-4 w-4" /> },
  Pengurus: { label: "Pengurus", icon: <Users className="h-4 w-4" /> },
  Agenda: { label: "Agenda", icon: <CalendarDays className="h-4 w-4" /> },
  Dokumen: { label: "Dokumen", icon: <FolderOpen className="h-4 w-4" /> },
};

export function SearchGlobal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = React.useState("");
  const [results, setResults] = React.useState<Result[]>([]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (!open) {
      setQ("");
      setResults([]);
      return;
    }
  }, [open]);

  React.useEffect(() => {
    if (!open || q.trim().length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results ?? []);
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [q, open]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, Result[]>();
    for (const r of results) {
      if (!map.has(r.type)) map.set(r.type, []);
      map.get(r.type)!.push(r);
    }
    return Array.from(map.entries());
  }, [results]);

  return (
    <Dialog open={open} onClose={onClose} title="Pencarian Global" description="Cari berita, pengurus, agenda, dan dokumen">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ketik kata kunci…"
          className="pl-9"
        />
      </div>

      <div className="mt-4 max-h-96 space-y-4 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Mencari…
          </div>
        )}

        {!loading && q.trim().length >= 2 && grouped.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">Tidak ditemukan hasil untuk "{q}"</p>
        )}

        {grouped.map(([type, items]) => (
          <div key={type}>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {TYPE_META[type]?.icon} {TYPE_META[type]?.label ?? type}
            </p>
            <div className="space-y-1">
              {items.map((item) => (
                <button
                  key={`${type}-${item.id}`}
                  onClick={() => {
                    router.push(item.href);
                    onClose();
                  }}
                  className={cn(
                    "flex w-full flex-col items-start rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{item.judul}</span>
                  {item.subtitle && <span className="text-xs text-slate-400">{item.subtitle}</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Dialog>
  );
}

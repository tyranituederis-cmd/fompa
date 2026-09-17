"use client";

import * as React from "react";
import { Tabs } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { Lightbox } from "@/components/lightbox";
import type { GaleriItem } from "@/lib/types";

export function GaleriGrid({ initial }: { initial: GaleriItem[] }) {
  const [kategori, setKategori] = React.useState("semua");
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    initial.forEach((g) => g.kategori && set.add(g.kategori));
    return ["semua", ...Array.from(set).sort()];
  }, [initial]);

  const filtered = kategori === "semua" ? initial : initial.filter((g) => g.kategori === kategori);

  return (
    <div className="mt-10 space-y-8">
      <Tabs
        tabs={categories.map((c) => ({ value: c, label: c === "semua" ? "Semua" : c }))}
        value={kategori}
        onChange={setKategori}
      />

      {filtered.length === 0 ? (
        <EmptyState title="Belum ada foto" description="Dokumentasi untuk kategori ini belum diunggah." />
      ) : (
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>figure]:mb-5">
          {filtered.map((g, i) => (
            <figure key={g.id} className="group relative cursor-pointer overflow-hidden rounded-2xl break-inside-avoid">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.url}
                alt={g.judul}
                loading="lazy"
                className="w-full transition-transform duration-500 group-hover:scale-105"
                onClick={() => setLightboxIndex(i)}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-sm font-medium text-white">{g.judul}</p>
                {g.kategori && <p className="text-xs text-white/70">{g.kategori}</p>}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <Lightbox
        images={filtered.map((g) => ({ url: g.url, judul: g.judul }))}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}

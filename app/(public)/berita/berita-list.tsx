"use client";

import * as React from "react";
import { Tabs } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { BeritaCard } from "@/components/cards/berita-card";
import type { Berita, KategoriBerita } from "@/lib/types";

export function BeritaList({ initial, kategori }: { initial: Berita[]; kategori: KategoriBerita[] }) {
  const [active, setActive] = React.useState("semua");
  const tabs = [{ value: "semua", label: "Semua" }, ...kategori.map((k) => ({ value: k.slug, label: k.nama }))];

  const filtered =
    active === "semua"
      ? initial
      : initial.filter((b) => {
          const k = kategori.find((x) => x.slug === active);
          return k && b.kategori_id === k.id;
        });

  return (
    <div className="mt-10 space-y-8">
      <Tabs tabs={tabs} value={active} onChange={setActive} />
      {filtered.length === 0 ? (
        <EmptyState title="Belum ada berita" description="Belum ada berita pada kategori ini." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <BeritaCard key={b.id} berita={b} />
          ))}
        </div>
      )}
    </div>
  );
}

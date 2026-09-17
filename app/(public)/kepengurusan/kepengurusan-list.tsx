"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PengurusCard } from "@/components/cards/pengurus-card";
import type { Pengurus } from "@/lib/types";

export function KepengurusanList() {
  const [generasi, setGenerasi] = React.useState("semua");
  const [bidang, setBidang] = React.useState("semua");
  const [data, setData] = React.useState<Pengurus[] | null>(null);

  const generasiOptions = React.useMemo(() => {
    const set = new Set<string>();
    data?.forEach((p) => p.generasi && set.add(p.generasi));
    return ["semua", ...Array.from(set).sort()];
  }, [data]);

  const bidangOptions = React.useMemo(() => {
    const set = new Set<string>();
    data?.forEach((p) => p.bidang && set.add(p.bidang));
    return ["semua", ...Array.from(set).sort()];
  }, [data]);

  React.useEffect(() => {
    const params = new URLSearchParams({ status: "aktif" });
    if (generasi !== "semua") params.set("generasi", generasi);
    if (bidang !== "semua") params.set("bidang", bidang);
    let cancelled = false;

    fetch(`/api/pengurus?${params.toString()}`)
      .then((r) => r.json())
      .then((res) => {
        if (!cancelled) setData(res.data ?? []);
      })
      .catch(() => !cancelled && setData([]));

    return () => {
      cancelled = true;
    };
  }, [generasi, bidang]);

  return (
    <div className="mt-10 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Tabs
          tabs={generasiOptions.map((g) => ({ value: g, label: g === "semua" ? "Semua Generasi" : g }))}
          value={generasi}
          onChange={setGenerasi}
        />
        <Tabs
          tabs={bidangOptions.map((b) => ({ value: b, label: b === "semua" ? "Semua Bidang" : b }))}
          value={bidang}
          onChange={setBidang}
        />
      </div>

      {!data && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      )}

      {data && data.length === 0 && (
        <EmptyState title="Belum ada pengurus" description="Tidak ada data pengurus yang cocok dengan filter." />
      )}

      {data && data.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((p) => (
            <PengurusCard key={p.id} pengurus={p} />
          ))}
        </div>
      )}
    </div>
  );
}

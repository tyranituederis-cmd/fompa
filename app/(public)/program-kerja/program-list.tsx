"use client";

import * as React from "react";
import { Tabs } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { ProgramCard } from "@/components/cards/program-card";
import type { ProgramKerja } from "@/lib/types";

export function ProgramList({ initial, kategori }: { initial: ProgramKerja[]; kategori: string[] }) {
  const [active, setActive] = React.useState("Semua");
  const filtered = active === "Semua" ? initial : initial.filter((p) => p.kategori === active);

  return (
    <div className="mt-10 space-y-8">
      <Tabs
        tabs={kategori.map((k) => ({ value: k, label: k }))}
        value={active}
        onChange={setActive}
        className="justify-center"
      />
      {filtered.length === 0 ? (
        <EmptyState title="Belum ada program" description="Program dengan kategori ini belum tersedia." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProgramCard key={p.id} program={p} />
          ))}
        </div>
      )}
    </div>
  );
}

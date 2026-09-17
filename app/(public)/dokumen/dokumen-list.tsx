"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { DokumenCard } from "@/components/cards/dokumen-card";
import type { Dokumen } from "@/lib/types";

const KATEGORI = ["semua", "AD/ART", "TOR", "Proposal", "LPJ", "Sertifikat", "Surat"];

export function DokumenList({ initial }: { initial: Dokumen[] }) {
  const [kategori, setKategori] = React.useState("semua");
  const [q, setQ] = React.useState("");

  const filtered = initial.filter((d) => {
    const matchKategori = kategori === "semua" || d.kategori === kategori;
    const matchQ = d.nama.toLowerCase().includes(q.toLowerCase());
    return matchKategori && matchQ;
  });

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Tabs tabs={KATEGORI.map((k) => ({ value: k, label: k === "semua" ? "Semua" : k }))} value={kategori} onChange={setKategori} />
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari dokumen…" className="pl-9" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Dokumen tidak ditemukan" description="Coba kata kunci atau kategori lain." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((d) => (
            <DokumenCard key={d.id} dokumen={d} />
          ))}
        </div>
      )}
    </div>
  );
}

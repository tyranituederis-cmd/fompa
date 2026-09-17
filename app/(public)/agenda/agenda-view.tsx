"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";
import { AgendaCard } from "@/components/cards/agenda-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs } from "@/components/ui/tabs";
import type { Agenda } from "@/lib/types";

export function AgendaView({ initial, calendarEmbed }: { initial: Agenda[]; calendarEmbed: string }) {
  const now = new Date();
  const upcoming = initial.filter((a) => new Date(a.tanggal) >= now && a.status !== "batal");
  const past = initial.filter((a) => new Date(a.tanggal) < now || a.status === "batal");

  const [tab, setTab] = React.useState("upcoming");

  return (
    <div className="mt-10 space-y-10">
      <Tabs
        tabs={[
          { value: "upcoming", label: `Akan Datang (${upcoming.length})` },
          { value: "past", label: `Riwayat (${past.length})` },
        ]}
        value={tab}
        onChange={setTab}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {(tab === "upcoming" ? upcoming : past).length === 0 ? (
          <EmptyState title="Tidak ada agenda" description="Belum ada agenda pada daftar ini." />
        ) : (
          (tab === "upcoming" ? upcoming : past).map((a) => <AgendaCard key={a.id} agenda={a} />)
        )}
      </div>

      {calendarEmbed && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <CalendarDays className="h-5 w-5 text-primary" /> Kalender Google
          </h3>
          <iframe
            src={calendarEmbed}
            title="Kalender Google FOMPA"
            className="h-[480px] w-full rounded-2xl border border-slate-200 dark:border-slate-800"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}

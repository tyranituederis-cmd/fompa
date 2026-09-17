"use client";

import * as React from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/utils";

const STATUS_BADGE: Record<string, { label: string; variant: "success" | "warning" | "info" | "danger" | "outline" }> = {
  hadir: { label: "Hadir", variant: "success" },
  izin: { label: "Izin", variant: "warning" },
  sakit: { label: "Sakit", variant: "info" },
  alpha: { label: "Alpha", variant: "danger" },
};

interface Presensi {
  id: string;
  agenda_id: string;
  agenda?: { judul: string; tanggal: string } | null;
  status: string;
  created_at: string;
}

export default function AbsensiPage() {
  const [data, setData] = React.useState<Presensi[] | null>(null);

  React.useEffect(() => {
    fetch("/api/absensi")
      .then((r) => r.json())
      .then((res) => setData(res.data ?? []))
      .catch(() => setData([]));
  }, []);

  return (
    <div>
      <PageHeader title="Riwayat Absensi" description="Rekap kehadiran Anda pada kegiatan FOMPA." />
      {!data ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState title="Belum ada presensi" description="Isi presensi dengan memindai QR agenda pada saat kegiatan." />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <THead>
              <TR>
                <TH>Kegiatan</TH>
                <TH>Waktu Presensi</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {data.map((p) => {
                const badge = STATUS_BADGE[p.status] ?? { label: p.status, variant: "outline" as const };
                return (
                  <TR key={p.id}>
                    <TD className="font-medium">{p.agenda?.judul ?? "-"}</TD>
                    <TD className="whitespace-nowrap">{formatDateTime(p.created_at)}</TD>
                    <TD>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

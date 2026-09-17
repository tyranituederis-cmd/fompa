"use client";

import * as React from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

interface Log {
  id: string;
  user_name: string | null;
  aksi: string;
  entitas: string;
  meta: Record<string, unknown> | null;
  created_at: string;
}

export default function LogAktivitasPage() {
  const [data, setData] = React.useState<Log[] | null>(null);

  React.useEffect(() => {
    fetch("/api/activity")
      .then((r) => r.json())
      .then((res) => setData(res.data ?? []))
      .catch(() => setData([]));
  }, []);

  return (
    <div>
      <PageHeader title="Log Aktivitas" description="Audit trail seluruh aktivitas admin dan pengurus." />
      {!data ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState title="Belum ada aktivitas" />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <THead>
              <TR>
                <TH>Waktu</TH>
                <TH>User</TH>
                <TH>Aksi</TH>
                <TH>Entitas</TH>
                <TH>Detail</TH>
              </TR>
            </THead>
            <TBody>
              {data.map((l) => (
                <TR key={l.id}>
                  <TD className="whitespace-nowrap text-xs">{formatDateTime(l.created_at)}</TD>
                  <TD className="font-medium">{l.user_name ?? "Sistem"}</TD>
                  <TD>
                    <Badge>{l.aksi}</Badge>
                  </TD>
                  <TD>{l.entitas}</TD>
                  <TD className="max-w-[220px] truncate text-xs text-slate-400">{l.meta ? JSON.stringify(l.meta) : "-"}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

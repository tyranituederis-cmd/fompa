"use client";

import * as React from "react";
import { Check, X, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";

const STATUS_BADGE: Record<string, { label: string; variant: "warning" | "success" | "danger" }> = {
  pending: { label: "Menunggu", variant: "warning" },
  diterima: { label: "Diterima", variant: "success" },
  ditolak: { label: "Ditolak", variant: "danger" },
};

interface Pendaftar {
  id: string;
  nama_lengkap: string;
  email: string;
  whatsapp: string;
  sekolah: string;
  kelas: string | null;
  bidang: string[] | null;
  motivasi: string | null;
  berkas_url: string | null;
  status: string;
  created_at: string;
}

export default function PendaftaranManagePage() {
  const [data, setData] = React.useState<Pendaftar[] | null>(null);
  const [tab, setTab] = React.useState("semua");

  const load = React.useCallback(async () => {
    const params = tab === "semua" ? "" : `?status=${tab}`;
    const res = await fetch(`/api/pendaftaran${params}`);
    const json = await res.json();
    setData(json.data ?? []);
  }, [tab]);

  React.useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (p: Pendaftar, status: "diterima" | "ditolak") => {
    const res = await fetch(`/api/pendaftaran/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast(`Pendaftaran ${p.nama_lengkap}: ${status}`);
      load();
    } else {
      toast("Gagal memperbarui", "error");
    }
  };

  const counts = React.useMemo(() => {
    if (!data) return { pending: 0, diterima: 0, ditolak: 0 };
    return {
      pending: data.filter((d) => d.status === "pending").length,
      diterima: data.filter((d) => d.status === "diterima").length,
      ditolak: data.filter((d) => d.status === "ditolak").length,
    };
  }, [data]);

  return (
    <div>
      <PageHeader title="Open Recruitment" description="Kelola pendaftar baru FOMPA." />
      <Tabs
        tabs={[
          { value: "semua", label: "Semua" },
          { value: "pending", label: `Menunggu (${counts.pending})` },
          { value: "diterima", label: `Diterima (${counts.diterima})` },
          { value: "ditolak", label: `Ditolak (${counts.ditolak})` },
        ]}
        value={tab}
        onChange={(v) => {
          setTab(v);
          setData(null);
        }}
        className="mb-4"
      />

      {!data ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState title="Belum ada pendaftar" />
      ) : (
        <div className="space-y-4">
          {data.map((p) => {
            const badge = STATUS_BADGE[p.status] ?? STATUS_BADGE.pending;
            return (
              <Card key={p.id} className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{p.nama_lengkap}</h3>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {p.sekolah}
                      {p.kelas ? ` · ${p.kelas}` : ""} · {p.email} · {p.whatsapp}
                    </p>
                    {p.bidang && p.bidang.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {p.bidang.map((b) => (
                          <Badge key={b} variant="outline">
                            {b}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {p.motivasi && (
                      <p className="mt-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                        {p.motivasi}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-slate-400">Daftar: {formatDate(p.created_at)}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {p.berkas_url && (
                      <a href={p.berkas_url} target="_blank" rel="noreferrer">
                        <Button variant="outline" size="sm">
                          Lihat Berkas
                        </Button>
                      </a>
                    )}
                    {p.status === "pending" && (
                      <>
                        <Button size="sm" variant="success" onClick={() => setStatus(p, "diterima")}>
                          <Check className="h-4 w-4" /> Terima
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => setStatus(p, "ditolak")}>
                          <X className="h-4 w-4" /> Tolak
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

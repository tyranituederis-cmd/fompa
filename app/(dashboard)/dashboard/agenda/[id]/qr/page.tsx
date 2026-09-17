"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";

export default function AgendaQrPage() {
  const { id } = useParams<{ id: string }>();
  const [agenda, setAgenda] = React.useState<{ judul: string; lokasi: string | null } | null>(null);

  React.useEffect(() => {
    fetch(`/api/agenda/${id}`)
      .then((r) => r.json())
      .then((res) => setAgenda(res.data ?? null))
      .catch(() => setAgenda(null));
  }, [id]);

  const absensiUrl = `${window.location.origin}/absensi/${id}`;

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title="QR Absensi" description="Cetak / tampilkan QR ini di lokasi kegiatan." />
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          {!agenda ? (
            <Skeleton className="h-64 w-64 rounded-2xl" />
          ) : (
            <>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{agenda.judul}</h2>
              {agenda.lokasi && <p className="text-sm text-slate-400">{agenda.lokasi}</p>}
              <div className="rounded-2xl border-4 border-slate-900 p-4 dark:border-white">
                <QRCodeSVG value={absensiUrl} size={220} level="M" />
              </div>
              <p className="text-xs text-slate-400">Pengurus memindai QR ini untuk mengisi presensi</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(absensiUrl);
                      toast("Tautan absensi disalin");
                    } catch {
                      toast("Gagal menyalin", "error");
                    }
                  }}
                >
                  <Download className="h-4 w-4" /> Salin Tautan
                </Button>
                <Button onClick={() => window.print()}>
                  <Download className="h-4 w-4" /> Cetak QR
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";

const STATUS_BADGE: Record<string, { label: string; variant: "default" | "success" | "warning" | "info" | "danger" }> = {
  published: { label: "Terbit", variant: "success" },
  draft: { label: "Draft", variant: "warning" },
  scheduled: { label: "Terjadwal", variant: "info" },
};

interface BeritaRow {
  id: string;
  judul: string;
  kategori: string | null;
  status: string;
  views: number;
  likes: number;
  published_at: string | null;
}

export default function BeritaManagePage() {
  const router = useRouter();
  const [data, setData] = React.useState<BeritaRow[] | null>(null);
  const [status, setStatus] = React.useState("semua");

  const load = React.useCallback(async () => {
    const params = status === "semua" ? "" : `?status=${status}`;
    const res = await fetch(`/api/berita${params}`);
    const json = await res.json();
    setData(json.data ?? []);
  }, [status]);

  React.useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm("Hapus berita ini?")) return;
    const res = await fetch(`/api/berita/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Berita dihapus");
      load();
    } else {
      toast("Gagal menghapus", "error");
    }
  };

  return (
    <div>
      <PageHeader
        title="Kelola Berita"
        description="Tulis, jadwalkan, dan kelola berita organisasi."
        action={
          <Link href="/dashboard/berita/baru">
            <Button>
              <Plus className="h-4 w-4" /> Tulis Berita
            </Button>
          </Link>
        }
      />

      <Tabs
        tabs={[
          { value: "semua", label: "Semua" },
          { value: "published", label: "Terbit" },
          { value: "draft", label: "Draft" },
          { value: "scheduled", label: "Terjadwal" },
        ]}
        value={status}
        onChange={(v) => {
          setStatus(v);
          setData(null);
        }}
        className="mb-4"
      />

      {!data ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState title="Belum ada berita" description="Klik 'Tulis Berita' untuk membuat berita pertama." />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <THead>
              <TR>
                <TH>Judul</TH>
                <TH>Kategori</TH>
                <TH>Status</TH>
                <TH>Dilihat</TH>
                <TH>Terbit</TH>
                <TH className="text-right">Aksi</TH>
              </TR>
            </THead>
            <TBody>
              {data.map((b) => {
                const badge = STATUS_BADGE[b.status] ?? { label: b.status, variant: "default" as const };
                return (
                  <TR key={b.id}>
                    <TD className="max-w-xs">
                      <p className="truncate font-medium">{b.judul}</p>
                    </TD>
                    <TD>{b.kategori ?? "-"}</TD>
                    <TD>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </TD>
                    <TD>{b.views}</TD>
                    <TD className="whitespace-nowrap">{formatDate(b.published_at)}</TD>
                    <TD>
                      <div className="flex justify-end gap-1">
                        <Link href={`/dashboard/berita/${b.id}`}>
                          <Button variant="ghost" size="iconSm" aria-label="Edit">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="iconSm" aria-label="Hapus" onClick={() => remove(b.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
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

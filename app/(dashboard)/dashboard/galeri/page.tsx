"use client";

import * as React from "react";
import { UploadCloud, Loader2, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select, Label, Field } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "@/components/ui/toast";
import type { GaleriItem } from "@/lib/types";

export default function GaleriManagePage() {
  const [data, setData] = React.useState<GaleriItem[] | null>(null);
  const [judul, setJudul] = React.useState("");
  const [kategori, setKategori] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  const load = React.useCallback(async () => {
    const res = await fetch("/api/galeri");
    const json = await res.json();
    setData(json.data ?? []);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!judul.trim()) return toast("Isi judul foto dulu", "error");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "galeri");
      const up = await fetch("/api/upload", { method: "POST", body: form });
      const upData = await up.json();
      if (!up.ok) throw new Error(upData.error);

      const res = await fetch("/api/galeri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul: judul.trim(), kategori: kategori || null, url: upData.url }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast("Foto ditambahkan ke galeri");
      setJudul("");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Gagal upload", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const remove = async (g: GaleriItem) => {
    if (!confirm(`Hapus foto "${g.judul}"?`)) return;
    const res = await fetch(`/api/galeri/${g.id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Foto dihapus");
      load();
    } else {
      toast("Gagal", "error");
    }
  };

  return (
    <div>
      <PageHeader title="Galeri" description="Unggah dan kelola dokumentasi kegiatan." />

      <Card className="mb-6 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_200px_auto]">
          <Field>
            <Label>Judul Foto *</Label>
            <Input value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Contoh: LKO FOMPA XIV" />
          </Field>
          <Field>
            <Label>Kategori</Label>
            <Select value={kategori} onChange={(e) => setKategori(e.target.value)}>
              <option value="">Umum</option>
              {["LKO", "Seminar", "Muker", "Workshop", "Kaderisasi", "Sosial"].map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex items-end">
            <label className="cursor-pointer">
              <Button asChild={false} disabled={uploading} className="w-full">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />} Pilih Foto
              </Button>
              <input type="file" accept="image/*" className="hidden" onChange={upload} disabled={uploading} />
            </label>
          </div>
        </div>
      </Card>

      {!data ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState title="Galeri kosong" description="Unggah foto pertama Anda." />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {data.map((g) => (
            <div key={g.id} className="group relative overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.url} alt={g.judul} className="aspect-square w-full object-cover" />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="truncate text-sm font-medium text-white">{g.judul}</p>
                <div className="mt-1 flex items-center justify-between">
                  <Badge className="bg-white/20 text-white">{g.kategori ?? "Umum"}</Badge>
                  <button onClick={() => remove(g)} className="rounded-full bg-white/20 p-1.5 text-white hover:bg-red-500" aria-label="Hapus">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

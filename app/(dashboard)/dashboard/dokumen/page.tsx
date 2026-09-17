"use client";

import * as React from "react";
import { UploadCloud, Loader2, Trash2, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Input, Select, Label, Field } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";
import type { Dokumen } from "@/lib/types";

const KATEGORI = ["AD/ART", "TOR", "Proposal", "LPJ", "Sertifikat", "Surat"];

export default function DokumenManagePage() {
  const [data, setData] = React.useState<Dokumen[] | null>(null);
  const [nama, setNama] = React.useState("");
  const [kategori, setKategori] = React.useState("Proposal");
  const [isPublic, setIsPublic] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);

  const load = React.useCallback(async () => {
    const res = await fetch("/api/dokumen");
    const json = await res.json();
    setData(json.data ?? []);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!nama.trim()) return toast("Isi nama dokumen dulu", "error");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "dokumen");
      const up = await fetch("/api/upload", { method: "POST", body: form });
      const upData = await up.json();
      if (!up.ok) throw new Error(upData.error);

      const res = await fetch("/api/dokumen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: nama.trim(),
          kategori,
          file_url: upData.url,
          tipe: upData.type,
          ukuran: upData.size,
          is_public: isPublic,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast("Dokumen diunggah");
      setNama("");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Gagal upload", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const remove = async (d: Dokumen) => {
    if (!confirm(`Hapus dokumen "${d.nama}"?`)) return;
    const res = await fetch(`/api/dokumen/${d.id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Dokumen dihapus");
      load();
    } else {
      toast("Gagal", "error");
    }
  };

  return (
    <div>
      <PageHeader title="Dokumen" description="Unggah dan kelola repository dokumen organisasi." />

      <Card className="mb-6 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_180px_140px_auto]">
          <Field>
            <Label>Nama Dokumen *</Label>
            <Input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Proposal LKO XV" />
          </Field>
          <Field>
            <Label>Kategori</Label>
            <Select value={kategori} onChange={(e) => setKategori(e.target.value)}>
              {KATEGORI.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label>Akses</Label>
            <Select value={isPublic ? "public" : "internal"} onChange={(e) => setIsPublic(e.target.value === "public")}>
              <option value="public">Publik</option>
              <option value="internal">Internal</option>
            </Select>
          </Field>
          <div className="flex items-end">
            <label className="cursor-pointer">
              <Button disabled={uploading}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />} Pilih File
              </Button>
              <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx" className="hidden" onChange={upload} disabled={uploading} />
            </label>
          </div>
        </div>
      </Card>

      {!data ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState title="Belum ada dokumen" />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <THead>
              <TR>
                <TH>Nama</TH>
                <TH>Kategori</TH>
                <TH>Akses</TH>
                <TH>Ukuran</TH>
                <TH>Tanggal</TH>
                <TH className="text-right">Aksi</TH>
              </TR>
            </THead>
            <TBody>
              {data.map((d) => (
                <TR key={d.id}>
                  <TD className="max-w-xs font-medium">
                    <p className="truncate">{d.nama}</p>
                  </TD>
                  <TD>
                    <Badge>{d.kategori}</Badge>
                  </TD>
                  <TD>{d.is_public ? "Publik" : "Internal"}</TD>
                  <TD>{d.ukuran ? `${Math.max(1, Math.round(d.ukuran / 1024))} KB` : "-"}</TD>
                  <TD className="whitespace-nowrap">{formatDate(d.created_at)}</TD>
                  <TD>
                    <div className="flex justify-end gap-1">
                      <a href={d.file_url} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="iconSm" aria-label="Buka">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                      <Button variant="ghost" size="iconSm" onClick={() => remove(d)} aria-label="Hapus">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

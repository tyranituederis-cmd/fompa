"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, QrCode, Award, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Dialog } from "@/components/ui/dialog";
import { Input, Textarea, Select, Label, Field } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";
import type { Agenda } from "@/lib/types";

const STATUS = [
  { value: "akan_datang", label: "Akan Datang" },
  { value: "berlangsung", label: "Berlangsung" },
  { value: "selesai", label: "Selesai" },
  { value: "batal", label: "Dibatalkan" },
];

export default function AgendaManagePage() {
  const [data, setData] = React.useState<Agenda[] | null>(null);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Agenda | null>(null);
  const [generating, setGenerating] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({ judul: "", deskripsi: "", tanggal: "", lokasi: "", kategori: "", status: "akan_datang" });

  const load = React.useCallback(async () => {
    const res = await fetch("/api/agenda");
    const json = await res.json();
    setData(json.data ?? []);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const openForm = (a?: Agenda) => {
    setEditing(a ?? null);
    setForm(
      a
        ? { judul: a.judul, deskripsi: a.deskripsi ?? "", tanggal: a.tanggal.slice(0, 16), lokasi: a.lokasi ?? "", kategori: a.kategori ?? "", status: a.status }
        : { judul: "", deskripsi: "", tanggal: "", lokasi: "", kategori: "", status: "akan_datang" }
    );
    setOpen(true);
  };

  const save = async () => {
    if (!form.judul || !form.tanggal) return toast("Judul dan tanggal wajib diisi", "error");
    setSaving(true);
    try {
      const payload = {
        judul: form.judul,
        deskripsi: form.deskripsi || null,
        tanggal: new Date(form.tanggal).toISOString(),
        lokasi: form.lokasi || null,
        kategori: form.kategori || null,
        status: form.status,
      };
      const res = await fetch(editing ? `/api/agenda/${editing.id}` : "/api/agenda", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast("Agenda disimpan");
      setOpen(false);
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Gagal", "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (a: Agenda) => {
    if (!confirm(`Hapus agenda "${a.judul}"?`)) return;
    const res = await fetch(`/api/agenda/${a.id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Agenda dihapus");
      load();
    }
  };

  const generateSertifikat = async (a: Agenda) => {
    if (!confirm(`Generate e-sertifikat untuk semua peserta hadir pada "${a.judul}"?`)) return;
    setGenerating(a.id);
    try {
      const res = await fetch(`/api/agenda/${a.id}/sertifikat`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast(`Berhasil membuat ${json.data?.length ?? 0} sertifikat`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Gagal", "error");
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Agenda"
        description="Kelola agenda, QR absensi, dan e-sertifikat kegiatan."
        action={
          <Button onClick={() => openForm()}>
            <Plus className="h-4 w-4" /> Buat Agenda
          </Button>
        }
      />

      {!data ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState title="Belum ada agenda" />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <THead>
              <TR>
                <TH>Judul</TH>
                <TH>Tanggal</TH>
                <TH>Lokasi</TH>
                <TH>Status</TH>
                <TH className="text-right">Aksi</TH>
              </TR>
            </THead>
            <TBody>
              {data.map((a) => (
                <TR key={a.id}>
                  <TD className="max-w-xs font-medium">
                    <p className="truncate">{a.judul}</p>
                  </TD>
                  <TD className="whitespace-nowrap">{formatDate(a.tanggal)}</TD>
                  <TD className="max-w-[160px] truncate">{a.lokasi ?? "-"}</TD>
                  <TD>
                    <Badge variant={a.status === "batal" ? "danger" : a.status === "berlangsung" ? "success" : a.status === "selesai" ? "info" : "warning"}>
                      {a.status.replace("_", " ")}
                    </Badge>
                  </TD>
                  <TD>
                    <div className="flex justify-end gap-1">
                      <Link href={`/dashboard/agenda/${a.id}/qr`}>
                        <Button variant="ghost" size="iconSm" title="QR Absensi">
                          <QrCode className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="iconSm" title="Generate E-Sertifikat" disabled={generating === a.id} onClick={() => generateSertifikat(a)}>
                        {generating === a.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="iconSm" onClick={() => openForm(a)} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="iconSm" onClick={() => remove(a)} aria-label="Hapus">
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

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Agenda" : "Buat Agenda"}>
        <div className="space-y-4">
          <Field>
            <Label>Judul *</Label>
            <Input value={form.judul} onChange={(e) => setForm((f) => ({ ...f, judul: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label>Tanggal & Waktu *</Label>
              <Input type="datetime-local" value={form.tanggal} onChange={(e) => setForm((f) => ({ ...f, tanggal: e.target.value }))} />
            </Field>
            <Field>
              <Label>Status</Label>
              <Select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                {STATUS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label>Lokasi</Label>
              <Input value={form.lokasi} onChange={(e) => setForm((f) => ({ ...f, lokasi: e.target.value }))} />
            </Field>
            <Field>
              <Label>Kategori</Label>
              <Input value={form.kategori} onChange={(e) => setForm((f) => ({ ...f, kategori: e.target.value }))} placeholder="Rapat / Pelatihan" />
            </Field>
          </div>
          <Field>
            <Label>Deskripsi</Label>
            <Textarea value={form.deskripsi} onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))} />
          </Field>
          <Button className="w-full" onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Simpan
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

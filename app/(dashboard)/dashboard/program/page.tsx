"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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
import type { ProgramKerja } from "@/lib/types";

const KATEGORI = ["Kaderisasi", "Musyawarah Kerja", "Latihan Kepemimpinan Organisasi", "Seminar Pendidikan", "Workshop", "Open Recruitment"];
const STATUS = [
  { value: "akan_datang", label: "Akan Datang" },
  { value: "berjalan", label: "Berjalan" },
  { value: "selesai", label: "Selesai" },
  { value: "ditunda", label: "Ditunda" },
];

export default function ProgramManagePage() {
  const [data, setData] = React.useState<ProgramKerja[] | null>(null);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ProgramKerja | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({ nama: "", kategori: KATEGORI[0], deskripsi: "", tanggal: "", cover: "", status: "akan_datang" });

  const load = React.useCallback(async () => {
    const res = await fetch("/api/program");
    const json = await res.json();
    setData(json.data ?? []);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const openForm = (p?: ProgramKerja) => {
    setEditing(p ?? null);
    setForm(
      p
        ? { nama: p.nama, kategori: p.kategori, deskripsi: p.deskripsi, tanggal: p.tanggal ? p.tanggal.slice(0, 16) : "", cover: p.cover ?? "", status: p.status }
        : { nama: "", kategori: KATEGORI[0], deskripsi: "", tanggal: "", cover: "", status: "akan_datang" }
    );
    setOpen(true);
  };

  const save = async () => {
    if (!form.nama || form.deskripsi.length < 10) return toast("Nama dan deskripsi wajib diisi (min 10 karakter)", "error");
    setSaving(true);
    try {
      const payload = {
        nama: form.nama,
        kategori: form.kategori,
        deskripsi: form.deskripsi,
        tanggal: form.tanggal ? new Date(form.tanggal).toISOString() : null,
        cover: form.cover || null,
        status: form.status,
      };
      const res = await fetch(editing ? `/api/program/${editing.id}` : "/api/program", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast("Program kerja disimpan");
      setOpen(false);
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Gagal", "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p: ProgramKerja) => {
    if (!confirm(`Hapus program "${p.nama}"?`)) return;
    const res = await fetch(`/api/program/${p.id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Program dihapus");
      load();
    }
  };

  return (
    <div>
      <PageHeader
        title="Program Kerja"
        description="Kelola program kerja FOMPA."
        action={
          <Button onClick={() => openForm()}>
            <Plus className="h-4 w-4" /> Tambah Program
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
        <EmptyState title="Belum ada program kerja" />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <THead>
              <TR>
                <TH>Nama</TH>
                <TH>Kategori</TH>
                <TH>Tanggal</TH>
                <TH>Status</TH>
                <TH className="text-right">Aksi</TH>
              </TR>
            </THead>
            <TBody>
              {data.map((p) => (
                <TR key={p.id}>
                  <TD className="max-w-xs font-medium">
                    <p className="truncate">{p.nama}</p>
                  </TD>
                  <TD>{p.kategori}</TD>
                  <TD className="whitespace-nowrap">{formatDate(p.tanggal)}</TD>
                  <TD>
                    <Badge variant={p.status === "selesai" ? "info" : p.status === "berjalan" ? "success" : p.status === "ditunda" ? "danger" : "warning"}>
                      {p.status.replace("_", " ")}
                    </Badge>
                  </TD>
                  <TD>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="iconSm" onClick={() => openForm(p)} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="iconSm" onClick={() => remove(p)} aria-label="Hapus">
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

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Program" : "Tambah Program"}>
        <div className="space-y-4">
          <Field>
            <Label>Nama Program *</Label>
            <Input value={form.nama} onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label>Kategori</Label>
              <Select value={form.kategori} onChange={(e) => setForm((f) => ({ ...f, kategori: e.target.value }))}>
                {KATEGORI.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </Select>
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
          <Field>
            <Label>Deskripsi *</Label>
            <Textarea value={form.deskripsi} onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label>Tanggal</Label>
              <Input type="datetime-local" value={form.tanggal} onChange={(e) => setForm((f) => ({ ...f, tanggal: e.target.value }))} />
            </Field>
            <Field>
              <Label>URL Cover</Label>
              <Input value={form.cover} onChange={(e) => setForm((f) => ({ ...f, cover: e.target.value }))} placeholder="https://…" />
            </Field>
          </div>
          <Button className="w-full" onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Simpan
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

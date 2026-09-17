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
import type { Pengurus } from "@/lib/types";

const BIDANG = ["Pengurus Inti", "Kaderisasi", "Media Informasi", "Sekretariat", "Bendahara", "Humas", "Kegiatan", "Alumni"];

const EMPTY: Record<string, string> = {
  nama: "",
  jabatan: "",
  bidang: "",
  generasi: "",
  sekolah: "",
  foto_url: "",
  bio: "",
  status: "aktif",
  sosmed: "",
  tiktok: "",
};

export default function PengurusManagePage() {
  const [data, setData] = React.useState<Pengurus[] | null>(null);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Pengurus | null>(null);
  const [form, setForm] = React.useState<Record<string, string>>(EMPTY);
  const [saving, setSaving] = React.useState(false);

  const load = React.useCallback(async () => {
    const res = await fetch("/api/pengurus");
    const json = await res.json();
    setData(json.data ?? []);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };

  const openEdit = (p: Pengurus) => {
    setEditing(p);
    setForm({
      nama: p.nama,
      jabatan: p.jabatan,
      bidang: p.bidang ?? "",
      generasi: p.generasi ?? "",
      sekolah: p.sekolah ?? "",
      foto_url: p.foto_url ?? "",
      bio: p.bio ?? "",
      status: p.status,
      sosmed: p.sosmed?.instagram ?? "",
      tiktok: p.sosmed?.tiktok ?? "",
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.nama || !form.jabatan) return toast("Nama dan jabatan wajib diisi", "error");
    setSaving(true);
    try {
      const payload = {
        nama: form.nama,
        jabatan: form.jabatan,
        bidang: form.bidang || null,
        generasi: form.generasi || null,
        sekolah: form.sekolah || null,
        foto_url: form.foto_url || null,
        bio: form.bio || null,
        status: form.status,
        sosmed: { instagram: form.sosmed || null, tiktok: form.tiktok || null },
      };
      const res = await fetch(editing ? `/api/pengurus/${editing.id}` : "/api/pengurus", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast(editing ? "Pengurus diperbarui" : "Pengurus ditambahkan");
      setOpen(false);
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Gagal", "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p: Pengurus) => {
    if (!confirm(`Hapus ${p.nama}?`)) return;
    const res = await fetch(`/api/pengurus/${p.id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Pengurus dihapus");
      load();
    } else {
      toast("Gagal menghapus", "error");
    }
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <PageHeader
        title="Kelola Pengurus"
        description="Tambah, edit, dan kelola data pengurus."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Tambah Pengurus
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
        <EmptyState title="Belum ada pengurus" description="Tambahkan pengurus pertama." />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <THead>
              <TR>
                <TH>Nama</TH>
                <TH>Jabatan</TH>
                <TH>Bidang</TH>
                <TH>Generasi</TH>
                <TH>Sekolah</TH>
                <TH>Status</TH>
                <TH className="text-right">Aksi</TH>
              </TR>
            </THead>
            <TBody>
              {data.map((p) => (
                <TR key={p.id}>
                  <TD className="font-medium">{p.nama}</TD>
                  <TD>{p.jabatan}</TD>
                  <TD>{p.bidang ?? "-"}</TD>
                  <TD>{p.generasi ?? "-"}</TD>
                  <TD className="max-w-[180px] truncate">{p.sekolah ?? "-"}</TD>
                  <TD>
                    <Badge variant={p.status === "aktif" ? "success" : "outline"}>{p.status}</Badge>
                  </TD>
                  <TD>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="iconSm" onClick={() => openEdit(p)} aria-label="Edit">
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

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Pengurus" : "Tambah Pengurus"}>
        <div className="space-y-4">
          <Field>
            <Label>Nama Lengkap *</Label>
            <Input value={form.nama} onChange={set("nama")} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label>Jabatan *</Label>
              <Input value={form.jabatan} onChange={set("jabatan")} />
            </Field>
            <Field>
              <Label>Bidang</Label>
              <Select value={form.bidang} onChange={set("bidang")}>
                <option value="">Pilih bidang</option>
                {BIDANG.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label>Generasi</Label>
              <Input value={form.generasi} onChange={set("generasi")} placeholder="FOMPA XIV" />
            </Field>
            <Field>
              <Label>Sekolah Asal</Label>
              <Input value={form.sekolah} onChange={set("sekolah")} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label>Instagram</Label>
              <Input value={form.sosmed} onChange={set("sosmed")} placeholder="@username" />
            </Field>
            <Field>
              <Label>TikTok</Label>
              <Input value={form.tiktok} onChange={set("tiktok")} placeholder="@username" />
            </Field>
          </div>
          <Field>
            <Label>URL Foto</Label>
            <Input value={form.foto_url} onChange={set("foto_url")} placeholder="https://…" />
          </Field>
          <Field>
            <Label>Bio</Label>
            <Textarea value={form.bio} onChange={set("bio")} />
          </Field>
          <Field>
            <Label>Status</Label>
            <Select value={form.status} onChange={set("status")}>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </Select>
          </Field>
          <Button className="w-full" onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Simpan
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

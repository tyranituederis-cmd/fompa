"use client";

import * as React from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Dialog } from "@/components/ui/dialog";
import { Input, Select, Label, Field } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";

const ROLES = ["super_admin", "admin", "koordinator_bidang", "pengurus", "alumni"];

interface UserRow {
  id: string;
  email: string;
  name: string;
  status: string;
  role: string;
  role_label: string;
  created_at: string;
}

export default function UserManagePage() {
  const [data, setData] = React.useState<UserRow[] | null>(null);
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", password: "", role: "pengurus" });

  const load = React.useCallback(async () => {
    const res = await fetch("/api/users");
    if (res.status === 403) return setData([]);
    const json = await res.json();
    setData(json.data ?? []);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast("Akun dibuat");
      setOpen(false);
      setForm({ name: "", email: "", password: "", role: "pengurus" });
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Gagal", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (u: UserRow) => {
    const next = u.status === "active" ? "inactive" : "active";
    const res = await fetch(`/api/users/${u.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) {
      toast(`Akun ${next === "active" ? "diaktifkan" : "dinonaktifkan"}`);
      load();
    }
  };

  const remove = async (u: UserRow) => {
    if (!confirm(`Hapus akun ${u.email}?`)) return;
    const res = await fetch(`/api/users/${u.id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Akun dihapus");
      load();
    } else {
      const json = await res.json().catch(() => ({}));
      toast(json.error ?? "Gagal (khusus Super Admin)", "error");
    }
  };

  return (
    <div>
      <PageHeader
        title="Kelola User"
        description="Tambah admin dan pengurus, atur role serta status akun."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Tambah Akun
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
        <EmptyState title="Tidak ada user" description="Anda mungkin tidak memiliki akses." />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <THead>
              <TR>
                <TH>Nama</TH>
                <TH>Email</TH>
                <TH>Role</TH>
                <TH>Status</TH>
                <TH>Dibuat</TH>
                <TH className="text-right">Aksi</TH>
              </TR>
            </THead>
            <TBody>
              {data.map((u) => (
                <TR key={u.id}>
                  <TD className="font-medium">{u.name}</TD>
                  <TD>{u.email}</TD>
                  <TD>
                    <Badge>{u.role_label ?? u.role}</Badge>
                  </TD>
                  <TD>
                    <Badge variant={u.status === "active" ? "success" : "danger"}>{u.status}</Badge>
                  </TD>
                  <TD className="whitespace-nowrap">{formatDate(u.created_at)}</TD>
                  <TD>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => toggleStatus(u)}>
                        {u.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                      </Button>
                      <Button variant="ghost" size="iconSm" onClick={() => remove(u)} aria-label="Hapus">
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

      <Dialog open={open} onClose={() => setOpen(false)} title="Tambah Akun">
        <div className="space-y-4">
          <Field>
            <Label>Nama Lengkap *</Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </Field>
          <Field>
            <Label>Email *</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label>Password *</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Min. 8 karakter" />
            </Field>
            <Field>
              <Label>Role *</Label>
              <Select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.replace("_", " ")}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Button className="w-full" onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Buat Akun
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

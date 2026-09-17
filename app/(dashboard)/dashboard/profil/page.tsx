"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Save, KeyRound } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Field } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

export default function ProfilPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session]);

  if (!session) return null;

  const saveProfile = async () => {
    setSaving(true);
    try {
      const payload: Record<string, string> = { name };
      if (password) {
        if (password.length < 8) {
          toast("Password minimal 8 karakter", "error");
          return;
        }
        if (password !== confirm) {
          toast("Konfirmasi password tidak cocok", "error");
          return;
        }
        payload.password = password;
      }
      const res = await fetch(`/api/users/${session.user.uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast("Profil diperbarui");
      setPassword("");
      setConfirm("");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Gagal", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Profil Saya" description="Kelola nama dan password akun Anda." />
      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center gap-4">
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt={session.user.name ?? ""} className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {(session.user.name ?? "?").charAt(0)}
              </span>
            )}
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{session.user.name}</p>
              <p className="text-sm text-slate-400">{session.user.email}</p>
            </div>
          </div>

          <Field>
            <Label>Nama Lengkap</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>

          <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
            <CardTitle className="mb-4 flex items-center gap-2 text-base">
              <KeyRound className="h-4 w-4 text-primary" /> Ganti Password
            </CardTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <Label>Password Baru</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 karakter" />
              </Field>
              <Field>
                <Label>Konfirmasi Password</Label>
                <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </Field>
            </div>
          </div>

          <Button onClick={saveProfile} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan Perubahan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

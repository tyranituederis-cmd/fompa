"use client";

import * as React from "react";
import { Loader2, Save } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Textarea, Label, Field } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";

export default function PengaturanPage() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((res) => {
        const s = res.data ?? {};
        setForm({
          org_name: String(s.org_name ?? ""),
          motto: String(s.motto ?? ""),
          primary_color: String(s.primary_color ?? "#D62828"),
          hero_title: String(s.hero_title ?? ""),
          hero_subtitle: String(s.hero_subtitle ?? ""),
          alamat: String(s.alamat ?? ""),
          email: String(s.email ?? ""),
          whatsapp: String(s.whatsapp ?? ""),
          instagram: String(s.instagram ?? ""),
          tiktok: String(s.tiktok ?? ""),
          google_calendar_embed: String(s.google_calendar_embed ?? ""),
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      // Terapkan warna tema tanpa reload
      document.documentElement.style.setProperty("--primary", form.primary_color);
      toast("Pengaturan disimpan");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Gagal", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <PageHeader title="Pengaturan Website" description="Ubah identitas, tema, dan kontak organisasi tanpa menyentuh kode." />
      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <Label>Nama Organisasi</Label>
              <Input value={form.org_name} onChange={set("org_name")} />
            </Field>
            <Field>
              <Label>Motto</Label>
              <Input value={form.motto} onChange={set("motto")} />
            </Field>
          </div>
          <Field>
            <Label>Warna Utama (tema organisasi)</Label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.primary_color} onChange={set("primary_color")} className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 dark:border-slate-700" />
              <Input value={form.primary_color} onChange={set("primary_color")} className="max-w-[140px] font-mono" />
            </div>
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <Label>Judul Hero (beranda)</Label>
              <Input value={form.hero_title} onChange={set("hero_title")} />
            </Field>
            <Field>
              <Label>Subjudul Hero</Label>
              <Input value={form.hero_subtitle} onChange={set("hero_subtitle")} />
            </Field>
          </div>
          <Field>
            <Label>Alamat Sekretariat</Label>
            <Textarea value={form.alamat} onChange={set("alamat")} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <Label>Email</Label>
              <Input value={form.email} onChange={set("email")} />
            </Field>
            <Field>
              <Label>WhatsApp</Label>
              <Input value={form.whatsapp} onChange={set("whatsapp")} />
            </Field>
            <Field>
              <Label>Instagram</Label>
              <Input value={form.instagram} onChange={set("instagram")} />
            </Field>
            <Field>
              <Label>TikTok</Label>
              <Input value={form.tiktok} onChange={set("tiktok")} />
            </Field>
          </div>
          <Field>
            <Label>Google Calendar Embed (iframe src)</Label>
            <Textarea value={form.google_calendar_embed} onChange={set("google_calendar_embed")} placeholder="https://calendar.google.com/calendar/embed?src=…" />
            <p className="mt-1 text-xs text-slate-400">Tempel src iframe kalender Google publik untuk ditampilkan di halaman Agenda.</p>
          </Field>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan Pengaturan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

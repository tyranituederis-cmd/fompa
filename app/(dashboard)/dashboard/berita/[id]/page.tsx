"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Save, Send } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select, Label, Field } from "@/components/ui/input";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";

export default function BeritaEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [konten, setKonten] = React.useState("");
  const [kategori, setKategori] = React.useState<{ id: string; nama: string }[]>([]);
  const [meta, setMeta] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    (async () => {
      const [beritaRes, katRes] = await Promise.all([
        fetch(`/api/berita/${id}`),
        fetch("/api/kategori-berita"),
      ]);
      const berita = (await beritaRes.json()).data;
      setKategori((await katRes.json()).data ?? []);
      if (berita) {
        setKonten(berita.konten ?? "");
        setMeta({
          judul: berita.judul ?? "",
          ringkasan: berita.ringkasan ?? "",
          thumbnail: berita.thumbnail ?? "",
          kategori_id: berita.kategori_id ?? "",
          tags: (berita.tags ?? []).join(", "),
          status: berita.status ?? "draft",
        });
      }
      setLoading(false);
    })();
  }, [id]);

  const submit = async (status?: string) => {
    const targetStatus = status ?? meta.status;
    setSaving(true);
    try {
      const res = await fetch(`/api/berita/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul: meta.judul,
          konten,
          ringkasan: meta.ringkasan || null,
          thumbnail: meta.thumbnail || null,
          kategori_id: meta.kategori_id || null,
          tags: meta.tags.split(",").map((t) => t.trim()).filter(Boolean),
          status: targetStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast("Berita diperbarui");
      router.push("/dashboard/berita");
      router.refresh();
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
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Edit Berita" description="Perbarui konten berita." />
      <div className="space-y-5">
        <Field>
          <Label htmlFor="judul">Judul Berita *</Label>
          <Input id="judul" value={meta.judul} onChange={(e) => setMeta((m) => ({ ...m, judul: e.target.value }))} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <Label>Kategori</Label>
            <Select value={meta.kategori_id} onChange={(e) => setMeta((m) => ({ ...m, kategori_id: e.target.value }))}>
              <option value="">Tanpa kategori</option>
              {kategori.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label>Tag</Label>
            <Input value={meta.tags} onChange={(e) => setMeta((m) => ({ ...m, tags: e.target.value }))} placeholder="kegiatan, lko" />
          </Field>
        </div>
        <Field>
          <Label>Ringkasan</Label>
          <Textarea value={meta.ringkasan} onChange={(e) => setMeta((m) => ({ ...m, ringkasan: e.target.value }))} />
        </Field>
        <Field>
          <Label>URL Thumbnail</Label>
          <Input value={meta.thumbnail} onChange={(e) => setMeta((m) => ({ ...m, thumbnail: e.target.value }))} />
        </Field>
        <Field>
          <Label>Konten *</Label>
          <RichTextEditor value={konten} onChange={setKonten} />
        </Field>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" disabled={saving} onClick={() => submit("draft")}>
            Simpan Draft
          </Button>
          <Button type="button" disabled={saving} onClick={() => submit("published")}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Terbitkan
          </Button>
        </div>
      </div>
    </div>
  );
}

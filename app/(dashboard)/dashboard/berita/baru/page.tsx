"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Send } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select, Label, Field } from "@/components/ui/input";
import { RichTextEditor } from "@/components/rich-text-editor";
import { toast } from "@/components/ui/toast";

export default function BeritaBaruPage() {
  const router = useRouter();
  const [konten, setKonten] = React.useState("");
  const [kategori, setKategori] = React.useState<{ id: string; nama: string }[]>([]);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/kategori-berita")
      .then((r) => r.json())
      .then((res) => setKategori(res.data ?? []))
      .catch(() => {});
  }, []);

  const submit = async (status: "draft" | "published" | "scheduled") => {
    const form = document.getElementById("berita-form") as HTMLFormElement;
    if (!form) return;
    const fd = new FormData(form);
    const judul = String(fd.get("judul") ?? "").trim();
    if (judul.length < 5) return toast("Judul minimal 5 karakter", "error");
    if (konten.length < 10) return toast("Konten terlalu pendek", "error");

    setSaving(true);
    try {
      const res = await fetch("/api/berita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul,
          konten,
          ringkasan: String(fd.get("ringkasan") ?? "") || null,
          thumbnail: String(fd.get("thumbnail") ?? "") || null,
          kategori_id: String(fd.get("kategori_id") ?? "") || null,
          tags: String(fd.get("tags") ?? "").split(",").map((t) => t.trim()).filter(Boolean),
          status,
          published_at: status === "scheduled" ? String(fd.get("published_at") ?? "") || null : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast(status === "draft" ? "Draft berita disimpan" : "Berita diterbitkan");
      router.push("/dashboard/berita");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Gagal menyimpan", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Tulis Berita" description="Buat berita baru dengan editor rich text." />
      <form id="berita-form" className="space-y-5">
        <Field>
          <Label htmlFor="judul">Judul Berita *</Label>
          <Input id="judul" name="judul" required placeholder="Judul yang menarik…" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <Label htmlFor="kategori_id">Kategori</Label>
            <Select id="kategori_id" name="kategori_id" defaultValue="">
              <option value="">Tanpa kategori</option>
              {kategori.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label htmlFor="tags">Tag (pisahkan dengan koma)</Label>
            <Input id="tags" name="tags" placeholder="kegiatan, lko, seminar" />
          </Field>
        </div>
        <Field>
          <Label htmlFor="ringkasan">Ringkasan (untuk kartu berita)</Label>
          <Textarea id="ringkasan" name="ringkasan" placeholder="1-2 kalimat ringkas…" />
        </Field>
        <Field>
          <Label htmlFor="thumbnail">URL Thumbnail</Label>
          <Input id="thumbnail" name="thumbnail" placeholder="https://… (atau upload via Galeri)" />
        </Field>
        <Field>
          <Label>Konten *</Label>
          <RichTextEditor value={konten} onChange={setKonten} />
        </Field>
        {/*
          Form untuk status terjadwal
        */}
        <Field>
          <Label htmlFor="published_at">Jadwal Terbit (jika status Terjadwal)</Label>
          <Input id="published_at" name="published_at" type="datetime-local" />
        </Field>

        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" disabled={saving} onClick={() => submit("draft")}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan Draft
          </Button>
          <Button type="button" disabled={saving} onClick={() => submit("published")}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Terbitkan
          </Button>
          <Button type="button" variant="secondary" disabled={saving} onClick={() => submit("scheduled")}>
            Jadwalkan
          </Button>
        </div>
      </form>
    </div>
  );
}

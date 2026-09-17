"use client";

import * as React from "react";
import { UploadCloud, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select, Label, Field } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const BIDANG = [
  "Kaderisasi",
  "Media Informasi",
  "Kepemimpinan",
  "Sekretariat",
  "Bendahara",
  "Hubungan Masyarakat",
  "Kewirausahaan",
  "Kegiatan & Acara",
];

export function PendaftaranForm() {
  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [berkas, setBerkas] = React.useState("");
  const [bidang, setBidang] = React.useState<string[]>([]);
  const [done, setDone] = React.useState(false);

  const toggleBidang = (b: string) =>
    setBidang((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "pendaftaran");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBerkas(data.url);
      toast("Berkas berhasil diunggah");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload gagal", "error");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (bidang.length === 0) {
      toast("Pilih minimal satu bidang", "error");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData(e.currentTarget);
      const payload = {
        nama_lengkap: String(form.get("nama_lengkap")),
        email: String(form.get("email")),
        whatsapp: String(form.get("whatsapp")),
        sekolah: String(form.get("sekolah")),
        kelas: String(form.get("kelas")),
        bidang,
        motivasi: String(form.get("motivasi")),
        berkas_url: berkas || null,
      };
      const res = await fetch("/api/pendaftaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDone(true);
      toast("Pendaftaran terkirim!");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Gagal mendaftar", "error");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center dark:border-emerald-900 dark:bg-emerald-950">
        <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">Pendaftaran Terkirim!</h3>
        <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
          Terima kasih sudah mendaftar. Tim FOMPA akan meninjau berkas Anda dan mengabari status melalui email/WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-10 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900 md:p-8">
      <Field>
        <Label htmlFor="nama_lengkap">Nama Lengkap *</Label>
        <Input id="nama_lengkap" name="nama_lengkap" required minLength={3} placeholder="Nama lengkap sesuai identitas" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required placeholder="email@contoh.com" />
        </Field>
        <Field>
          <Label htmlFor="whatsapp">No. WhatsApp *</Label>
          <Input id="whatsapp" name="whatsapp" required minLength={9} placeholder="08xxxxxxxxxx" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field>
          <Label htmlFor="sekolah">Asal Sekolah *</Label>
          <Input id="sekolah" name="sekolah" required placeholder="SMAN 1 Purwakarta" />
        </Field>
        <Field>
          <Label htmlFor="kelas">Kelas</Label>
          <Input id="kelas" name="kelas" placeholder="XI IPA 2" />
        </Field>
      </div>

      <Field>
        <Label>Bidang yang diminati *</Label>
        <div className="flex flex-wrap gap-2">
          {BIDANG.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => toggleBidang(b)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-all duration-300",
                bidang.includes(b)
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 text-slate-600 hover:border-primary/50 dark:border-slate-700 dark:text-slate-300"
              )}
            >
              {b}
            </button>
          ))}
        </div>
      </Field>

      <Field>
        <Label htmlFor="motivasi">Motivasi Bergabung *</Label>
        <Textarea id="motivasi" name="motivasi" required minLength={20} placeholder="Ceritakan alasan dan harapan Anda bergabung dengan FOMPA…" />
      </Field>

      <Field>
        <Label htmlFor="berkas">Berkas Pendukung (opsional — CV / surat rekomendasi)</Label>
        <label
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors",
            uploading
              ? "border-primary/40"
              : berkas
                ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/50"
                : "border-slate-300 hover:border-primary dark:border-slate-700"
          )}
        >
          <UploadCloud className={cn("h-6 w-6", berkas ? "text-emerald-500" : "text-slate-400")} />
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {uploading ? "Mengunggah…" : berkas ? "Berkas terunggah (klik untuk ganti)" : "Klik untuk unggah file (PDF, DOCX, JPG)"}
          </span>
          <input id="berkas" type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={uploadFile} disabled={uploading} />
        </label>
      </Field>

      <Button type="submit" size="lg" className="w-full" disabled={loading || uploading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Kirim Pendaftaran
      </Button>
    </form>
  );
}

# FOMPA — Website Resmi Forum OSIS MPK Purwakarta

Website organisasi resmi **Forum OSIS MPK Purwakarta (FOMPA)** dengan sistem manajemen konten (CMS) lengkap, sistem login bertingkat (**Super Admin + Admin + Koordinator Bidang + Pengurus + Alumni**), dashboard modern, dan fitur-fitur profesional.

> Motto: **"Bersama dalam Organisasi"**
> Warna: Merah `#D62828` · Putih `#FFFFFF` · Hitam `#111827`

---

## ✨ Fitur Utama

| Area | Fitur |
|---|---|
| **Landing Page** | Hero + logo FOMPA, animasi partikel, gradasi merah-putih, glassmorphism |
| **Halaman** | Tentang (sejarah, visi, misi, timeline generasi), Kepengurusan (filter generasi & bidang), Program Kerja, Berita (CMS + like + share + tag + jadwal terbit), Galeri (masonry + lightbox + download), Dokumen (kategori + akses), Agenda (countdown + Google Calendar), Kontak (Maps + sosmed) |
| **Sistem Login** | NextAuth JWT, 5 role (RBAC), hash bcrypt |
| **Dashboard** | Sidebar modern, statistik (Chart.js), visitor hari ini/bulan ini, agenda terdekat, notifikasi badge |
| **CMS** | CRUD berita/program/galeri/dokumen/agenda/pengurus, rich text editor (TipTap), upload file ke Supabase Storage |
| **Super Admin** | Kelola seluruh website, tambah/hapus user & pengurus, log aktivitas, pengaturan tema organisasi tanpa kode |
| **Bonus** | QR absensi kegiatan, e-sertifikat otomatis + QR verifikasi, presensi pengurus, arsip generasi FOMPA I–XIV, live visitor counter, open recruitment online, backup database, PWA, dark mode |

## 🧱 Teknologi

- **Frontend:** Next.js 15 (App Router) + React + TypeScript
- **Styling:** Tailwind CSS + shadcn-style UI (class-variance-authority)
- **Animasi:** Framer Motion (fade-up, hover, page transition) + partikel kanvas
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Supabase) dengan Row Level Security
- **Auth:** NextAuth (JWT) + bcryptjs
- **Storage:** Supabase Storage
- **Editor:** TipTap
- **Grafik:** Chart.js (react-chartjs-2)
- **Lainnya:** Lucide icons, qrcode.react, next-themes (dark mode), PWA (service worker), SEO (metadata, sitemap, robots)

## 📁 Struktur Project

```
fompa-website/
├── app/
│   ├── (public)/            # Halaman publik (landing, tentang, berita, galeri, dll.)
│   ├── (dashboard)/         # Dashboard admin & pengurus
│   ├── login/               # Halaman login
│   └── api/                 # API Routes (24 endpoint)
├── components/
│   ├── ui/                  # Primitive UI (button, card, dialog, toast, dll.)
│   ├── cards/               # Kartu konten (berita, program, pengurus, agenda, dokumen)
│   └── dashboard/           # Sidebar & komponen dashboard
├── lib/
│   ├── supabase/            # client (browser), server (cookie), admin (service role)
│   ├── auth.ts              # NextAuth config + RBAC
│   ├── api-helpers.ts       # requireRole, logActivity, broadcast, CSRF
│   ├── rate-limit.ts        # Rate limiting sliding window
│   └── validators.ts        # Validasi Zod
├── supabase/
│   ├── schema.sql           # 18 tabel + relasi + trigger + RLS
│   ├── seed.sql             # Data demo + akun demo (password otomatis di-hash)
│   └── storage.sql          # Bucket 'fompa-assets'
├── public/                  # logo.jpg, manifest PWA, service worker
├── scripts/backup.sh        # Backup database otomatis
├── middleware.ts            # Proteksi /dashboard
└── docker-compose.yml       # PostgreSQL lokal (opsional)
```

## 🚀 Instalasi Lokal

### 1. Install dependencies

```bash
npm install
```

### 2. Konfigurasi environment

```bash
cp .env.example .env.local
# lalu isi:
#   NEXT_PUBLIC_SUPABASE_URL
#   NEXT_PUBLIC_SUPABASE_ANON_KEY
#   SUPABASE_SERVICE_ROLE_KEY   (RAHASIA — jangan pernah di client)
#   NEXTAUTH_SECRET             (generate: openssl rand -base64 32)
#   NEXTAUTH_URL=http://localhost:3000
```

### 3. Database (pilih salah satu)

**Opsi A — Supabase Cloud (disarankan):**
1. Buat project di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** → jalankan `supabase/schema.sql`, lalu `supabase/seed.sql`, lalu `supabase/storage.sql`
3. Salin `Project URL`, `anon key`, dan `service_role key` dari **Settings → API**
4. Storage bucket `fompa-assets` dibuat otomatis oleh `storage.sql`

**Opsi B — Supabase CLI (lokal):**
```bash
supabase init
supabase start                 # menyediakan Postgres lokal di localhost:54322
supabase db reset              # atau jalankan schema.sql + seed.sql via SQL editor lokal
```

**Opsi C — Docker + PostgreSQL biasa:**
```bash
docker compose up -d           # Postgres 16 di localhost:54322
# supabase/schema.sql & seed.sql akan dijalankan otomatis saat container pertama kali dibuat
```

### 4. Jalankan

```bash
npm run dev
# buka http://localhost:3000
```

## 🔑 Akun Demo (Seeder)

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `admin@fompa.id` | `Admin123!` |
| Admin | `sekretaris@fompa.id` | `Sekretaris123!` |
| Koordinator Bidang | `koordinator@fompa.id` | `Koordinator123!` |
| Pengurus | `pengurus@fompa.id` | `Pengurus123!` |
| Alumni | `alumni@fompa.id` | `Alumni123!` |

> **Penting:** ganti semua password demo segera setelah deploy produksi! Password di-hash bcrypt otomatis oleh `crypt()` di seed.sql.

## ☁️ Deploy ke Vercel

1. Push project ke GitHub/GitLab
2. Di [vercel.com](https://vercel.com) → **Add New → Project** → import repo
3. Framework preset otomatis terdeteksi **Next.js**
4. Tambahkan environment variables (sama seperti `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL=https://nama-project.vercel.app`
5. Deploy 🎉

## 🧑‍💼 Panduan Penggunaan

### Super Admin
- **Dashboard** → statistik lengkap (pengurus, berita, event, dokumen, visitor)
- **User** → tambah admin/pengurus, ubah role, nonaktifkan/hapus akun
- **Pengaturan** → ubah nama, motto, **warna tema**, hero, kontak, embed Google Calendar — tanpa ubah kode
- **Log Aktivitas** → audit trail semua aksi
- **Pendaftaran** → seleksi open recruitment (terima/tolak)

### Admin
- Semua kelola konten: berita, program kerja, galeri, dokumen, agenda, pengurus
- Generate **e-sertifikat** untuk peserta hadir (dari halaman Agenda)

### Koordinator Bidang
- Kelola konten & dokumentasi bidang, lihat rekap presensi

### Pengurus
- Edit profil sendiri & ganti password
- Upload dokumentasi (foto/video/PDF/Word/Excel → Supabase Storage)
- Buat draft berita
- Lihat agenda + isi **presensi via QR** (scan QR kegiatan → halaman absensi)
- Download dokumen internal

### Alumni
- Akses read-only: lihat berita, agenda, dokumen publik, arsip generasi

## 🔒 Keamanan yang Diimplementasikan

- **JWT** session (NextAuth) + **bcrypt** hash password
- **RBAC** hierarki: `super_admin > admin > koordinator_bidang > pengurus > alumni`
- **CSRF protection** (cek Origin/Referer di semua API non-GET)
- **Rate limiting** (login, pendaftaran, upload)
- **Validasi form** (Zod) di seluruh endpoint
- **Upload validation** (tipe file, ukuran maks 10 MB)
- **Audit log** (`activity_logs`) untuk semua aksi admin
- **Row Level Security** PostgreSQL + helper `has_role()`
- Service role key hanya dipakai di server; bucket storage publik read-only, upload via API tervalidasi

## 💾 Backup Database

```bash
# Sekali jalan:
DATABASE_URL="postgresql://..." ./scripts/backup.sh

# Otomatis tiap hari jam 02.00 (cron):
0 2 * * * cd /path/to/fompa-website && DATABASE_URL="postgresql://..." ./scripts/backup.sh >> backups/backup.log 2>&1
```

Backup tersimpan di `backups/fompa_YYYYMMDD_HHMMSS.dump` (14 backup terakhir). Untuk Supabase Cloud, gunakan **Database → Backup** di dashboard sebagai lapisan kedua.

## ❓ FAQ / Catatan

- **"Belum ada env" saat build?** Semua halaman publik memakai cookie-based client (dynamic rendering), jadi `next build` aman tanpa env. Runtime membutuhkan env lengkap.
- **Komentar berita** bersifat opsional pada spesifikasi — dapat ditambahkan via tabel baru `komentar` + komponen, atau gunakan layanan pihak ketiga (Disqus/Giscus).
- **Konten HTML berita** (TipTap) dirender apa adanya; jika konten dari editor publik, tambahkan sanitasi (mis. `sanitize-html`) sebelum disimpan.
- **Google Calendar**: tempel `src` iframe kalender publik pada menu Pengaturan → otomatis tampil di halaman Agenda.
- **Rate limiter** berbasis memori — untuk multi-instance produksi, ganti dengan Redis/Upstash.

---

Dibangun dengan ❤️ untuk pelajar Purwakarta. *Bersama dalam Organisasi.*

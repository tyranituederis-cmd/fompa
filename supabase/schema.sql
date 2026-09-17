-- ============================================================================
-- FOMPA — Forum OSIS MPK Purwakarta
-- Skema Database lengkap (PostgreSQL / Supabase)
-- Jalankan di Supabase Dashboard → SQL Editor (atau `psql -f supabase/schema.sql`)
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Helper: updated_at trigger
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- Helper RLS: cek role user yang sedang login
-- ----------------------------------------------------------------------------
create or replace function public.has_role(p_role text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from users u
    join roles r on r.id = u.role_id
    where u.id = auth.uid()
      and r.name = p_role
      and u.status = 'active'
  );
$$;

-- ============================================================================
-- TABEL
-- ============================================================================

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  label text not null,
  created_at timestamptz default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  password_hash text not null,
  role_id uuid not null references public.roles(id),
  avatar_url text,
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_users_updated before update on public.users
  for each row execute function public.set_updated_at();

create table if not exists public.generasi (
  id uuid primary key default gen_random_uuid(),
  nama text unique not null,          -- contoh: FOMPA I
  tahun text,
  ketua text,
  deskripsi text,
  foto text,
  created_at timestamptz default now()
);

create table if not exists public.pengurus (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  nama text not null,
  jabatan text not null,
  bidang text,
  generasi text,
  sekolah text,
  foto_url text,
  sosmed jsonb,                      -- {"instagram": "...", "tiktok": "..."}
  bio text,
  status text not null default 'aktif' check (status in ('aktif','nonaktif')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_pengurus_updated before update on public.pengurus
  for each row execute function public.set_updated_at();

create table if not exists public.kategori_berita (
  id uuid primary key default gen_random_uuid(),
  nama text unique not null,
  slug text unique not null,
  created_at timestamptz default now()
);

create table if not exists public.berita (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  slug text unique not null,
  konten text not null,
  ringkasan text,
  thumbnail text,
  kategori_id uuid references public.kategori_berita(id) on delete set null,
  tags text[] default '{}',
  penulis_id uuid references public.users(id) on delete set null,
  status text not null default 'draft' check (status in ('draft','published','scheduled')),
  published_at timestamptz,
  views integer not null default 0,
  likes integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_berita_updated before update on public.berita
  for each row execute function public.set_updated_at();

create table if not exists public.berita_likes (
  id uuid primary key default gen_random_uuid(),
  berita_id uuid not null references public.berita(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (berita_id, user_id)
);

create table if not exists public.program_kerja (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kategori text not null,
  deskripsi text not null,
  tanggal timestamptz,
  cover text,
  dokumentasi text[] default '{}',
  status text not null default 'akan_datang' check (status in ('berjalan','selesai','akan_datang','ditunda')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_program_updated before update on public.program_kerja
  for each row execute function public.set_updated_at();

create table if not exists public.galeri (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  kategori text,
  url text not null,
  created_at timestamptz default now()
);

create table if not exists public.agenda (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  deskripsi text,
  tanggal timestamptz not null,
  lokasi text,
  kategori text,
  status text not null default 'akan_datang' check (status in ('akan_datang','berlangsung','selesai','batal')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_agenda_updated before update on public.agenda
  for each row execute function public.set_updated_at();

create table if not exists public.presensi (
  id uuid primary key default gen_random_uuid(),
  agenda_id uuid not null references public.agenda(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  status text not null default 'hadir' check (status in ('hadir','izin','sakit','alpha')),
  catatan text,
  created_at timestamptz default now(),
  unique (agenda_id, user_id)
);

create table if not exists public.dokumen (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kategori text not null,
  file_url text not null,
  tipe text,
  ukuran bigint,
  is_public boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_dokumen_updated before update on public.dokumen
  for each row execute function public.set_updated_at();

create table if not exists public.notifikasi (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade, -- null = broadcast ke semua
  judul text not null,
  pesan text,
  tipe text not null default 'info', -- agenda|berita|dokumen|pengumuman|info
  link text,
  is_read boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  aksi text not null,
  entitas text not null,
  entitas_id text,
  meta jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_activity_created on public.activity_logs(created_at desc);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null,
  updated_at timestamptz default now()
);
create trigger trg_settings_updated before update on public.settings
  for each row execute function public.set_updated_at();

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  visitor_key text not null,         -- hash anonim (ip + user agent)
  page text not null default '/',
  tanggal date not null default current_date,
  created_at timestamptz default now(),
  unique (visitor_key, tanggal)
);
create index if not exists idx_page_views_tanggal on public.page_views(tanggal);

create table if not exists public.pendaftaran (
  id uuid primary key default gen_random_uuid(),
  nama_lengkap text not null,
  email text not null,
  whatsapp text not null,
  sekolah text not null,
  kelas text,
  bidang text[] default '{}',
  motivasi text,
  berkas_url text,
  status text not null default 'pending' check (status in ('pending','diterima','ditolak')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_pendaftaran_updated before update on public.pendaftaran
  for each row execute function public.set_updated_at();

create table if not exists public.sertifikat (
  id uuid primary key default gen_random_uuid(),
  agenda_id uuid references public.agenda(id) on delete set null,
  peserta_name text not null,
  nomor text unique not null,
  template text not null default 'default',
  created_at timestamptz default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.roles            enable row level security;
alter table public.users            enable row level security;
alter table public.generasi         enable row level security;
alter table public.pengurus         enable row level security;
alter table public.kategori_berita  enable row level security;
alter table public.berita           enable row level security;
alter table public.berita_likes     enable row level security;
alter table public.program_kerja    enable row level security;
alter table public.galeri           enable row level security;
alter table public.agenda           enable row level security;
alter table public.presensi         enable row level security;
alter table public.dokumen          enable row level security;
alter table public.notifikasi       enable row level security;
alter table public.activity_logs     enable row level security;
alter table public.settings         enable row level security;
alter table public.page_views       enable row level security;
alter table public.pendaftaran      enable row level security;
alter table public.sertifikat       enable row level security;

-- Semua operasi tulis dilakukan melalui API routes (service role),
-- jadi policy di sini hanya mengatur SELECT (dan aksi pengguna langsung).

-- roles: tidak perlu dibaca publik (dibaca via API)
drop policy if exists "roles_select" on public.roles;
create policy "roles_select" on public.roles for select using (auth.role() = 'authenticated');

-- users: hanya profil sendiri
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users for select using (auth.uid() = id);

-- data publik (dapat dibaca anonim)
drop policy if exists "pengurus_select" on public.pengurus;
create policy "pengurus_select" on public.pengurus for select using (true);

drop policy if exists "generasi_select" on public.generasi;
create policy "generasi_select" on public.generasi for select using (true);

drop policy if exists "kategori_select" on public.kategori_berita;
create policy "kategori_select" on public.kategori_berita for select using (true);

-- berita: publik hanya yang published/scheduled-terpublikasi; admin semua
drop policy if exists "berita_select" on public.berita;
create policy "berita_select" on public.berita for select
  using (
    status = 'published'
    or (status = 'scheduled' and published_at <= now())
    or public.has_role('admin')
  );

drop policy if exists "likes_select" on public.berita_likes;
create policy "likes_select" on public.berita_likes for select using (true);

drop policy if exists "program_select" on public.program_kerja;
create policy "program_select" on public.program_kerja for select using (true);

drop policy if exists "galeri_select" on public.galeri;
create policy "galeri_select" on public.galeri for select using (true);

drop policy if exists "agenda_select" on public.agenda;
create policy "agenda_select" on public.agenda for select using (true);

drop policy if exists "presensi_select" on public.presensi;
create policy "presensi_select" on public.presensi for select using (auth.uid() is not null);

-- dokumen: publik hanya is_public; anggota login bisa lihat internal
drop policy if exists "dokumen_select" on public.dokumen;
create policy "dokumen_select" on public.dokumen for select
  using (is_public = true or auth.uid() is not null);

-- notifikasi: milik sendiri atau broadcast
drop policy if exists "notifikasi_select" on public.notifikasi;
create policy "notifikasi_select" on public.notifikasi for select
  using (user_id is null or user_id = auth.uid());

drop policy if exists "notifikasi_update_read" on public.notifikasi;
create policy "notifikasi_update_read" on public.notifikasi for update
  using (user_id is null or user_id = auth.uid())
  with check (user_id is null or user_id = auth.uid());

-- activity logs: hanya admin
drop policy if exists "activity_select" on public.activity_logs;
create policy "activity_select" on public.activity_logs for select
  using (public.has_role('admin'));

drop policy if exists "settings_select" on public.settings;
create policy "settings_select" on public.settings for select using (true);

-- page_views: siapa pun boleh insert (visitor ping), tidak bisa select langsung
drop policy if exists "views_insert" on public.page_views;
create policy "views_insert" on public.page_views for insert with check (true);

-- pendaftaran: publik boleh daftar, tidak bisa lihat
drop policy if exists "pendaftaran_insert" on public.pendaftaran;
create policy "pendaftaran_insert" on public.pendaftaran for insert with check (true);

drop policy if exists "sertifikat_select" on public.sertifikat;
create policy "sertifikat_select" on public.sertifikat for select using (true);

-- ============================================================================
-- STORAGE
-- ============================================================================
-- Bucket penyimpanan aset (jalankan sekali di SQL editor):
--   insert into storage.buckets (id, name, public)
--   values ('fompa-assets', 'fompa-assets', true)
--   on conflict (id) do nothing;
-- Public read otomatis karena bucket public=true. Upload via API (service role)
-- dengan validasi tipe & ukuran file di kode.

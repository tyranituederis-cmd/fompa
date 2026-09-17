-- ============================================================================
-- FOMPA — SEED DATA DEMO
-- Jalankan SETELAH schema.sql (Supabase SQL Editor atau `psql -f supabase/seed.sql`)
-- Akun demo:
--   admin@fompa.id     / Admin123!       (Super Admin)
--   sekretaris@fompa.id / Sekretaris123! (Admin)
--   koordinator@fompa.id / Koordinator123! (Koordinator Bidang)
--   pengurus@fompa.id  / Pengurus123!    (Pengurus)
--   alumni@fompa.id    / Alumni123!      (Alumni)
-- Password di-hash otomatis dengan bcrypt (pgcrypto crypt + gen_salt).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- ROLES
-- ----------------------------------------------------------------------------
insert into public.roles (name, label) values
  ('super_admin', 'Super Admin'),
  ('admin', 'Admin'),
  ('koordinator_bidang', 'Koordinator Bidang'),
  ('pengurus', 'Pengurus'),
  ('alumni', 'Alumni')
on conflict (name) do nothing;

-- ----------------------------------------------------------------------------
-- GENERASI FOMPA I - XIV
-- ----------------------------------------------------------------------------
insert into public.generasi (nama, tahun, ketua, deskripsi) values
  ('FOMPA I', '2012', 'Rizky Pratama', 'Generasi perintis berdirinya Forum OSIS MPK Purwakarta.'),
  ('FOMPA II', '2013', 'Siti Nurhaliza', 'Penguatan struktur organisasi dan hubungan antar sekolah.'),
  ('FOMPA III', '2014', 'Ahmad Fauzi', 'Peluncuran program kaderisasi pertama.'),
  ('FOMPA IV', '2015', 'Dewi Anggraini', 'Ekspansi keanggotaan ke seluruh sekolah se-Kabupaten Purwakarta.'),
  ('FOMPA V', '2016', 'Budi Santoso', 'Musyawarah Kerja (Muker) pertama tingkat kabupaten.'),
  ('FOMPA VI', '2017', 'Intan Permatasari', 'Kolaborasi dengan Dinas Pendidikan dan KORMI.'),
  ('FOMPA VII', '2018', 'Fajar Nugraha', 'Digitalisasi awal media informasi forum.'),
  ('FOMPA VIII', '2019', 'Nabila Zahra', 'Rekor kehadiran peserta pada Latihan Kepemimpinan Organisasi (LKO).'),
  ('FOMPA IX', '2020', 'Rangga Saputra', 'Adaptasi kegiatan daring di masa pandemi.'),
  ('FOMPA X', '2021', 'Putri Amelia', 'Gebyar Milad ke-10 dan peluncuran arsip digital.'),
  ('FOMPA XI', '2022', 'Yusuf Maulana', 'Revitalisasi program kerja dan open recruitment serentak.'),
  ('FOMPA XII', '2023', 'Salsabila Putri', 'Seminar pendidikan dan workshop kolaboratif antar sekolah.'),
  ('FOMPA XIII', '2024', 'Muhammad Rizki', 'Penguatan branding dan kehadiran di media sosial.'),
  ('FOMPA XIV', '2025', 'Anisa Rahmawati', 'Generasi saat ini — transformasi digital dan website resmi.')
on conflict (nama) do nothing;

-- ----------------------------------------------------------------------------
-- USERS (akun demo)
-- ----------------------------------------------------------------------------
insert into public.users (email, name, password_hash, role_id, avatar_url, status) values
  ('admin@fompa.id', 'Admin FOMPA', crypt('Admin123!', gen_salt('bf', 10)),
   (select id from public.roles where name = 'super_admin'), null, 'active'),
  ('sekretaris@fompa.id', 'Sekretaris FOMPA', crypt('Sekretaris123!', gen_salt('bf', 10)),
   (select id from public.roles where name = 'admin'), null, 'active'),
  ('koordinator@fompa.id', 'Koordinator Bidang', crypt('Koordinator123!', gen_salt('bf', 10)),
   (select id from public.roles where name = 'koordinator_bidang'), null, 'active'),
  ('pengurus@fompa.id', 'Pengurus FOMPA', crypt('Pengurus123!', gen_salt('bf', 10)),
   (select id from public.roles where name = 'pengurus'), null, 'active'),
  ('alumni@fompa.id', 'Alumni FOMPA', crypt('Alumni123!', gen_salt('bf', 10)),
   (select id from public.roles where name = 'alumni'), null, 'active')
on conflict (email) do nothing;

-- ----------------------------------------------------------------------------
-- PENGURUS (terkait akun demo)
-- ----------------------------------------------------------------------------
insert into public.pengurus (user_id, nama, jabatan, bidang, generasi, sekolah, foto_url, sosmed, bio, status) values
  ((select id from public.users where email = 'admin@fompa.id'), 'Raka Aditya', 'Ketua Umum', 'Pengurus Inti', 'FOMPA XIV', 'SMAN 1 Purwakarta', null,
   '{"instagram": "raka.aditya"}'::jsonb, 'Berkomitmen membangun sinergi pelajar Purwakarta.', 'aktif'),
  ((select id from public.users where email = 'sekretaris@fompa.id'), 'Sekretaris FOMPA', 'Sekretaris Umum', 'Pengurus Inti', 'FOMPA XIV', 'SMAN 2 Purwakarta', null,
   '{}'::jsonb, 'Mengelola administrasi dan dokumentasi organisasi.', 'aktif'),
  ((select id from public.users where email = 'koordinator@fompa.id'), 'Koordinator Bidang', 'Koordinator Kaderisasi', 'Kaderisasi', 'FOMPA XIII', 'SMAN 3 Purwakarta', null,
   '{}'::jsonb, 'Menyiapkan kader-kader pemimpin masa depan.', 'aktif'),
  ((select id from public.users where email = 'pengurus@fompa.id'), 'Pengurus FOMPA', 'Staf Media & Informasi', 'Media Informasi', 'FOMPA XIV', 'SMAN 4 Purwakarta', null,
   '{"instagram": "pengurus.fompa", "tiktok": "pengurus.fompa"}'::jsonb, 'Mengelola konten media sosial dan website.', 'aktif'),
  (null, 'Alumni Generasi XII', 'Alumni', 'Alumni', 'FOMPA XII', 'SMAN 5 Purwakarta', null,
   '{}'::jsonb, 'Alumni yang tetap mendukung kegiatan forum.', 'nonaktif')
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- KATEGORI BERITA
-- ----------------------------------------------------------------------------
insert into public.kategori_berita (nama, slug) values
  ('Kegiatan', 'kegiatan'),
  ('Prestasi', 'prestasi'),
  ('Pengumuman', 'pengumuman'),
  ('Kepengurusan', 'kepengurusan')
on conflict (nama) do nothing;

-- ----------------------------------------------------------------------------
-- BERITA DEMO
-- ----------------------------------------------------------------------------
insert into public.berita (judul, slug, konten, ringkasan, thumbnail, kategori_id, tags, penulis_id, status, published_at) values
  (
    'Resmi Diluncurkan: Website Resmi FOMPA',
    'resmi-diluncurkan-website-resmi-fompa',
    '<h2>Selamat Datang di Era Digital FOMPA</h2><p>Forum OSIS MPK Purwakarta (FOMPA) resmi meluncurkan website resmi sebagai pusat informasi, dokumentasi, dan layanan bagi seluruh pengurus dan pelajar Kabupaten Purwakarta.</p><p>Website ini hadir dengan sistem manajemen konten lengkap, mulai dari berita, agenda kegiatan, galeri, hingga dokumen organisasi.</p><blockquote><p>"Bersama dalam Organisasi" — mari kita jadikan FOMPA rumah bersama bagi seluruh pelajar Purwakarta.</p></blockquote>',
    'FOMPA resmi meluncurkan website sebagai pusat informasi dan layanan digital organisasi.',
    null,
    (select id from public.kategori_berita where slug = 'pengumuman'),
    array['peluncuran','digital','website'],
    (select id from public.users where email = 'admin@fompa.id'),
    'published', now() - interval '5 days'
  ),
  (
    'Sukses! LKO FOMPA XIV Diikuti 200 Pelajar',
    'sukses-lko-fompa-xiv-diikuti-200-pelajar',
    '<h2>Latihan Kepemimpinan Organisasi</h2><p>LKO FOMPA XIV berlangsung sukses dengan kehadiran 200 peserta dari berbagai sekolah di Kabupaten Purwakarta.</p><p>Kegiatan ini diisi dengan materi kepemimpinan, manajemen organisasi, dan praktik langsung.</p>',
    '200 pelajar Purwakarta mengikuti Latihan Kepemimpinan Organisasi FOMPA XIV.',
    null,
    (select id from public.kategori_berita where slug = 'kegiatan'),
    array['lko','kepemimpinan','kegiatan'],
    (select id from public.users where email = 'admin@fompa.id'),
    'published', now() - interval '2 days'
  ),
  (
    'Pendaftaran Open Recruitment FOMPA XV Dibuka',
    'pendaftaran-open-recruitment-fompa-xv-dibuka',
    '<h2>Gabung Bersama Kami!</h2><p>Open Recruitment pengurus baru FOMPA XV resmi dibuka. Silakan daftar melalui halaman <strong>Gabung FOMPA</strong> di website ini.</p><p>Jadilah bagian dari wadah kolaborasi dan kepemimpinan pelajar Kabupaten Purwakarta.</p>',
    'Open Recruitment pengurus baru FOMPA XV telah dibuka. Daftar sekarang!',
    null,
    (select id from public.kategori_berita where slug = 'pengumuman'),
    array['oprec','rekrutmen'],
    (select id from public.users where email = 'admin@fompa.id'),
    'published', now() - interval '1 day'
  )
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- PROGRAM KERJA
-- ----------------------------------------------------------------------------
insert into public.program_kerja (nama, kategori, deskripsi, tanggal, cover, dokumentasi, status) values
  ('Kaderisasi Anggota Baru', 'Kaderisasi', 'Program pembinaan anggota baru melalui serangkaian pelatihan dasar keorganisasian.', now() + interval '14 days', null, '{}', 'akan_datang'),
  ('Musyawarah Kerja Tahunan', 'Musyawarah Kerja', 'Musyawarah kerja untuk menyusun program kerja dan evaluasi kinerja pengurus.', now() + interval '30 days', null, '{}', 'akan_datang'),
  ('Latihan Kepemimpinan Organisasi', 'Latihan Kepemimpinan Organisasi', 'Pelatihan kepemimpinan bagi pengurus inti dan calon pemimpin masa depan.', now() - interval '7 days', null, '{}', 'selesai'),
  ('Seminar Pendidikan Kabupaten', 'Seminar Pendidikan', 'Seminar edukasi bersama praktisi pendidikan untuk pelajar se-Kabupaten Purwakarta.', now() + interval '45 days', null, '{}', 'berjalan'),
  ('Workshop Desain & Konten Kreatif', 'Workshop', 'Workshop keterampilan desain grafis dan pembuatan konten digital bagi pengurus media.', now() + interval '21 days', null, '{}', 'akan_datang'),
  ('Open Recruitment Pengurus Baru', 'Open Recruitment', 'Penerimaan anggota baru secara online dengan seleksi berkas.', now() - interval '1 day', null, '{}', 'berjalan')
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- AGENDA
-- ----------------------------------------------------------------------------
insert into public.agenda (judul, deskripsi, tanggal, lokasi, kategori, status) values
  ('Rapat Koordinasi Pengurus', 'Rapat rutin koordinasi antar bidang.', now() + interval '3 days', 'Sekretariat FOMPA', 'Rapat', 'akan_datang'),
  ('LKO Tingkat Kabupaten', 'Latihan Kepemimpinan Organisasi gelombang kedua.', now() + interval '10 days', 'Aula SMAN 1 Purwakarta', 'Pelatihan', 'akan_datang'),
  ('Workshop Desain Konten', 'Praktik langsung membuat konten organisasi.', now() + interval '21 days', 'SMAN 2 Purwakarta', 'Workshop', 'akan_datang'),
  ('Muker Tahunan', 'Musyawarah kerja tahunan FOMPA XV.', now() + interval '30 days', 'Gedung Kesenian Purwakarta', 'Musyawarah', 'akan_datang')
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- GALERI (contoh placeholder — ganti dengan foto kegiatan asli)
-- ----------------------------------------------------------------------------
insert into public.galeri (judul, kategori, url) values
  ('LKO FOMPA XIII', 'LKO', 'https://picsum.photos/seed/fompa1/800/600'),
  ('Seminar Pendidikan', 'Seminar', 'https://picsum.photos/seed/fompa2/800/1000'),
  ('Muker Tahunan', 'Muker', 'https://picsum.photos/seed/fompa3/800/600'),
  ('Workshop Kreatif', 'Workshop', 'https://picsum.photos/seed/fompa4/800/700'),
  ('Kaderisasi', 'Kaderisasi', 'https://picsum.photos/seed/fompa5/800/500'),
  ('Bakti Sosial', 'Sosial', 'https://picsum.photos/seed/fompa6/800/800')
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- DOKUMEN
-- ----------------------------------------------------------------------------
insert into public.dokumen (nama, kategori, file_url, tipe, ukuran, is_public) values
  ('AD/ART FOMPA', 'AD/ART', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'application/pdf', 42000, true),
  ('TOR LKO XIV', 'TOR', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'application/pdf', 18000, true),
  ('Contoh Surat Resmi', 'Surat', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'application/pdf', 25000, false)
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- SETTINGS (tema & identitas)
-- ----------------------------------------------------------------------------
insert into public.settings (key, value) values
  ('site', '{
    "org_name": "Forum OSIS MPK Purwakarta",
    "singkatan": "FOMPA",
    "motto": "Bersama dalam Organisasi",
    "primary_color": "#D62828",
    "hero_title": "Forum OSIS MPK Purwakarta",
    "hero_subtitle": "Wadah Kolaborasi, Kepemimpinan, dan Sinergi Pelajar Kabupaten Purwakarta.",
    "alamat": "Jl. Veteran No. 45, Purwakarta, Jawa Barat 41111",
    "email": "sekretariat@fompa.id",
    "whatsapp": "+62 812-3456-7890",
    "instagram": "fompa.purwakarta",
    "tiktok": "fompa.purwakarta",
    "google_calendar_embed": ""
  }'::jsonb)
on conflict (key) do nothing;

-- ----------------------------------------------------------------------------
-- NOTIFIKASI & AKTIVITAS (contoh)
-- ----------------------------------------------------------------------------
insert into public.notifikasi (user_id, judul, pesan, tipe, link) values
  (null, 'Website resmi FOMPA diluncurkan', 'Selamat datang di portal digital FOMPA!', 'pengumuman', '/berita/resmi-diluncurkan-website-resmi-fompa'),
  (null, 'Open Recruitment dibuka', 'Pendaftaran pengurus baru FOMPA XV telah dibuka.', 'info', '/daftar')
on conflict do nothing;

insert into public.activity_logs (user_id, aksi, entitas, entitas_id, meta) values
  ((select id from public.users where email = 'admin@fompa.id'), 'membuat', 'berita', (select id::text from public.berita limit 1), '{"judul": "Resmi Diluncurkan: Website Resmi FOMPA"}'::jsonb),
  ((select id from public.users where email = 'admin@fompa.id'), 'memperbarui', 'settings', 'site', '{"key": "site"}'::jsonb)
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- PENDAFTARAN (contoh)
-- ----------------------------------------------------------------------------
insert into public.pendaftaran (nama_lengkap, email, whatsapp, sekolah, kelas, bidang, motivasi, status) values
  ('Andi Saputra', 'andi@example.com', '081234567891', 'SMAN 1 Purwakarta', 'XI IPA 2', array['Media Informasi', 'Kaderisasi'], 'Saya ingin berkontribusi memajukan organisasi pelajar.', 'pending'),
  ('Bella Maharani', 'bella@example.com', '081298765432', 'SMAN 2 Purwakarta', 'X MIPA 1', array['Kaderisasi'], 'Belajar organisasi dan kepemimpinan sejak dini.', 'diterima')
on conflict do nothing;

-- ============================================================================
-- FOMPA — Setup STORAGE BUCKET
-- Jalankan sekali setelah schema.sql
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('fompa-assets', 'fompa-assets', true)
on conflict (id) do nothing;

-- Bucket public => siapa pun bisa membaca file (mis. gambar berita/galeri).
-- UPLOAD hanya melalui API (/api/upload) dengan service role + validasi,
-- sehingga bucket tidak perlu policy insert publik.

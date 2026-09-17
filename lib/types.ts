export type RoleName =
  | "super_admin"
  | "admin"
  | "koordinator_bidang"
  | "pengurus"
  | "alumni";

export interface Role {
  id: string;
  name: RoleName;
  label: string;
}

export interface AppUser {
  id: string;
  email: string;
  name: string;
  password_hash?: string;
  role_id: string;
  role?: string;
  avatar_url: string | null;
  status: "active" | "inactive";
  created_at: string;
}

export interface Pengurus {
  id: string;
  user_id: string | null;
  nama: string;
  jabatan: string;
  bidang: string | null;
  generasi: string | null;
  sekolah: string | null;
  foto_url: string | null;
  sosmed: Record<string, string> | null;
  bio: string | null;
  status: "aktif" | "nonaktif";
  created_at: string;
}

export interface KategoriBerita {
  id: string;
  nama: string;
  slug: string;
}

export interface Berita {
  id: string;
  judul: string;
  slug: string;
  konten: string;
  ringkasan: string | null;
  thumbnail: string | null;
  kategori_id: string | null;
  kategori?: string | null;
  tags: string[] | null;
  penulis_id: string | null;
  penulis?: string | null;
  status: "draft" | "published" | "scheduled";
  published_at: string | null;
  views: number;
  likes: number;
  created_at: string;
}

export interface ProgramKerja {
  id: string;
  nama: string;
  kategori: string;
  deskripsi: string;
  tanggal: string | null;
  cover: string | null;
  dokumentasi: string[] | null;
  status: "berjalan" | "selesai" | "akan_datang" | "ditunda";
  created_at: string;
}

export interface GaleriItem {
  id: string;
  judul: string;
  kategori: string | null;
  url: string;
  created_at: string;
}

export interface Agenda {
  id: string;
  judul: string;
  deskripsi: string | null;
  tanggal: string;
  lokasi: string | null;
  kategori: string | null;
  status: "akan_datang" | "berlangsung" | "selesai" | "batal";
  created_at: string;
}

export interface Dokumen {
  id: string;
  nama: string;
  kategori: string;
  file_url: string;
  tipe: string | null;
  ukuran: number | null;
  is_public: boolean;
  created_at: string;
}

export interface Notifikasi {
  id: string;
  judul: string;
  pesan: string | null;
  tipe: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  user_name?: string | null;
  aksi: string;
  entitas: string;
  entitas_id: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
}

export interface Pendaftaran {
  id: string;
  nama_lengkap: string;
  email: string;
  whatsapp: string;
  sekolah: string;
  kelas: string | null;
  bidang: string[] | null;
  motivasi: string | null;
  berkas_url: string | null;
  status: "pending" | "diterima" | "ditolak";
  created_at: string;
}

export interface Generasi {
  id: string;
  nama: string;
  tahun: string;
  ketua: string | null;
  deskripsi: string | null;
  foto: string | null;
}

export interface Settings {
  id: string;
  key: string;
  value: Record<string, unknown>;
}

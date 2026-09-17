import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password minimal 8 karakter")
  .regex(/[A-Za-z]/, "Password harus mengandung huruf")
  .regex(/[0-9]/, "Password harus mengandung angka");

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const beritaSchema = z.object({
  judul: z.string().min(5, "Judul minimal 5 karakter").max(200),
  konten: z.string().min(10, "Konten terlalu pendek"),
  ringkasan: z.string().max(300).optional().nullable(),
  thumbnail: z.string().url().optional().nullable(),
  kategori_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string()).max(10).optional().nullable(),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  published_at: z.string().datetime().optional().nullable(),
});

export const pengurusSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  jabatan: z.string().min(2, "Jabatan wajib diisi"),
  bidang: z.string().optional().nullable(),
  generasi: z.string().optional().nullable(),
  sekolah: z.string().optional().nullable(),
  foto_url: z.string().url().optional().nullable(),
  sosmed: z.record(z.string()).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  status: z.enum(["aktif", "nonaktif"]).default("aktif"),
});

export const programSchema = z.object({
  nama: z.string().min(3),
  kategori: z.string().min(2),
  deskripsi: z.string().min(10),
  tanggal: z.string().datetime().optional().nullable(),
  cover: z.string().url().optional().nullable(),
  dokumentasi: z.array(z.string()).max(20).optional().nullable(),
  status: z.enum(["berjalan", "selesai", "akan_datang", "ditunda"]).default("akan_datang"),
});

export const agendaSchema = z.object({
  judul: z.string().min(3),
  deskripsi: z.string().optional().nullable(),
  tanggal: z.string().datetime(),
  lokasi: z.string().optional().nullable(),
  kategori: z.string().optional().nullable(),
  status: z.enum(["akan_datang", "berlangsung", "selesai", "batal"]).default("akan_datang"),
});

export const dokumenSchema = z.object({
  nama: z.string().min(3),
  kategori: z.string().min(2),
  file_url: z.string().url(),
  tipe: z.string().optional().nullable(),
  ukuran: z.number().positive().optional().nullable(),
  is_public: z.boolean().default(true),
});

export const galeriSchema = z.object({
  judul: z.string().min(2),
  kategori: z.string().optional().nullable(),
  url: z.string().url(),
});

export const pendaftaranSchema = z.object({
  nama_lengkap: z.string().min(3),
  email: z.string().email(),
  whatsapp: z.string().min(9).max(15),
  sekolah: z.string().min(3),
  kelas: z.string().optional().nullable(),
  bidang: z.array(z.string()).min(1).max(5),
  motivasi: z.string().min(20, "Motivasi minimal 20 karakter").max(1000),
  berkas_url: z.string().url().optional().nullable(),
});

export const userCreateSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: passwordSchema,
  role: z.enum(["super_admin", "admin", "koordinator_bidang", "pengurus", "alumni"]),
});

export const settingsSchema = z.object({
  org_name: z.string().min(3),
  motto: z.string().min(3),
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  hero_title: z.string().min(3),
  hero_subtitle: z.string().min(3),
  alamat: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  google_calendar_embed: z.string().optional(),
});

export const absensiSchema = z.object({
  agenda_id: z.string().uuid(),
});

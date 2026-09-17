import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase dengan SERVICE ROLE KEY — dibuat lazy (baru saat dipakai)
 * agar import modul tidak gagal ketika env belum diatur (mis. saat build).
 * HANYA untuk server. Melewati RLS → semua tulis divalidasi role di kode.
 */
let cached: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient {
  if (!cached) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("Konfigurasi Supabase belum lengkap. Salin .env.example ke .env.local dan isi NEXT_PUBLIC_SUPABASE_URL serta SUPABASE_SERVICE_ROLE_KEY.");
    }
    cached = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return cached;
}

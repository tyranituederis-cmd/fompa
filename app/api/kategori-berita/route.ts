import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { serverError } from "@/lib/api-helpers";

/** GET — daftar kategori berita */
export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase.from("kategori_berita").select("*").order("nama");
  if (error) return serverError(error);
  return NextResponse.json({ data });
}

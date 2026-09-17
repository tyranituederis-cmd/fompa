import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { serverError } from "@/lib/api-helpers";

/** POST — tambah view counter berita */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getAdminClient();
  const { data } = await supabase.from("berita").select("views").eq("id", id).single();
  const { error } = await supabase.from("berita").update({ views: (data?.views ?? 0) + 1 }).eq("id", id);
  if (error) return serverError(error);
  return NextResponse.json({ ok: true });
}

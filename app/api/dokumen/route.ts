import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { badRequest, broadcastNotification, csrfCheck, forbidden, hasRole, logActivity, serverError, unauthorized } from "@/lib/api-helpers";
import { dokumenSchema } from "@/lib/validators";

export async function GET(req: Request) {
  const session = await getSession();
  const { searchParams } = new URL(req.url);
  const kategori = searchParams.get("kategori");
  const supabase = getAdminClient();

  let query = supabase.from("dokumen").select("*");
  if (!hasRole(session, "pengurus")) query = query.eq("is_public", true);
  if (kategori) query = query.eq("kategori", kategori);

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return serverError(error);
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!hasRole(session, "pengurus")) return forbidden();
  if (!csrfCheck(req)) return NextResponse.json({ error: "CSRF tidak valid" }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest();
  }
  const parsed = dokumenSchema.safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.errors[0]?.message);

  const supabase = getAdminClient();
  const { data, error } = await supabase.from("dokumen").insert(parsed.data).select().single();
  if (error) return serverError(error);
  await logActivity({ userId: session.user.uid, aksi: "mengunggah", entitas: "dokumen", entitasId: data.id, meta: { nama: data.nama } });
  await broadcastNotification({ judul: "Dokumen baru: " + data.nama, pesan: "Kategori: " + data.kategori, tipe: "dokumen", link: "/dokumen" });
  return NextResponse.json({ data }, { status: 201 });
}

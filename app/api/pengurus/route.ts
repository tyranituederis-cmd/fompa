import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { badRequest, csrfCheck, forbidden, hasRole, logActivity, serverError, unauthorized } from "@/lib/api-helpers";
import { pengurusSchema } from "@/lib/validators";

/** GET — daftar pengurus (publik, dengan filter) */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const supabase = getAdminClient();

  let query = supabase.from("pengurus").select("*");
  const status = searchParams.get("status");
  const generasi = searchParams.get("generasi");
  const bidang = searchParams.get("bidang");
  const q = searchParams.get("q");

  if (status) query = query.eq("status", status);
  else query = query.eq("status", "aktif");
  if (generasi) query = query.eq("generasi", generasi);
  if (bidang) query = query.eq("bidang", bidang);
  if (q) query = query.ilike("nama", `%${q}%`);

  const { data, error } = await query.order("created_at", { ascending: true }).limit(100);
  if (error) return serverError(error);
  return NextResponse.json({ data });
}

/** POST — tambah pengurus (admin+) */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!hasRole(session, "admin")) return forbidden();
  if (!csrfCheck(req)) return NextResponse.json({ error: "CSRF tidak valid" }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest();
  }
  const parsed = pengurusSchema.safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.errors[0]?.message);

  const supabase = getAdminClient();
  const { data, error } = await supabase.from("pengurus").insert(parsed.data).select().single();
  if (error) return serverError(error);

  await logActivity({ userId: session.user.uid, aksi: "menambahkan", entitas: "pengurus", entitasId: data.id, meta: { nama: data.nama } });
  return NextResponse.json({ data }, { status: 201 });
}

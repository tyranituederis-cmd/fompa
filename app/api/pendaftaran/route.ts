import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { badRequest, csrfCheck, forbidden, hasRole, logActivity, serverError, unauthorized } from "@/lib/api-helpers";
import { pendaftaranSchema } from "@/lib/validators";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/** GET — daftar pendaftar (admin+) */
export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!hasRole(session, "admin")) return forbidden();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const supabase = getAdminClient();

  let query = supabase.from("pendaftaran").select("*");
  if (status) query = query.eq("status", status);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return serverError(error);
  return NextResponse.json({ data });
}

/** POST — pendaftaran open recruitment (publik, rate limited) */
export async function POST(req: Request) {
  const rl = rateLimit(`daftar:${clientIp(req)}`, 5, 3600_000);
  if (!rl.ok) return NextResponse.json({ error: "Terlalu banyak pendaftaran dari perangkat ini" }, { status: 429 });
  if (!csrfCheck(req)) return NextResponse.json({ error: "CSRF tidak valid" }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest();
  }
  const parsed = pendaftaranSchema.safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.errors[0]?.message);

  const supabase = getAdminClient();
  const { data, error } = await supabase.from("pendaftaran").insert(parsed.data).select("id, nama_lengkap").single();
  if (error) return serverError(error);
  return NextResponse.json({ data }, { status: 201 });
}

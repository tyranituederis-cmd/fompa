import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { badRequest, csrfCheck, forbidden, hasRole, logActivity, serverError, unauthorized } from "@/lib/api-helpers";
import { galeriSchema } from "@/lib/validators";

export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase.from("galeri").select("*").order("created_at", { ascending: false });
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
  const parsed = galeriSchema.safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.errors[0]?.message);

  const supabase = getAdminClient();
  const { data, error } = await supabase.from("galeri").insert(parsed.data).select().single();
  if (error) return serverError(error);
  await logActivity({ userId: session.user.uid, aksi: "mengunggah", entitas: "galeri", entitasId: data.id, meta: { judul: data.judul } });
  return NextResponse.json({ data }, { status: 201 });
}

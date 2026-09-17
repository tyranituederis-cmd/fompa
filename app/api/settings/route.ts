import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { badRequest, csrfCheck, forbidden, hasRole, logActivity, serverError, unauthorized } from "@/lib/api-helpers";
import { settingsSchema } from "@/lib/validators";

/** GET — pengaturan publik (identitas & tema) */
export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase.from("settings").select("key, value").eq("key", "site").maybeSingle();
  if (error) return serverError(error);
  return NextResponse.json({ data: data?.value ?? {} });
}

/** PUT — ubah pengaturan (admin+) */
export async function PUT(req: Request) {
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
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.errors[0]?.message);

  const supabase = getAdminClient();
  const { error } = await supabase.from("settings").upsert({ key: "site", value: parsed.data });
  if (error) return serverError(error);
  await logActivity({ userId: session.user.uid, aksi: "memperbarui", entitas: "settings", entitasId: "site" });
  return NextResponse.json({ ok: true });
}

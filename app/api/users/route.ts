import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { badRequest, csrfCheck, forbidden, hasRole, logActivity, serverError, unauthorized } from "@/lib/api-helpers";
import { userCreateSchema } from "@/lib/validators";

/** GET — daftar user (admin+) */
export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!hasRole(session, "admin")) return forbidden();

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, email, name, avatar_url, status, created_at, roles(name, label)")
    .order("created_at", { ascending: false });
  if (error) return serverError(error);

  const items = (data ?? []).map((u) => ({
    ...u,
    role: (u.roles as { name?: string } | null)?.name ?? null,
    role_label: (u.roles as { label?: string } | null)?.label ?? null,
    roles: undefined,
  }));
  return NextResponse.json({ data: items });
}

/** POST — tambah user baru (admin+), sekaligus opsional data pengurus */
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
  const parsed = userCreateSchema.safeParse(body);
  if (!parsed.success) return badRequest(parsed.error.errors[0]?.message);

  const supabase = getAdminClient();
  const { data: role } = await supabase.from("roles").select("id").eq("name", parsed.data.role).maybeSingle();
  if (!role) return badRequest("Role tidak valid");

  const { data: existing } = await supabase.from("users").select("id").eq("email", parsed.data.email.toLowerCase()).maybeSingle();
  if (existing) return badRequest("Email sudah terdaftar");

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const { data: user, error } = await supabase
    .from("users")
    .insert({
      email: parsed.data.email.toLowerCase(),
      name: parsed.data.name,
      password_hash: passwordHash,
      role_id: role.id,
    })
    .select("id, email, name")
    .single();
  if (error) return serverError(error);

  await logActivity({ userId: session.user.uid, aksi: "membuat", entitas: "user", entitasId: user.id, meta: { email: user.email } });
  return NextResponse.json({ data: user }, { status: 201 });
}

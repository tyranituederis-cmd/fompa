import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { csrfCheck, serverError, unauthorized } from "@/lib/api-helpers";

/** GET — notifikasi untuk user yang login (broadcast + miliknya) */
export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  const { searchParams } = new URL(req.url);
  const onlyUnread = searchParams.get("unread") === "true";

  const supabase = getAdminClient();
  let query = supabase.from("notifikasi").select("*").or(`user_id.eq.${session.user.uid},user_id.is.null`);
  if (onlyUnread) query = query.eq("is_read", false);
  const { data, error } = await query.order("created_at", { ascending: false }).limit(50);
  if (error) return serverError(error);
  return NextResponse.json({ data });
}

/** POST — tandai semua dibaca */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!csrfCheck(req)) return NextResponse.json({ error: "CSRF tidak valid" }, { status: 403 });

  const supabase = getAdminClient();
  const { error } = await supabase
    .from("notifikasi")
    .update({ is_read: true })
    .or(`user_id.eq.${session.user.uid},user_id.is.null`)
    .eq("is_read", false);
  if (error) return serverError(error);
  return NextResponse.json({ ok: true });
}

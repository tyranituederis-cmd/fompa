import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { forbidden, getPagination, hasRole, serverError, unauthorized } from "@/lib/api-helpers";

/** GET — log aktivitas (admin+) */
export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!hasRole(session, "admin")) return forbidden();

  const { limit, offset } = getPagination(req.url, 20);
  const supabase = getAdminClient();
  const { data, error, count } = await supabase
    .from("activity_logs")
    .select("*, users(name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) return serverError(error);

  const items = (data ?? []).map((l) => ({
    ...l,
    user_name: (l.users as { name?: string } | null)?.name ?? null,
    users: undefined,
  }));
  return NextResponse.json({ data: items, count });
}

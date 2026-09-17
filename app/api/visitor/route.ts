import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { forbidden, hasRole, serverError, unauthorized } from "@/lib/api-helpers";

/** POST — visitor ping (publik, sekali per sesi dari client) */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const visitorKey = String(body.visitor_key ?? "anon").slice(0, 64);
  const page = String(body.page ?? "/").slice(0, 200);

  const supabase = getAdminClient();
  const { error } = await supabase
    .from("page_views")
    .upsert({ visitor_key: visitorKey, page, tanggal: new Date().toISOString().slice(0, 10) }, { onConflict: "visitor_key,tanggal" })
    .select()
    .single();
  if (error) return serverError(error);
  return NextResponse.json({ ok: true });
}

/** GET — statistik visitor (admin+) */
export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!hasRole(session, "admin")) return forbidden();

  const supabase = getAdminClient();
  const today = new Date().toISOString().slice(0, 10);
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

  const [{ count: todayCount }, { count: monthCount }, { data: series }] = await Promise.all([
    supabase.from("page_views").select("visitor_key", { count: "exact", head: true }).eq("tanggal", today),
    supabase.from("page_views").select("visitor_key", { count: "exact", head: true }).gte("tanggal", monthStart),
    supabase.from("page_views").select("tanggal, visitor_key").gte("tanggal", monthStart).order("tanggal"),
  ]);

  const byDay = new Map<string, number>();
  (series ?? []).forEach((row) => {
    byDay.set(row.tanggal, (byDay.get(row.tanggal) ?? 0) + 1);
  });

  return NextResponse.json({
    today: todayCount ?? 0,
    month: monthCount ?? 0,
    series: Array.from(byDay.entries()).map(([tanggal, total]) => ({ tanggal, total })),
  });
}

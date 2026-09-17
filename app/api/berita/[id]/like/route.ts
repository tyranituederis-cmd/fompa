import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { csrfCheck, serverError, unauthorized } from "@/lib/api-helpers";

/** POST — toggle like berita (login wajib) */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return unauthorized();
  if (!csrfCheck(req)) return NextResponse.json({ error: "CSRF tidak valid" }, { status: 403 });

  const supabase = getAdminClient();
  const { data: existing } = await supabase
    .from("berita_likes")
    .select("id")
    .eq("berita_id", id)
    .eq("user_id", session.user.uid)
    .maybeSingle();

  if (existing) {
    await supabase.from("berita_likes").delete().eq("id", existing.id);
    await supabase.from("berita").update({ likes: undefined }).eq("id", id);
    const { data: b } = await supabase.from("berita").select("likes").eq("id", id).single();
    await supabase.from("berita").update({ likes: Math.max(0, (b?.likes ?? 1) - 1) }).eq("id", id);
    return NextResponse.json({ liked: false });
  }

  const { error } = await supabase.from("berita_likes").insert({ berita_id: id, user_id: session.user.uid });
  if (error) return serverError(error);
  const { data: b } = await supabase.from("berita").select("likes").eq("id", id).single();
  await supabase.from("berita").update({ likes: (b?.likes ?? 0) + 1 }).eq("id", id);
  return NextResponse.json({ liked: true });
}

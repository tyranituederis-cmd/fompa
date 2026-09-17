import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSession } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { csrfCheck, forbidden, hasRole, serverError, unauthorized } from "@/lib/api-helpers";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED: Record<string, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
};

/** POST — upload file ke Supabase Storage dengan validasi */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!hasRole(session, "pengurus")) return forbidden();
  if (!csrfCheck(req)) return NextResponse.json({ error: "CSRF tidak valid" }, { status: 403 });

  const rl = rateLimit(`upload:${clientIp(req)}:${session.user.uid}`, 20, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Terlalu banyak upload, coba lagi nanti" }, { status: 429 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
  if (!form) return NextResponse.json({ error: "Form tidak valid" }, { status: 400 });

  if (file.size > MAX_SIZE) return NextResponse.json({ error: "Ukuran file maksimal 10 MB" }, { status: 400 });
  const isImage = ALLOWED.image.includes(file.type);
  const isDoc = ALLOWED.document.includes(file.type);
  if (!isImage && !isDoc) {
    return NextResponse.json({ error: "Tipe file tidak diizinkan (gambar atau dokumen)" }, { status: 400 });
  }

  const folder = String(form.get("folder") ?? (isImage ? "images" : "dokumen")).replace(/[^a-z0-9_-]/gi, "");
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${folder}/${session.user.uid}/${randomUUID()}.${ext}`;

  const supabase = getAdminClient();
  const { error } = await supabase.storage.from("fompa-assets").upload(path, file, {
    contentType: file.type,
    cacheControl: "3600",
    upsert: false,
  });
  if (error) return serverError(error);

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/fompa-assets/${path}`;
  return NextResponse.json({ url, path, size: file.size, type: file.type }, { status: 201 });
}

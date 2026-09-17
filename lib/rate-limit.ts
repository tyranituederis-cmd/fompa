/**
 * Rate Limiting sederhana berbasis memori (sliding window).
 * Catatan: untuk multi-instance produksi, ganti dengan Redis/Upstash.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit = 20, windowMs = 60_000): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const timestamps = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (timestamps.length >= limit) {
    const oldest = timestamps[0];
    const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
    return { ok: false, retryAfter };
  }

  timestamps.push(now);
  buckets.set(key, timestamps);
  // Bersihkan bucket lama sesekali agar memori tidak membengkak
  if (buckets.size > 10_000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }
  return { ok: true };
}

export function clientIp(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

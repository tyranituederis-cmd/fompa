import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format tanggal Indonesia */
export function formatDate(date: string | Date | null | undefined) {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateTime(date: string | Date | null | undefined) {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Slug dari teks */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

/** Potong teks */
export function truncate(text: string, length = 120) {
  if (!text) return "";
  return text.length > length ? text.slice(0, length).trim() + "…" : text;
}

/** Hitung sisa waktu ke tanggal target */
export function timeLeft(target: string | Date) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    expired: false,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

/** Hash sederhana untuk visitor key (client-side, non-kriptografis) */
export function simpleHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  koordinator_bidang: "Koordinator Bidang",
  pengurus: "Pengurus",
  alumni: "Alumni",
};

export const ROLE_HIERARCHY = ["super_admin", "admin", "koordinator_bidang", "pengurus", "alumni"];

/** Cek apakah role `role` >= role `minimum` (hierarki) */
export function roleAtLeast(role: string | undefined, minimum: string) {
  if (!role) return false;
  const a = ROLE_HIERARCHY.indexOf(role);
  const b = ROLE_HIERARCHY.indexOf(minimum);
  if (a === -1 || b === -1) return false;
  return a <= b;
}

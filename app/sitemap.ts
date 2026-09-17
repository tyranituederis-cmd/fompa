import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const routes = [
    "",
    "/tentang",
    "/kepengurusan",
    "/program-kerja",
    "/berita",
    "/galeri",
    "/dokumen",
    "/agenda",
    "/kontak",
    "/arsip",
    "/daftar",
  ];
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}

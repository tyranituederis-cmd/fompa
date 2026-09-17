import type { Metadata } from "next";
import { MapPin, Mail, Phone, Instagram, Music2, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = { title: "Kontak" };
export const dynamic = "force-dynamic";

const DEFAULT = {
  alamat: "Jl. Veteran No. 45, Purwakarta, Jawa Barat 41111",
  email: "sekretariat@fompa.id",
  whatsapp: "+62 812-3456-7890",
  instagram: "fompa.purwakarta",
  tiktok: "fompa.purwakarta",
};

export default async function KontakPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("value").eq("key", "site").maybeSingle();
  const s = { ...DEFAULT, ...((data?.value as Record<string, unknown>) ?? {}) };

  const contacts = [
    { icon: <MapPin className="h-5 w-5" />, title: "Alamat Sekretariat", value: String(s.alamat), href: undefined },
    { icon: <Mail className="h-5 w-5" />, title: "Email", value: String(s.email), href: `mailto:${s.email}` },
    { icon: <Phone className="h-5 w-5" />, title: "WhatsApp", value: String(s.whatsapp), href: `https://wa.me/${String(s.whatsapp).replace(/[^0-9]/g, "")}` },
    { icon: <Instagram className="h-5 w-5" />, title: "Instagram", value: `@${s.instagram}`, href: `https://instagram.com/${s.instagram}` },
    { icon: <Music2 className="h-5 w-5" />, title: "TikTok", value: `@${s.tiktok}`, href: `https://tiktok.com/@${s.tiktok}` },
    { icon: <MessageCircle className="h-5 w-5" />, title: "Sosial Media Lainnya", value: "FOMPA Purwakarta", href: undefined },
  ];

  return (
    <div className="container py-16">
      <SectionHeading
        eyebrow="Kontak"
        title="Hubungi Kami"
        subtitle="Sekretariat FOMPA siap menerima pertanyaan, saran, dan kerja sama."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {contacts.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-transform duration-300 hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900">
                <span className="rounded-xl bg-primary/10 p-3 text-primary">{c.icon}</span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">{c.title}</p>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noreferrer" className="font-medium text-slate-800 hover:text-primary dark:text-slate-100">
                      {c.value}
                    </a>
                  ) : (
                    <p className="font-medium text-slate-800 dark:text-slate-100">{c.value}</p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-card dark:border-slate-800">
            <iframe
              title="Lokasi Sekretariat FOMPA"
              src="https://www.google.com/maps?q=Purwakarta,+Jawa+Barat&output=embed"
              className="h-full min-h-[420px] w-full"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

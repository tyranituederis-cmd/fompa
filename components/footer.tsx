import Link from "next/link";
import { Instagram, Mail, MapPin, MessageCircle, Music2, Phone } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div className="space-y-4 md:col-span-2">
          <Logo size={56} />
          <p className="max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Wadah Kolaborasi, Kepemimpinan, dan Sinergi Pelajar Kabupaten Purwakarta.
            <span className="mt-1 block font-medium text-primary">"Bersama dalam Organisasi"</span>
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">Navigasi</h4>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-slate-500 transition-colors hover:text-primary dark:text-slate-400">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/arsip" className="text-slate-500 transition-colors hover:text-primary dark:text-slate-400">
                Arsip Generasi
              </Link>
            </li>
            <li>
              <Link href="/daftar" className="text-slate-500 transition-colors hover:text-primary dark:text-slate-400">
                Gabung FOMPA
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">Kontak</h4>
          <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Jl. Veteran No. 45, Purwakarta, Jawa Barat 41111
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-primary" /> sekretariat@fompa.id
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-primary" /> +62 812-3456-7890
            </li>
          </ul>
          <div className="mt-4 flex gap-2">
            {[
              { icon: <Instagram className="h-4 w-4" />, label: "Instagram" },
              { icon: <Music2 className="h-4 w-4" />, label: "TikTok" },
              { icon: <MessageCircle className="h-4 w-4" />, label: "WhatsApp" },
            ].map((s) => (
              <a
                key={s.label}
                href="#kontak"
                aria-label={s.label}
                className="rounded-full border border-slate-200 p-2.5 text-slate-500 transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white dark:border-slate-700 dark:text-slate-400"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Forum OSIS MPK Purwakarta (FOMPA). Seluruh hak cipta dilindungi.</p>
          <p>
            Dibuat dengan <span className="text-primary">♥</span> oleh pengurus FOMPA
          </p>
        </div>
      </div>
    </footer>
  );
}

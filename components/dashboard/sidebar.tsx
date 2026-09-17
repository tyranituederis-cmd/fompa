"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Newspaper,
  ClipboardList,
  Images,
  FolderOpen,
  CalendarDays,
  UserPlus,
  Shield,
  Settings,
  Activity,
  LogOut,
  Bell,
  Menu,
  X,
  UserCircle,
  QrCode,
} from "lucide-react";
import { cn, ROLE_LABEL } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  user: { name: string; email: string; image: string | null; role: string };
}

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, min: "pengurus" },
  { href: "/dashboard/berita", label: "Berita", icon: Newspaper, min: "pengurus" },
  { href: "/dashboard/pengurus", label: "Pengurus", icon: Users, min: "admin" },
  { href: "/dashboard/program", label: "Program Kerja", icon: ClipboardList, min: "admin" },
  { href: "/dashboard/galeri", label: "Galeri", icon: Images, min: "pengurus" },
  { href: "/dashboard/dokumen", label: "Dokumen", icon: FolderOpen, min: "pengurus" },
  { href: "/dashboard/agenda", label: "Agenda", icon: CalendarDays, min: "admin" },
  { href: "/dashboard/absensi", label: "Absensi", icon: QrCode, min: "pengurus" },
  { href: "/dashboard/pendaftaran", label: "Pendaftaran", icon: UserPlus, min: "admin" },
  { href: "/dashboard/user", label: "User", icon: Shield, min: "admin" },
  { href: "/dashboard/pengaturan", label: "Pengaturan", icon: Settings, min: "admin" },
  { href: "/dashboard/log-aktivitas", label: "Log Aktivitas", icon: Activity, min: "admin" },
] as const;

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [notifs, setNotifs] = React.useState<{ id: string; judul: string; pesan: string | null; link: string | null; is_read: boolean }[]>([]);

  const role = user.role;

  React.useEffect(() => {
    fetch("/api/notifikasi?unread=false")
      .then((r) => r.json())
      .then((res) => setNotifs(res.data ?? []))
      .catch(() => {});
  }, []);

  const unread = notifs.filter((n) => !n.is_read).length;

  const markAllRead = async () => {
    await fetch("/api/notifikasi", { method: "POST" });
    setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const navItems = NAV.filter((item) => {
    const order = ["pengurus", "admin", "super_admin"];
    return order.indexOf(role) >= order.indexOf(item.min);
  });

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-5">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo size={36} />
        </Link>
        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800" onClick={() => setOpen(false)}>
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                active
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              <item.icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              {user.name.charAt(0)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{user.name}</p>
            <Badge className="mt-0.5 text-[10px]">{ROLE_LABEL[role] ?? role}</Badge>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800"
            aria-label="Keluar"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Topbar mobile */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-950/90">
        <button onClick={() => setOpen(true)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-bold text-slate-800 dark:text-slate-100">Dashboard FOMPA</span>
        <div className="relative">
          <button onClick={() => setNotifOpen((v) => !v)} className="relative rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Notifikasi">
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-900">
        {content}
      </aside>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl dark:bg-slate-900">{content}</aside>
        </div>
      )}

      {/* Notifikasi panel */}
      {notifOpen && (
        <div className="fixed inset-x-0 top-14 z-50 border-b border-slate-200 bg-white p-4 shadow-xl lg:hidden dark:border-slate-800 dark:bg-slate-900">
          <NotificationList notifs={notifs} onMarkAll={markAllRead} onNavigate={(href) => { router.push(href); setNotifOpen(false); }} />
        </div>
      )}
    </>
  );
}

function NotificationList({
  notifs,
  onMarkAll,
  onNavigate,
}: {
  notifs: { id: string; judul: string; pesan: string | null; link: string | null; is_read: boolean }[];
  onMarkAll: () => void;
  onNavigate: (href: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Notifikasi</p>
        <button onClick={onMarkAll} className="text-xs text-primary hover:underline">
          Tandai semua dibaca
        </button>
      </div>
      <div className="max-h-72 space-y-1 overflow-y-auto">
        {notifs.length === 0 && <p className="py-6 text-center text-sm text-slate-400">Tidak ada notifikasi</p>}
        {notifs.map((n) => (
          <button
            key={n.id}
            onClick={() => n.link && onNavigate(n.link)}
            className={cn(
              "flex w-full items-start gap-2 rounded-xl p-2.5 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800",
              !n.is_read && "bg-primary/5"
            )}
          >
            <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.is_read ? "bg-slate-300 dark:bg-slate-600" : "bg-red-500")} />
            <span>
              <span className="block text-sm font-medium text-slate-800 dark:text-slate-100">{n.judul}</span>
              {n.pesan && <span className="block text-xs text-slate-400">{n.pesan}</span>}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

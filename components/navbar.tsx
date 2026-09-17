"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogOut, LayoutDashboard, Search } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { SearchGlobal } from "@/components/search-global";

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled || mobileOpen
            ? "border-b border-slate-200/70 bg-white/80 shadow-glass backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/80"
            : "bg-transparent"
        )}
      >
        <nav className="container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <Logo size={38} />
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300",
                  pathname === link.href
                    ? "text-primary"
                    : "text-slate-600 hover:bg-slate-100 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-800"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSearchOpen(true)} aria-label="Cari">
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle />

            {session ? (
              <div className="hidden items-center gap-1.5 sm:flex">
                <Link href="/dashboard">
                  <Button size="sm">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="iconSm"
                  className="rounded-full"
                  aria-label="Keluar"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:block">
                <Button size="sm" variant="outline">
                  Login
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-slate-100 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
            <div className="container flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                {session ? (
                  <>
                    <Link href="/dashboard" className="flex-1">
                      <Button className="w-full">Dashboard</Button>
                    </Link>
                    <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
                      <LogOut className="h-4 w-4" /> Keluar
                    </Button>
                  </>
                ) : (
                  <Link href="/login" className="flex-1">
                    <Button className="w-full">Login</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <SearchGlobal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

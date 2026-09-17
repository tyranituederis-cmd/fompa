"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Field } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

const DEMO_ACCOUNTS = [
  { role: "Super Admin", email: "admin@fompa.id", pass: "Admin123!" },
  { role: "Admin", email: "sekretaris@fompa.id", pass: "Sekretaris123!" },
  { role: "Koordinator", email: "koordinator@fompa.id", pass: "Koordinator123!" },
  { role: "Pengurus", email: "pengurus@fompa.id", pass: "Pengurus123!" },
  { role: "Alumni", email: "alumni@fompa.id", pass: "Alumni123!" },
];

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        toast("Email atau password salah", "error");
      } else {
        toast("Login berhasil!");
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (acc: (typeof DEMO_ACCOUNTS)[number]) => {
    setEmail(acc.email);
    setPassword(acc.pass);
  };

  return (
    <div className="rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-xl dark:bg-slate-950/90">
      <form onSubmit={submit} className="space-y-5">
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@fompa.id" />
        </Field>
        <Field>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          Masuk
        </Button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">Akun Demo</p>
        <div className="grid grid-cols-1 gap-1.5">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.email}
              type="button"
              onClick={() => quickFill(acc)}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs transition-colors hover:bg-primary/10 dark:bg-slate-900"
            >
              <span className="font-medium text-slate-600 dark:text-slate-300">{acc.role}</span>
              <span className="text-slate-400">{acc.email}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

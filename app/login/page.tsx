import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Login" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-dark p-4">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 text-center">
          <img src="/logo.jpg" alt="Logo FOMPA" className="mx-auto h-20 w-20 rounded-full object-contain ring-4 ring-white/30" />
          <h1 className="mt-4 text-2xl font-bold text-white">Masuk ke Dashboard</h1>
          <p className="mt-1 text-sm text-white/70">Forum OSIS MPK Purwakarta</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

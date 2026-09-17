"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function AbsensiForm({ agendaId }: { agendaId: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [state, setState] = React.useState<"idle" | "loading" | "done">("idle");
  const [record, setRecord] = React.useState<{ status: string; created_at: string } | null>(null);

  React.useEffect(() => {
    if (status === "authenticated") {
      fetch(`/api/absensi?agenda_id=${agendaId}`)
        .then((r) => r.json())
        .then((res) => res.record && setRecord(res.record))
        .catch(() => {});
    }
  }, [status, agendaId]);

  if (status === "loading") {
    return (
      <div className="mt-6 flex justify-center rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <UserX className="mx-auto h-10 w-10 text-slate-300" />
        <p className="mt-3 font-medium text-slate-700 dark:text-slate-200">Anda harus login sebagai pengurus</p>
        <p className="mt-1 text-sm text-slate-400">Presensi menggunakan akun pengurus FOMPA.</p>
        <Button className="mt-4" onClick={() => router.push("/login")}>
          Login
        </Button>
      </div>
    );
  }

  if (record || state === "done") {
    return (
      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900 dark:bg-emerald-950">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
        <p className="mt-3 font-semibold text-emerald-700 dark:text-emerald-300">
          {record ? `Kehadiran tercatat: ${record.status.toUpperCase()}` : "Terima kasih, kehadiran Anda tercatat!"}
        </p>
        {record && <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">Waktu: {new Date(record.created_at).toLocaleString("id-ID")}</p>}
      </div>
    );
  }

  const mark = async (status: "hadir" | "izin") => {
    setState("loading");
    try {
      const res = await fetch("/api/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agenda_id: agendaId, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setState("done");
      toast("Presensi berhasil disimpan");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Gagal", "error");
      setState("idle");
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Halo, <span className="font-semibold text-slate-800 dark:text-slate-100">{session.user.name}</span>!
        Konfirmasi kehadiran Anda:
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button className="flex-1" size="lg" disabled={state === "loading"} onClick={() => mark("hadir")}>
          {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Hadir
        </Button>
        <Button className="flex-1" size="lg" variant="outline" disabled={state === "loading"} onClick={() => mark("izin")}>
          Izin
        </Button>
      </div>
    </div>
  );
}

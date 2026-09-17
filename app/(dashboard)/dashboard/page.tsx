"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Users,
  Newspaper,
  CalendarDays,
  FolderOpen,
  Eye,
  TrendingUp,
  UploadCloud,
  PenLine,
  CalendarPlus,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABEL, formatDate } from "@/lib/utils";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

interface Stats {
  pengurus: number;
  berita: number;
  agenda: number;
  dokumen: number;
  visitorsToday: number;
  visitorsMonth: number;
  series: { tanggal: string; total: number }[];
  agendaByStatus: Record<string, number>;
  upcoming: { id: string; judul: string; tanggal: string; lokasi: string | null }[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = React.useState<Stats | null>(null);

  React.useEffect(() => {
    (async () => {
      const [pengurus, berita, agenda, dokumen, visitor] = await Promise.all([
        fetch("/api/pengurus?status=aktif").then((r) => r.json()),
        fetch("/api/berita").then((r) => r.json()),
        fetch("/api/agenda").then((r) => r.json()),
        fetch("/api/dokumen").then((r) => r.json()),
        fetch("/api/visitor").then((r) => r.json()),
      ]);

      const agendaList: { id: string; judul: string; tanggal: string; lokasi: string | null; status: string }[] =
        agenda.data ?? [];
      const byStatus: Record<string, number> = {};
      agendaList.forEach((a) => {
        byStatus[a.status] = (byStatus[a.status] ?? 0) + 1;
      });

      setStats({
        pengurus: pengurus.data?.length ?? 0,
        berita: berita.count ?? berita.data?.length ?? 0,
        agenda: agendaList.length,
        dokumen: dokumen.data?.length ?? 0,
        visitorsToday: visitor.today ?? 0,
        visitorsMonth: visitor.month ?? 0,
        series: visitor.series ?? [],
        agendaByStatus: byStatus,
        upcoming: agendaList
          .filter((a) => a.status === "akan_datang" && new Date(a.tanggal) >= new Date())
          .slice(0, 4),
      });
    })();
  }, []);

  if (!stats) {
    return (
      <div>
        <Skeleton className="h-10 w-72" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Pengurus", value: stats.pengurus, icon: <Users className="h-5 w-5" /> },
    { label: "Total Berita", value: stats.berita, icon: <Newspaper className="h-5 w-5" /> },
    { label: "Total Event", value: stats.agenda, icon: <CalendarDays className="h-5 w-5" /> },
    { label: "Total Dokumen", value: stats.dokumen, icon: <FolderOpen className="h-5 w-5" /> },
    { label: "Visitor Hari Ini", value: stats.visitorsToday, icon: <Eye className="h-5 w-5" /> },
    { label: "Visitor Bulan Ini", value: stats.visitorsMonth, icon: <TrendingUp className="h-5 w-5" /> },
  ];

  const chartData = {
    labels: stats.series.map((s) => s.tanggal.slice(5)),
    datasets: [
      {
        label: "Visitor",
        data: stats.series.map((s) => s.total),
        borderColor: "#D62828",
        backgroundColor: "rgba(214, 40, 40, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  const doughnutData = {
    labels: Object.keys(stats.agendaByStatus),
    datasets: [
      {
        data: Object.values(stats.agendaByStatus),
        backgroundColor: ["#F59E0B", "#10B981", "#3B82F6", "#EF4444"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div>
      <PageHeader
        title={`Halo, ${session?.user?.name ?? "Pengurus"} 👋`}
        description={`${ROLE_LABEL[session?.user?.role ?? ""] ?? "Pengurus"} — Berikut ringkasan aktivitas FOMPA.`}
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((s) => (
          <Card key={s.label} className="hover:shadow-lg">
            <CardContent className="flex items-center gap-4 p-5">
              <span className="rounded-xl bg-primary/10 p-3 text-primary">{s.icon}</span>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link href="/dashboard/galeri">
          <Card className="group p-4 transition-all hover:border-primary hover:shadow-lg">
            <CardContent className="flex items-center gap-3 p-0">
              <UploadCloud className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Upload Dokumentasi</span>
              <ArrowRight className="ml-auto h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/berita/baru">
          <Card className="group p-4 transition-all hover:border-primary hover:shadow-lg">
            <CardContent className="flex items-center gap-3 p-0">
              <PenLine className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Tulis Berita</span>
              <ArrowRight className="ml-auto h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/agenda">
          <Card className="group p-4 transition-all hover:border-primary hover:shadow-lg">
            <CardContent className="flex items-center gap-3 p-0">
              <CalendarPlus className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Buat Agenda</span>
              <ArrowRight className="ml-auto h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Statistik Visitor Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.series.length > 0 ? (
              <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} height={260} />
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-slate-400">Belum ada data visitor</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Agenda per Status</CardTitle>
          </CardHeader>
          <CardContent className="flex h-[300px] items-center justify-center">
            {Object.keys(stats.agendaByStatus).length > 0 ? (
              <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
            ) : (
              <span className="text-sm text-slate-400">Belum ada agenda</span>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Agenda terdekat */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Agenda Terdekat</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.upcoming.length === 0 ? (
            <p className="text-sm text-slate-400">Tidak ada agenda mendatang.</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats.upcoming.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{a.judul}</p>
                    <p className="text-xs text-slate-400">
                      {formatDate(a.tanggal)}
                      {a.lokasi ? ` · ${a.lokasi}` : ""}
                    </p>
                  </div>
                  <Link href={`/dashboard/agenda`} className="text-xs font-medium text-primary hover:underline">
                    Kelola
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

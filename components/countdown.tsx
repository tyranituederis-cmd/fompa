"use client";

import * as React from "react";
import { timeLeft } from "@/lib/utils";

export function Countdown({ target }: { target: string }) {
  const [left, setLeft] = React.useState(() => timeLeft(target));

  React.useEffect(() => {
    const timer = setInterval(() => setLeft(timeLeft(target)), 1000);
    return () => clearInterval(timer);
  }, [target]);

  if (left.expired) {
    return (
      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
        Sedang berlangsung / selesai
      </span>
    );
  }

  const cells = [
    { label: "Hari", value: left.days },
    { label: "Jam", value: left.hours },
    { label: "Menit", value: left.minutes },
    { label: "Detik", value: left.seconds },
  ];

  return (
    <div className="flex items-center gap-2">
      {cells.map((c) => (
        <div
          key={c.label}
          className="flex min-w-[52px] flex-col items-center rounded-xl bg-primary/10 px-2 py-1.5 dark:bg-primary/20"
        >
          <span className="text-lg font-bold tabular-nums text-primary">{String(c.value).padStart(2, "0")}</span>
          <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{c.label}</span>
        </div>
      ))}
    </div>
  );
}

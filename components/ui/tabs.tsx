"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300",
            value === tab.value
              ? "bg-primary text-white shadow-md shadow-primary/25"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

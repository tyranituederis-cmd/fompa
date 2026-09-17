import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary border border-primary/20",
        outline: "border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300",
        success: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
        warning: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300",
        danger: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950 dark:text-red-300",
        info: "bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950 dark:text-sky-300",
        dark: "bg-slate-900 text-white dark:bg-white dark:text-slate-900",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };

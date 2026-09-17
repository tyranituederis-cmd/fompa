import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  withText?: boolean;
  textClassName?: string;
  className?: string;
  rounded?: boolean;
}

export function Logo({ size = 40, withText = true, textClassName, className, rounded = true }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.jpg"
        alt="Logo FOMPA"
        width={size}
        height={size}
        className={cn(rounded ? "rounded-full" : "", "object-contain ring-1 ring-slate-200 dark:ring-slate-700")}
      />
      {withText && (
        <span className={cn("font-bold leading-tight text-slate-900 dark:text-white", textClassName)}>
          FOMPA
          <span className="block text-[0.65em] font-medium text-slate-500 dark:text-slate-400">
            Forum OSIS MPK Purwakarta
          </span>
        </span>
      )}
    </span>
  );
}

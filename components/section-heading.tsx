import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({ eyebrow, title, subtitle, align = "center", className }: SectionHeadingProps) {
  return (
    <Reveal className={cn(align === "center" ? "mx-auto text-center" : "text-left", "max-w-2xl", className)}>
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base text-slate-500 dark:text-slate-400 md:text-lg">{subtitle}</p>}
    </Reveal>
  );
}

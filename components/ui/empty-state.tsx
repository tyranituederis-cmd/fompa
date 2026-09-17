import { Inbox } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 py-16 text-center">
      <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4">
        <Inbox className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      {description && <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
  );
}

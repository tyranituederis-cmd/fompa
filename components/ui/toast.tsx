"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";
interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const ToastContext = React.createContext<(message: string, type?: ToastType) => void>(() => {});

export function useToast() {
  return React.useContext(ToastContext);
}

/** Panggil dari mana saja: toast("Berhasil disimpan") */
export function toast(message: string, type: ToastType = "success") {
  window.dispatchEvent(new CustomEvent("app-toast", { detail: { message, type } }));
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  React.useEffect(() => {
    const handler = (e: Event) => {
      const { message, type } = (e as CustomEvent).detail as { message: string; type: ToastType };
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, message, type }]);
      setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 4000);
    };
    window.addEventListener("app-toast", handler);
    return () => window.removeEventListener("app-toast", handler);
  }, []);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-sky-500" />,
  };

  return (
    <ToastContext.Provider value={() => {}}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex flex-col gap-2">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className={cn(
                "pointer-events-auto flex items-center gap-3 rounded-xl border bg-white dark:bg-slate-900 px-4 py-3 shadow-xl",
                item.type === "success" && "border-emerald-200 dark:border-emerald-900",
                item.type === "error" && "border-red-200 dark:border-red-900",
                item.type === "info" && "border-sky-200 dark:border-sky-900"
              )}
            >
              {icons[item.type]}
              <p className="text-sm text-slate-800 dark:text-slate-100">{item.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";

interface LightboxProps {
  images: { url: string; judul: string }[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (index === null) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onNavigate]);

  const current = index !== null ? images[index] : null;

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" onClick={onClose}>
            <X className="h-6 w-6" />
          </button>

          <button
            className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index! - 1 + images.length) % images.length);
            }}
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <motion.figure
            className="max-h-[85vh] max-w-4xl"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.url} alt={current.judul} className="max-h-[75vh] w-auto rounded-2xl object-contain" />
            <figcaption className="mt-3 flex items-center justify-between gap-4 text-white">
              <span className="text-sm">{current.judul}</span>
              <a
                href={current.url}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20"
              >
                <Download className="h-3.5 w-3.5" /> Unduh
              </a>
            </figcaption>
          </motion.figure>

          <button
            className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index! + 1) % images.length);
            }}
            aria-label="Berikutnya"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

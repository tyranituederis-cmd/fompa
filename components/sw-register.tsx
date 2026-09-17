"use client";

import * as React from "react";

/** Daftarkan service worker untuk PWA (hanya produksi) */
export function SwRegister() {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return null;
}

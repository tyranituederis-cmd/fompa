"use client";

import * as React from "react";
import { simpleHash } from "@/lib/utils";

/** Kirim sinyal visitor sekali per sesi (live visitor counter) */
export function VisitorPing({ page = "/" }: { page?: string }) {
  React.useEffect(() => {
    const key = "fompa_visitor";
    const sent = sessionStorage.getItem(key);
    if (sent) return;
    sessionStorage.setItem(key, "1");

    const ua = navigator.userAgent;
    const hash = simpleHash((navigator.language || "id") + ua);
    fetch("/api/visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitor_key: hash, page }),
    }).catch(() => {});
  }, [page]);

  return null;
}

"use client";

import { useEffect } from "react";
import { applyTheme, DEFAULT_THEME } from "@/lib/theme";

/** Applies CSS variables from the first package’s theme when available. */
export function ThemeFromFirstPackage() {
  useEffect(() => {
    let cancelled = false;
    fetch("/packages/index.json")
      .then((r) => r.json())
      .then(async (idx) => {
        const first = idx?.packages?.[0];
        if (!first) return;
        const detail = await fetch(`/packages/${first.id}.json`)
          .then((r) => r.json())
          .catch(() => null);
        if (!cancelled && detail?.theme) applyTheme(detail.theme);
      })
      .catch(() => applyTheme(DEFAULT_THEME));
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

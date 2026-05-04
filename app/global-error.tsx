"use client";

import { useEffect } from "react";
import "./globals.css";
import { MaintenanceFallback } from "@/components/MaintenanceFallback";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[global error]", error.message, error.digest ?? "");
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-full antialiased">
        <MaintenanceFallback onReset={() => reset()} />
      </body>
    </html>
  );
}

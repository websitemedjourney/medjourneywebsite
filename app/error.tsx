"use client";

import { useEffect } from "react";
import { MaintenanceFallback } from "@/components/MaintenanceFallback";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[app error]", error.message, error.digest ?? "");
  }, [error]);

  return <MaintenanceFallback onReset={() => reset()} />;
}

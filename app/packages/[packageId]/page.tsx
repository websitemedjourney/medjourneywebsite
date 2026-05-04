import { readFile } from "fs/promises";
import path from "path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PackageDetail } from "@/app/types";
import { PackageDetailView } from "./package-detail-view";

async function getPackage(packageId: string): Promise<PackageDetail | null> {
  if (!/^[a-zA-Z0-9_-]+$/.test(packageId)) return null;
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "packages",
      `${packageId}.json`,
    );
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as PackageDetail;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  props: PageProps<"/packages/[packageId]">,
): Promise<Metadata> {
  const { packageId } = await props.params;
  const pkg = await getPackage(packageId);
  if (!pkg) {
    return { title: "Package not found — Med Journey" };
  }
  return {
    title: `${pkg.title} — Med Journey`,
    description: pkg.overview.slice(0, 160),
  };
}

export default async function PackageDetailPage(
  props: PageProps<"/packages/[packageId]">,
) {
  const { packageId } = await props.params;
  const pkg = await getPackage(packageId);
  if (!pkg) notFound();
  return <PackageDetailView pkg={pkg} />;
}

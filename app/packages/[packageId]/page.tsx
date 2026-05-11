import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PackageDetail } from "@/app/types";
import { PackageDetailView } from "./package-detail-view";
import { getPackageById } from "@/lib/db";

async function getPackage(packageId: string): Promise<PackageDetail | null> {
  if (!packageId) return null;
  const pkg = getPackageById(packageId);
  return pkg?.published ? pkg : null;
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

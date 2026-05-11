import { NextResponse } from "next/server";
import { getPackageReviews } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const packageId = searchParams.get("packageId") ?? "";
  if (!packageId) {
    return NextResponse.json({ reviews: [] });
  }
  const reviews = getPackageReviews(packageId);
  return NextResponse.json({ reviews });
}

import { NextResponse } from "next/server";
import { getPackageById } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ packageId: string }> },
) {
  const { packageId } = await params;
  const pkg = getPackageById(packageId);
  if (!pkg || !pkg.published) {
    return NextResponse.json({ error: "Package not found." }, { status: 404 });
  }

  return NextResponse.json({ package: pkg });
}

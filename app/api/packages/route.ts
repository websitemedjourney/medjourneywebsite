import { NextResponse } from "next/server";
import { getPackageSummaries } from "@/lib/db";

export async function GET() {
  const packages = getPackageSummaries();
  return NextResponse.json({ packages });
}

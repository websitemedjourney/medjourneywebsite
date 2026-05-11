import { NextResponse } from "next/server";
import { getAllPackageSummaries, savePackage } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const packages = getAllPackageSummaries();
  return NextResponse.json({ packages });
}

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const pkg = await request.json();
    if (!pkg.id || !pkg.title) {
      return NextResponse.json(
        { error: "Package ID and title are required." },
        { status: 400 },
      );
    }
    savePackage(pkg);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Could not save package: ${message}` },
      { status: 500 },
    );
  }
}

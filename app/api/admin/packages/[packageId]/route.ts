import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { deletePackage, getPackageById, savePackage } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ packageId: string }> },
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { packageId } = await params;
  const pkg = getPackageById(packageId);
  if (!pkg) {
    return NextResponse.json({ error: "Package not found." }, { status: 404 });
  }
  return NextResponse.json({ package: pkg });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ packageId: string }> },
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { packageId } = await params;
  try {
    const pkg = await request.json();
    savePackage(pkg);
    if (pkg.id !== packageId) {
      deletePackage(packageId);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Could not update package: ${message}` },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ packageId: string }> },
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { packageId } = await params;
  try {
    deletePackage(packageId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Could not delete package: ${message}` },
      { status: 500 },
    );
  }
}

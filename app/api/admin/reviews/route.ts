import { NextResponse } from "next/server";
import { getAllReviews } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const reviews = getAllReviews();
  return NextResponse.json({ reviews });
}

import { NextResponse } from "next/server";
import { getHomeReviews, saveReview } from "@/lib/db";

export async function GET() {
  const reviews = getHomeReviews();
  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, rating, review, image, packageId } = body;

    if (!name || !rating || !review) {
      return NextResponse.json(
        { error: "name, rating, and review are required." },
        { status: 400 },
      );
    }

    const id = saveReview({
      name,
      email: email || "",
      rating,
      review,
      image: image || "",
      packageId: packageId || undefined,
      approved: true,
      highlightedHome: false,
      highlightedPackage: false,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Could not save review: ${message}` },
      { status: 500 },
    );
  }
}

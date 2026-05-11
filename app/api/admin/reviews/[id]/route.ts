import { NextResponse } from "next/server";
import { deleteReview, updateReview } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const reviewId = parseInt(id, 10);

  try {
    const body = await request.json();
    const { approved, highlightedHome, highlightedPackage } = body;
    updateReview(reviewId, { approved, highlightedHome, highlightedPackage });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Could not update review: ${message}` },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const reviewId = parseInt(id, 10);

  try {
    deleteReview(reviewId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Could not delete review: ${message}` },
      { status: 500 },
    );
  }
}

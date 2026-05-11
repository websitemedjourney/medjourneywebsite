import { NextResponse } from "next/server";
import { saveContact } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "name, email, subject, and message are required." },
        { status: 400 },
      );
    }

    saveContact({ name, email, phone: phone || "", subject, message });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Could not save contact submission: ${message}` },
      { status: 500 },
    );
  }
}

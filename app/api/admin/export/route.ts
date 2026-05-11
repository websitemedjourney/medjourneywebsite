import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { exportDatabasePath } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const dbPath = exportDatabasePath();
  if (!fs.existsSync(dbPath)) {
    return NextResponse.json(
      { error: "Database file not found." },
      { status: 404 },
    );
  }

  const fileContents = fs.readFileSync(dbPath);
  return new NextResponse(fileContents, {
    status: 200,
    headers: {
      "Content-Type": "application/x-sqlite3",
      "Content-Disposition": `attachment; filename="medjourney-db.sqlite"`,
    },
  });
}

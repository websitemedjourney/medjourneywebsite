import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "medjourney_admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_TOKEN = crypto
  .createHash("sha256")
  .update(ADMIN_PASSWORD)
  .digest("hex");

export function getAdminToken() {
  return ADMIN_TOKEN;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME)?.value;
  return Boolean(cookie && cookie === ADMIN_TOKEN);
}

export function createAuthResponse() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: COOKIE_NAME,
    value: ADMIN_TOKEN,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  });
  return response;
}

export function clearAdminCookie() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}

export function verifyAdminPassword(password: string) {
  return password === ADMIN_PASSWORD;
}

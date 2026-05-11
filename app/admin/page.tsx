import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminToken } from "@/lib/admin";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("medjourney_admin")?.value;
  if (token !== getAdminToken()) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}

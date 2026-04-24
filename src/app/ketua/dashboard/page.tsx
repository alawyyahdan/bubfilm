import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== "valid") {
    redirect("/ketua");
  }

  return <AdminDashboard />;
}

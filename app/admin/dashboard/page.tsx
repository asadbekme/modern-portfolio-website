import { redirect } from "next/navigation";

/**
 * Admin Dashboard Home Page
 * 
 * WHY: Redirects to projects page as it's the main admin feature.
 */
export default function AdminDashboardPage() {
  redirect("/admin/projects");
}

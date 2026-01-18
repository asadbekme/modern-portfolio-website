import { LayoutDashboard, FolderKanban, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminLogoutButton } from "./_components/admin-logout-button";

/**
 * Admin Dashboard Layout with Sidebar
 * 
 * WHY: Sidebar navigation provides clear structure and easy access
 * to different admin sections. This layout is used by all admin dashboard pages.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen fixed left-0 top-0">
          <div className="p-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 mb-8">
              <LayoutDashboard className="w-6 h-6" />
              <span className="text-xl font-bold">Admin Dashboard</span>
            </Link>

            <nav className="space-y-2">
              <Link href="/admin/projects">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <FolderKanban className="w-4 h-4" />
                  Projects
                </Button>
              </Link>
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <AdminLogoutButton />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

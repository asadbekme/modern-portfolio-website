"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  FolderKanban,
  User,
  Mail,
  Code2,
  Settings,
  ArrowLeft,
  LogOut,
} from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Hero", href: "/admin/hero", icon: BriefcaseBusiness },
  { title: "Projects", href: "/admin/projects", icon: FolderKanban },
  { title: "Skills", href: "/admin/skills", icon: Code2 },
  { title: "About", href: "/admin/about", icon: User },
  { title: "Contact", href: "/admin/contact", icon: Mail },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

const AdminLayout = ({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isLoginPage = pathname?.endsWith("/admin/login");

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 fixed h-full flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </h2>
          {user && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
              {user.email}
            </p>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const href = `/${locale}${item.href}`;
            const isActive = pathname === href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={logout}
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </Button>

          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={18} />
            <span>Back to Website</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 ml-64">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;

"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

/**
 * Admin Logout Button Component
 * 
 * WHY: Client component for logout functionality. Handles
 * API call and navigation after logout.
 */
export function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logged out successfully");
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
      onClick={handleLogout}
    >
      <LogOut className="w-4 h-4" />
      Logout
    </Button>
  );
}

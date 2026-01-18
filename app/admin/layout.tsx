import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin Layout - Protects all /admin routes
 * 
 * WHY: Server-side auth check in layout ensures all admin routes
 * are protected. This is more secure than client-side checks alone.
 */
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/admin/login");
    }

    return <>{children}</>;
}

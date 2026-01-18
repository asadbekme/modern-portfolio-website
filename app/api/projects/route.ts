import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/projects?locale=en
 * 
 * Fetches all published projects with translations for a specific locale.
 * Public endpoint - no authentication required.
 * 
 * WHY: Separated from admin routes because public site needs to fetch
 * projects without authentication.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";

    // Validate locale
    if (!["en", "ru", "uz"].includes(locale)) {
      return NextResponse.json(
        { error: "Invalid locale" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch published projects with translations
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select(`
        id,
        image,
        live_url,
        github_url,
        tech,
        display_order
      `)
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (projectsError) throw projectsError;

    if (!projects || projects.length === 0) {
      return NextResponse.json({ projects: [] });
    }

    // Fetch translations for the requested locale
    const projectIds = projects.map((p) => p.id);
    const { data: translations, error: translationsError } = await supabase
      .from("project_translations")
      .select("project_id, title, description")
      .in("project_id", projectIds)
      .eq("locale", locale);

    if (translationsError) throw translationsError;

    // Combine projects with translations
    const projectsWithTranslations = projects.map((project) => {
      const translation = translations?.find(
        (t) => t.project_id === project.id
      );

      return {
        id: project.id,
        title: translation?.title || "",
        description: translation?.description || "",
        image: project.image,
        tech: project.tech || [],
        liveUrl: project.live_url,
        githubUrl: project.github_url,
      };
    });

    return NextResponse.json({ projects: projectsWithTranslations });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

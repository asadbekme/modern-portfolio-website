import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/admin/projects
 * 
 * Fetches all projects (including unpublished) for admin dashboard.
 * Requires authentication.
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all projects with all translations
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select(`
        id,
        image,
        live_url,
        github_url,
        tech,
        is_published,
        display_order,
        created_at,
        updated_at
      `)
      .order("display_order", { ascending: true });

    if (projectsError) throw projectsError;

    if (!projects || projects.length === 0) {
      return NextResponse.json({ projects: [] });
    }

    // Fetch all translations
    const projectIds = projects.map((p) => p.id);
    const { data: translations, error: translationsError } = await supabase
      .from("project_translations")
      .select("project_id, locale, title, description")
      .in("project_id", projectIds);

    if (translationsError) throw translationsError;

    // Combine projects with translations
    const projectsWithTranslations = projects.map((project) => {
      const projectTranslations = translations?.filter(
        (t) => t.project_id === project.id
      ) || [];

      const translationsObj = {
        en: { title: "", description: "" },
        ru: { title: "", description: "" },
        uz: { title: "", description: "" },
      };

      projectTranslations.forEach((trans) => {
        translationsObj[trans.locale as keyof typeof translationsObj] = {
          title: trans.title,
          description: trans.description,
        };
      });

      return {
        ...project,
        translations: translationsObj,
      };
    });

    return NextResponse.json({ projects: projectsWithTranslations });
  } catch (error) {
    console.error("Error fetching admin projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/projects
 * 
 * Creates a new project with translations.
 * Requires authentication.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Create project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        image: body.image,
        live_url: body.live_url || null,
        github_url: body.github_url || null,
        tech: body.tech || [],
        is_published: body.is_published || false,
        display_order: body.display_order || 0,
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // Create translations
    const translationsToInsert = ["en", "ru", "uz"].map((locale) => ({
      project_id: project.id,
      locale,
      title: body.translations[locale]?.title || "",
      description: body.translations[locale]?.description || "",
    }));

    const { error: translationsError } = await supabase
      .from("project_translations")
      .insert(translationsToInsert);

    if (translationsError) throw translationsError;

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

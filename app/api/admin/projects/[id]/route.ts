import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Extract file path from Supabase Storage URL
 */
function extractFilePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const bucketIndex = pathParts.indexOf("projects");
    
    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      return pathParts.slice(bucketIndex + 1).join("/");
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Delete image from Supabase Storage
 */
async function deleteImageFromStorage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  imageUrl: string
): Promise<void> {
  const filePath = extractFilePathFromUrl(imageUrl);
  
  if (!filePath) {
    console.warn("Could not extract file path from URL:", imageUrl);
    return;
  }
  
  const { error } = await supabase.storage
    .from("projects")
    .remove([filePath]);
  
  if (error) {
    console.error("Error deleting image from storage:", error);
    // Don't throw - image deletion failure shouldn't block the operation
  }
}

/**
 * PUT /api/admin/projects/[id]
 * 
 * Updates a project and its translations.
 * Requires authentication.
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const { id } = params;

    // Get current project to check if image is being replaced
    const { data: currentProject, error: fetchError } = await supabase
      .from("projects")
      .select("image")
      .eq("id", id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "not found" - ignore it
      throw fetchError;
    }

    // Delete old image if it's being replaced
    if (
      currentProject?.image &&
      body.image &&
      currentProject.image !== body.image
    ) {
      await deleteImageFromStorage(supabase, currentProject.image);
    }

    // Update project
    const { error: projectError } = await supabase
      .from("projects")
      .update({
        image: body.image,
        live_url: body.live_url || null,
        github_url: body.github_url || null,
        tech: body.tech || [],
        is_published: body.is_published || false,
        display_order: body.display_order || 0,
      })
      .eq("id", id);

    if (projectError) throw projectError;

    // Update or insert translations
    for (const locale of ["en", "ru", "uz"]) {
      const { error: translationError } = await supabase
        .from("project_translations")
        .upsert({
          project_id: id,
          locale,
          title: body.translations[locale]?.title || "",
          description: body.translations[locale]?.description || "",
        });

      if (translationError) throw translationError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/projects/[id]
 * 
 * Deletes a project and its translations (CASCADE).
 * Requires authentication.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Get project to delete its image
    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select("image")
      .eq("id", id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    // Delete image from storage if it exists
    if (project?.image) {
      await deleteImageFromStorage(supabase, project.image);
    }

    // Delete project (translations will be deleted via CASCADE)
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * POST /api/admin/projects/upload-image
 * 
 * Uploads an image to Supabase Storage and returns the public URL.
 * Requires authentication.
 * 
 * Request: FormData with "image" file and optional "oldImageUrl" string
 * Response: { url: string }
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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const oldImageUrl = formData.get("oldImageUrl") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 2MB limit." },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const uuid = crypto.randomUUID();
    const extension = file.name.split(".").pop() || "jpg";
    const fileName = `${timestamp}-${uuid}.${extension}`;

    // Delete old image if replacing
    if (oldImageUrl) {
      try {
        // Extract file path from URL
        const urlObj = new URL(oldImageUrl);
        const pathParts = urlObj.pathname.split("/");
        const bucketIndex = pathParts.indexOf("projects");
        
        if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
          const oldFilePath = pathParts.slice(bucketIndex + 1).join("/");
          
          // Delete old image (don't block on error)
          await supabase.storage
            .from("projects")
            .remove([oldFilePath])
            .catch((error) => {
              console.error("Error deleting old image:", error);
            });
        }
      } catch (error) {
        console.error("Error processing old image URL:", error);
        // Continue with upload even if old image deletion fails
      }
    }

    // Upload new image
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("projects")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("projects").getPublicUrl(fileName);

    if (!publicUrl) {
      return NextResponse.json(
        { error: "Failed to get public URL after upload" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

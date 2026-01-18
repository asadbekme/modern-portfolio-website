import { createClient } from "./client";

const BUCKET_NAME = "projects";

/**
 * Generate a unique filename for uploaded images
 */
function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const uuid = crypto.randomUUID();
  const extension = originalName.split(".").pop() || "jpg";
  return `${timestamp}-${uuid}.${extension}`;
}

/**
 * Extract file path from Supabase Storage URL
 * 
 * Example: https://xxx.supabase.co/storage/v1/object/public/projects/image.jpg
 * Returns: image.jpg
 */
export function extractFilePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const bucketIndex = pathParts.indexOf(BUCKET_NAME);
    
    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      // Return path after bucket name
      return pathParts.slice(bucketIndex + 1).join("/");
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Upload image to Supabase Storage
 * 
 * @param file - File object to upload
 * @param oldImageUrl - Optional existing image URL to replace
 * @returns Promise resolving to public URL of uploaded image
 * @throws Error if upload fails
 */
export async function uploadProjectImage(
  file: File,
  oldImageUrl?: string | null
): Promise<string> {
  const supabase = createClient();
  
  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
  }
  
  // Validate file size (2MB max)
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    throw new Error("File size exceeds 2MB limit.");
  }
  
  // Generate unique filename
  const fileName = generateFileName(file.name);
  const filePath = fileName;
  
  // Delete old image if replacing
  if (oldImageUrl) {
    const oldFilePath = extractFilePathFromUrl(oldImageUrl);
    if (oldFilePath) {
      // Don't await - delete in background to not block upload
      supabase.storage
        .from(BUCKET_NAME)
        .remove([oldFilePath])
        .catch((error) => {
          console.error("Error deleting old image:", error);
          // Don't throw - old image deletion failure shouldn't block new upload
        });
    }
  }
  
  // Upload new image
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false, // Don't overwrite - use unique filename
    });
  
  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
  
  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  
  if (!publicUrl) {
    throw new Error("Failed to get public URL after upload");
  }
  
  return publicUrl;
}

/**
 * Delete image from Supabase Storage
 * 
 * @param imageUrl - Public URL of the image to delete
 * @returns Promise that resolves when deletion is complete
 */
export async function deleteProjectImage(imageUrl: string): Promise<void> {
  const supabase = createClient();
  const filePath = extractFilePathFromUrl(imageUrl);
  
  if (!filePath) {
    console.warn("Could not extract file path from URL:", imageUrl);
    return;
  }
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);
  
  if (error) {
    console.error("Error deleting image:", error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

import { supabase } from "@/lib/supabase";

const BUCKET_NAME = "project-images";

export const storageService = {
  async uploadImage(file: File, folder: string = "projects"): Promise<string> {
    if (!file.type.startsWith("image/")) {
      throw new Error("Please upload an image file");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image size should be less than 5MB");
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

    return data.publicUrl;
  },

  async deleteImage(url: string): Promise<void> {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split(`${BUCKET_NAME}/`);
      const filePath = pathParts[1];

      if (!filePath) return;

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  },

  async updateImage(
    oldUrl: string | null,
    newFile: File,
    folder: string = "projects",
  ): Promise<string> {
    const newUrl = await this.uploadImage(newFile, folder);
    if (oldUrl) {
      await this.deleteImage(oldUrl);
    }
    return newUrl;
  },

  isValidImageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.includes(BUCKET_NAME);
    } catch {
      return false;
    }
  },
};

import { supabase } from "@/lib/supabase";

const BUCKET_NAME = "project-images";
const RESUME_BUCKET = "resumes";

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

  // Resume upload functions
  async uploadResume(file: File): Promise<string> {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Please upload a PDF or Word document");
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error("Resume size should be less than 10MB");
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `resume-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(RESUME_BUCKET)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(RESUME_BUCKET)
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  async deleteResume(url: string): Promise<void> {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split(`${RESUME_BUCKET}/`);
      const filePath = pathParts[1];

      if (!filePath) return;

      const { error } = await supabase.storage
        .from(RESUME_BUCKET)
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  },

  async updateResume(oldUrl: string | null, newFile: File): Promise<string> {
    const newUrl = await this.uploadResume(newFile);
    if (oldUrl && oldUrl.includes(RESUME_BUCKET)) {
      await this.deleteResume(oldUrl);
    }
    return newUrl;
  },
};

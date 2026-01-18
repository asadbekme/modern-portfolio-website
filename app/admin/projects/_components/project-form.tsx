"use client";

import { useForm, useFieldArray, type FieldArrayPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import axios from "axios";
import { useState, useRef, useCallback } from "react";
import { Plus, X, XCircle } from "lucide-react";
import Image from "next/image";

const projectSchema = z.object({
  image: z
    .string()
    .refine((val) => val === "" || z.string().url().safeParse(val).success, {
      message: "Must be a valid URL",
    }),
  live_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  tech: z.array(z.string()).min(1, "At least one technology is required"),
  is_published: z.boolean(),
  display_order: z.number().min(0),
  translations: z.object({
    en: z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
    }),
    ru: z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
    }),
    uz: z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
    }),
  }),
});

type ProjectFormData = z.infer<typeof projectSchema>;

type Project = {
  id: string;
  image: string;
  live_url: string | null;
  github_url: string | null;
  tech: string[];
  is_published: boolean;
  display_order: number;
  translations: {
    en: { title: string; description: string };
    ru: { title: string; description: string };
    uz: { title: string; description: string };
  };
};

interface ProjectFormProps {
  project?: Project | null;
  onSuccess: () => void;
}

/**
 * Project Form Component
 * 
 * WHY: Reusable form component for creating and editing projects.
 * Uses React Hook Form + Zod for validation and handles all three
 * language translations in a single form.
 */
export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(
    project?.image || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
        image: project.image || "",
        live_url: project.live_url || "",
        github_url: project.github_url || "",
        tech: project.tech,
        is_published: project.is_published,
        display_order: project.display_order,
        translations: project.translations,
      }
      : {
        image: "",
        live_url: "",
        github_url: "",
        tech: [""],
        is_published: false,
        display_order: 0,
        translations: {
          en: { title: "", description: "" },
          ru: { title: "", description: "" },
          uz: { title: "", description: "" },
        },
      },
  });

  const currentImageUrl = watch("image");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tech" as FieldArrayPath<ProjectFormData>,
  });

  // Handle file selection
  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
        return;
      }

      // Validate file size (2MB max)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        toast.error("File size exceeds 2MB limit.");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload image immediately
      setIsUploading(true);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        formData.append("image", file);

        // Include old image URL if updating
        if (project?.image) {
          formData.append("oldImageUrl", project.image);
        }

        // Simulate progress (Supabase doesn't provide progress events)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 100);

        const response = await axios.post(
          "/api/admin/projects/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        clearInterval(progressInterval);
        setUploadProgress(100);

        const imageUrl = response.data.url;
        setValue("image", imageUrl);
        setImagePreview(imageUrl);
        toast.success("Image uploaded successfully");
      } catch (error: any) {
        toast.error(
          error.response?.data?.error || "Failed to upload image"
        );
        setImagePreview(project?.image || null);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [project?.image, setValue]
  );

  // Handle image removal
  const handleRemoveImage = useCallback(() => {
    setImagePreview(null);
    setSelectedFile(null);
    setValue("image", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [setValue]);

  const onSubmit = async (data: ProjectFormData) => {
    // Validate image is required
    if (!data.image || data.image.trim() === "") {
      toast.error("Please upload an image for the project");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...data,
        live_url: data.live_url || null,
        github_url: data.github_url || null,
        tech: data.tech.filter((t) => t.trim() !== ""),
      };

      if (project) {
        await axios.put(`/api/admin/projects/${project.id}`, payload);
        toast.success("Project updated successfully");
      } else {
        await axios.post("/api/admin/projects", payload);
        toast.success("Project created successfully");
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to save project");
    } finally {
      setIsLoading(false);
    }
  };

  const locales = [
    { key: "en", label: "English" },
    { key: "ru", label: "Russian" },
    { key: "uz", label: "Uzbek" },
  ] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label htmlFor="image">Project Image</Label>

          {/* File Input */}
          <div className="space-y-2">
            <Input
              id="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              ref={fileInputRef}
              onChange={handleFileSelect}
              disabled={isUploading || isLoading}
              className="cursor-pointer"
            />

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-1">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-gray-500">Uploading... {uploadProgress}%</p>
              </div>
            )}

            {/* Error Message */}
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image.message}</p>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <Image
                  src={imagePreview}
                  alt="Project preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                  disabled={isUploading || isLoading}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Help Text */}
            {!imagePreview && (
              <p className="text-xs text-gray-500">
                Supported formats: JPEG, PNG, WebP. Max size: 2MB
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="live_url">Live URL (Optional)</Label>
            <Input id="live_url" {...register("live_url")} />
            {errors.live_url && (
              <p className="text-sm text-red-500">{errors.live_url.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL (Optional)</Label>
            <Input id="github_url" {...register("github_url")} />
            {errors.github_url && (
              <p className="text-sm text-red-500">{errors.github_url.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Technologies</Label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input {...register(`tech.${index}` as const)} />
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append("")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Technology
          </Button>
          {errors.tech && (
            <p className="text-sm text-red-500">{errors.tech.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              {...register("display_order", { valueAsNumber: true })}
            />
            {errors.display_order && (
              <p className="text-sm text-red-500">
                {errors.display_order.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <Switch id="is_published" {...register("is_published")} />
            <Label htmlFor="is_published">Published</Label>
          </div>
        </div>
      </div>

      {/* Translations */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Translations</h3>
        {locales.map((locale) => (
          <div key={locale.key} className="space-y-4 border p-4 rounded-lg">
            <h4 className="font-medium">{locale.label}</h4>
            <div className="space-y-2">
              <Label htmlFor={`translations.${locale.key}.title`}>Title</Label>
              <Input
                id={`translations.${locale.key}.title`}
                {...register(`translations.${locale.key}.title`)}
              />
              {errors.translations?.[locale.key]?.title && (
                <p className="text-sm text-red-500">
                  {errors.translations[locale.key]?.title?.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`translations.${locale.key}.description`}>
                Description
              </Label>
              <Textarea
                id={`translations.${locale.key}.description`}
                {...register(`translations.${locale.key}.description`)}
                rows={3}
              />
              {errors.translations?.[locale.key]?.description && (
                <p className="text-sm text-red-500">
                  {errors.translations[locale.key]?.description?.message}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading || isUploading}>
          {isLoading
            ? "Saving..."
            : isUploading
              ? "Uploading..."
              : project
                ? "Update Project"
                : "Create Project"}
        </Button>
      </div>
    </form>
  );
}

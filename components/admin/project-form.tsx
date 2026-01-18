"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectSchema, ProjectFormData } from "@/schemas/project.schema";
import { projectService } from "@/services/project-service";
import { storageService } from "@/services/storage-service";
import { Project } from "@/types/project";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { X, Loader2 } from "lucide-react";

interface ProjectFormProps {
  project?: Project;
  onSuccess?: () => void;
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const queryClient = useQueryClient();
  const [techInput, setTechInput] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
          title_en: project.title_en,
          title_ru: project.title_ru,
          title_uz: project.title_uz,
          description_en: project.description_en,
          description_ru: project.description_ru,
          description_uz: project.description_uz,
          image: project.image,
          tech: project.tech,
          live_url: project.live_url,
          github_url: project.github_url,
          order_index: project.order_index,
          is_published: project.is_published,
        }
      : {
          title_en: "",
          title_ru: "",
          title_uz: "",
          description_en: "",
          description_ru: "",
          description_uz: "",
          image: "",
          tech: [],
          live_url: "",
          github_url: "",
          order_index: 0,
          is_published: true,
        },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      let imageUrl = data.image;
      if (imageFile) {
        setIsUploadingImage(true);
        imageUrl = await storageService.uploadImage(imageFile, "projects");
        setIsUploadingImage(false);
      }
      return projectService.createProject({ ...data, image: imageUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully!");
      form.reset();
      setImageFile(null);
      onSuccess?.();
    },
    onError: (error: Error) => {
      setIsUploadingImage(false);
      toast.error(`Failed to create project: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      if (!project) throw new Error("No project to update");
      let imageUrl = data.image;
      if (imageFile) {
        setIsUploadingImage(true);
        imageUrl = await storageService.updateImage(
          project.image,
          imageFile,
          "projects",
        );
        setIsUploadingImage(false);
      }
      return projectService.updateProject({
        id: project.id,
        ...data,
        image: imageUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully!");
      setImageFile(null);
      onSuccess?.();
    },
    onError: (error: Error) => {
      setIsUploadingImage(false);
      toast.error(`Failed to update project: ${error.message}`);
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    if (project) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleImageChange = (file: File | string) => {
    if (file instanceof File) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      form.setValue("image", previewUrl);
    } else {
      form.setValue("image", file);
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    form.setValue("image", "");
  };

  const addTech = () => {
    if (techInput.trim()) {
      const currentTech = form.getValues("tech");
      if (!currentTech.includes(techInput.trim())) {
        form.setValue("tech", [...currentTech, techInput.trim()]);
        setTechInput("");
      }
    }
  };

  const removeTech = (tech: string) => {
    const currentTech = form.getValues("tech");
    form.setValue(
      "tech",
      currentTech.filter((t) => t !== tech),
    );
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || isUploadingImage;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={handleImageChange}
                  onRemove={handleImageRemove}
                  disabled={isLoading}
                  aspectRatio={16 / 9}
                />
              </FormControl>
              <FormDescription>
                Upload project screenshot or cover image
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* English Fields */}
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-lg font-semibold">English</h3>
          <FormField
            control={form.control}
            name="title_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Project title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Project description"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Russian Fields */}
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-lg font-semibold">Русский</h3>
          <FormField
            control={form.control}
            name="title_ru"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название</FormLabel>
                <FormControl>
                  <Input placeholder="Название проекта" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description_ru"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Описание</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Описание проекта"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Uzbek Fields */}
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-lg font-semibold">O'zbekcha</h3>
          <FormField
            control={form.control}
            name="title_uz"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sarlavha</FormLabel>
                <FormControl>
                  <Input placeholder="Loyiha sarlavhasi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description_uz"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tavsif</FormLabel>
                <FormControl>
                  <Textarea placeholder="Loyiha tavsifi" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Technical Fields */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="tech"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technologies</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add technology"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTech())
                    }
                  />
                  <Button type="button" onClick={addTech} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTech(tech)}
                        className="hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="live_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="github_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://github.com/user/repo"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="order_index"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Lower numbers appear first</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_published"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Published</FormLabel>
                  <FormDescription>
                    Make this project visible on the website
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploadingImage ? "Uploading image..." : "Saving..."}
              </>
            ) : project ? (
              "Update Project"
            ) : (
              "Create Project"
            )}
          </Button>
          {onSuccess && (
            <Button
              type="button"
              variant="outline"
              onClick={onSuccess}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

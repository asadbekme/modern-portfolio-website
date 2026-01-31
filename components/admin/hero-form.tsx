"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { heroSchema, HeroFormData } from "@/schemas/hero.schema";
import { heroService } from "@/services/hero-service";
import { storageService } from "@/services/storage-service";
import { Hero } from "@/types/hero";
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
import { Loader2, Upload, FileText, X, ExternalLink } from "lucide-react";

interface HeroFormProps {
  hero: Hero;
  onSuccess?: () => void;
}

export function HeroForm({ hero, onSuccess }: HeroFormProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentResumeUrl, setCurrentResumeUrl] = useState(hero.resume_url);

  const form = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      name: hero.name,
      profession_en: hero.profession_en,
      profession_ru: hero.profession_ru,
      profession_uz: hero.profession_uz,
      description_en: hero.description_en,
      description_ru: hero.description_ru,
      description_uz: hero.description_uz,
      view_projects_text_en: hero.view_projects_text_en,
      view_projects_text_ru: hero.view_projects_text_ru,
      view_projects_text_uz: hero.view_projects_text_uz,
      resume_text_en: hero.resume_text_en,
      resume_text_ru: hero.resume_text_ru,
      resume_text_uz: hero.resume_text_uz,
      resume_url: hero.resume_url,
      is_published: hero.is_published,
    },
  });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await storageService.updateResume(currentResumeUrl, file);
      setCurrentResumeUrl(url);
      form.setValue("resume_url", url);
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload resume",
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const updateMutation = useMutation({
    mutationFn: (data: HeroFormData) => {
      return heroService.updateHero({ id: hero.id, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero"] });
      toast.success("Hero section updated successfully!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update hero: ${error.message}`);
    },
  });

  const onSubmit = (data: HeroFormData) => {
    updateMutation.mutate(data);
  };

  const isLoading = updateMutation.isPending;

  const getFileName = (url: string) => {
    try {
      const parts = url.split("/");
      return parts[parts.length - 1];
    } catch {
      return "resume.pdf";
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            Basic Information
          </h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>
                  Your name displayed in the hero section
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* English Content */}
        <div className="space-y-4 border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-muted-foreground">
            🇬🇧 English
          </h3>

          <FormField
            control={form.control}
            name="profession_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profession / Title</FormLabel>
                <FormControl>
                  <Input placeholder="Full Stack Developer" {...field} />
                </FormControl>
                <FormDescription>Animated typing text</FormDescription>
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
                    placeholder="I build modern web applications..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="view_projects_text_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>View Projects Button</FormLabel>
                  <FormControl>
                    <Input placeholder="View My Work" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resume_text_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume Button</FormLabel>
                  <FormControl>
                    <Input placeholder="Download Resume" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Russian Content */}
        <div className="space-y-4 border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-muted-foreground">
            🇷🇺 Русский
          </h3>

          <FormField
            control={form.control}
            name="profession_ru"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Профессия</FormLabel>
                <FormControl>
                  <Input placeholder="Fullstack разработчик" {...field} />
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
                    placeholder="Я создаю современные веб-приложения..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="view_projects_text_ru"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Кнопка проектов</FormLabel>
                  <FormControl>
                    <Input placeholder="Посмотреть работы" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resume_text_ru"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Кнопка резюме</FormLabel>
                  <FormControl>
                    <Input placeholder="Скачать резюме" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Uzbek Content */}
        <div className="space-y-4 border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-muted-foreground">
            🇺🇿 O&apos;zbekcha
          </h3>

          <FormField
            control={form.control}
            name="profession_uz"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kasb</FormLabel>
                <FormControl>
                  <Input placeholder="Fullstack dasturchi" {...field} />
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
                  <Textarea
                    placeholder="Men zamonaviy veb-ilovalar yarataman..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="view_projects_text_uz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loyihalar tugmasi</FormLabel>
                  <FormControl>
                    <Input placeholder="Ishlarimni ko'ring" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resume_text_uz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rezyume tugmasi</FormLabel>
                  <FormControl>
                    <Input placeholder="Rezyumeni yuklab olish" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Resume Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Resume File</h3>

          <FormField
            control={form.control}
            name="resume_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    {/* Current Resume Display */}
                    {currentResumeUrl && (
                      <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {getFileName(currentResumeUrl)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Current resume file
                          </p>
                        </div>
                        <a
                          href={currentResumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-background rounded-md transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    )}

                    {/* Upload Button */}
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex-1"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            {currentResumeUrl
                              ? "Replace Resume"
                              : "Upload Resume"}
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Hidden input for form */}
                    <Input
                      type="hidden"
                      {...field}
                      value={currentResumeUrl || ""}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Upload your resume (PDF or Word, max 10MB). The file will be
                  stored in Supabase Storage.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Publish Status */}
        <FormField
          control={form.control}
          name="is_published"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Published</FormLabel>
                <FormDescription>
                  Show the hero section on the website
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

        <Button
          type="submit"
          disabled={isLoading || isUploading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Update Hero Section"
          )}
        </Button>
      </form>
    </Form>
  );
}

"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aboutSchema, AboutFormData } from "@/schemas/about.schema";
import { aboutService } from "@/services/about-service";
import { storageService } from "@/services/storage-service";
import { About } from "@/types/about";
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
import { Loader2, Upload, ImageIcon, X } from "lucide-react";
import Image from "next/image";

interface AboutFormProps {
  about: About;
  onSuccess?: () => void;
}

export function AboutForm({ about, onSuccess }: AboutFormProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(about.image_url);

  const form = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      title_en: about.title_en,
      title_ru: about.title_ru,
      title_uz: about.title_uz,
      description_en: about.description_en,
      description_ru: about.description_ru,
      description_uz: about.description_uz,
      location_en: about.location_en,
      location_ru: about.location_ru,
      location_uz: about.location_uz,
      availability_en: about.availability_en,
      availability_ru: about.availability_ru,
      availability_uz: about.availability_uz,
      education_en: about.education_en,
      education_ru: about.education_ru,
      education_uz: about.education_uz,
      what_i_do_en: about.what_i_do_en,
      what_i_do_ru: about.what_i_do_ru,
      what_i_do_uz: about.what_i_do_uz,
      service_1_en: about.service_1_en,
      service_1_ru: about.service_1_ru,
      service_1_uz: about.service_1_uz,
      service_2_en: about.service_2_en,
      service_2_ru: about.service_2_ru,
      service_2_uz: about.service_2_uz,
      service_3_en: about.service_3_en,
      service_3_ru: about.service_3_ru,
      service_3_uz: about.service_3_uz,
      service_4_en: about.service_4_en,
      service_4_ru: about.service_4_ru,
      service_4_uz: about.service_4_uz,
      image_url: about.image_url,
      is_published: about.is_published,
    },
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await storageService.updateImage(
        currentImageUrl,
        file,
        "about",
      );
      setCurrentImageUrl(url);
      form.setValue("image_url", url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image",
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async () => {
    if (currentImageUrl) {
      await storageService.deleteImage(currentImageUrl);
      setCurrentImageUrl(null);
      form.setValue("image_url", null);
      toast.success("Image removed successfully!");
    }
  };

  const updateMutation = useMutation({
    mutationFn: (data: AboutFormData) => {
      return aboutService.updateAbout({ id: about.id, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
      toast.success("About section updated successfully!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update about: ${error.message}`);
    },
  });

  const onSubmit = (data: AboutFormData) => {
    updateMutation.mutate(data);
  };

  const isLoading = updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Profile Image */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Profile Image</h3>

          <FormField
            control={form.control}
            name="image_url"
            render={() => (
              <FormItem>
                <FormLabel>Photo</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    {currentImageUrl ? (
                      <div className="relative w-40 h-40 mx-auto">
                        <Image
                          src={currentImageUrl}
                          alt="Profile"
                          fill
                          className="rounded-full object-cover border-4 border-blue-500/20"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-40 h-40 mx-auto rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          {currentImageUrl ? "Change Image" : "Upload Image"}
                        </>
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  Upload your profile photo (max 5MB)
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
            name="title_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Title</FormLabel>
                <FormControl>
                  <Input placeholder="About Me" {...field} />
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
                    rows={4}
                    placeholder="I'm a passionate developer..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="location_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>📍 Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Tashkent, Uzbekistan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>💼 Availability</FormLabel>
                  <FormControl>
                    <Input placeholder="Available for work" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="education_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>🎓 Education</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Computer Science, University"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="what_i_do_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What I Do Title</FormLabel>
                <FormControl>
                  <Input placeholder="What I Do" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="service_1_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Web Development" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service_2_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service 2</FormLabel>
                  <FormControl>
                    <Input placeholder="UI/UX Design" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service_3_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service 3</FormLabel>
                  <FormControl>
                    <Input placeholder="Mobile Apps" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service_4_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service 4</FormLabel>
                  <FormControl>
                    <Input placeholder="Performance Optimization" {...field} />
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
            name="title_ru"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Заголовок секции</FormLabel>
                <FormControl>
                  <Input placeholder="Обо мне" {...field} />
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
                    rows={4}
                    placeholder="Я увлечённый разработчик..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="location_ru"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>📍 Местоположение</FormLabel>
                  <FormControl>
                    <Input placeholder="Ташкент, Узбекистан" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability_ru"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>💼 Доступность</FormLabel>
                  <FormControl>
                    <Input placeholder="Открыт для работы" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="education_ru"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>🎓 Образование</FormLabel>
                  <FormControl>
                    <Input placeholder="Информатика, Университет" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="what_i_do_ru"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Заголовок услуг</FormLabel>
                <FormControl>
                  <Input placeholder="Чем я занимаюсь" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="service_1_ru"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Услуга 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Веб-разработка" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service_2_ru"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Услуга 2</FormLabel>
                  <FormControl>
                    <Input placeholder="UI/UX Дизайн" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service_3_ru"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Услуга 3</FormLabel>
                  <FormControl>
                    <Input placeholder="Мобильные приложения" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service_4_ru"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Услуга 4</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Оптимизация производительности"
                      {...field}
                    />
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
            name="title_uz"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bo&apos;lim sarlavhasi</FormLabel>
                <FormControl>
                  <Input placeholder="Men haqimda" {...field} />
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
                    rows={4}
                    placeholder="Men ishtiyoqli dasturchiman..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="location_uz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>📍 Joylashuv</FormLabel>
                  <FormControl>
                    <Input placeholder="Toshkent, O'zbekiston" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability_uz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>💼 Mavjudlik</FormLabel>
                  <FormControl>
                    <Input placeholder="Ishga tayyor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="education_uz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>🎓 Ta&apos;lim</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kompyuter fanlari, Universitet"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="what_i_do_uz"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Xizmatlar sarlavhasi</FormLabel>
                <FormControl>
                  <Input placeholder="Men nima qilaman" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="service_1_uz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xizmat 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Veb dasturlash" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service_2_uz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xizmat 2</FormLabel>
                  <FormControl>
                    <Input placeholder="UI/UX Dizayn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service_3_uz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xizmat 3</FormLabel>
                  <FormControl>
                    <Input placeholder="Mobil ilovalar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service_4_uz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xizmat 4</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Samaradorlikni optimallashtirish"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                  Show the about section on the website
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
            "Update About Section"
          )}
        </Button>
      </form>
    </Form>
  );
}

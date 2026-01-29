"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { statSchema, StatFormData } from "@/schemas/stat.schema";
import { statService } from "@/services/stat-service";
import { Stat } from "@/types/stat";
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
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface StatFormProps {
  stat?: Stat;
  onSuccess?: () => void;
}

export function StatForm({ stat, onSuccess }: StatFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<StatFormData>({
    resolver: zodResolver(statSchema),
    defaultValues: stat
      ? {
          number: stat.number,
          label_en: stat.label_en,
          label_ru: stat.label_ru,
          label_uz: stat.label_uz,
          order_index: stat.order_index,
          is_published: stat.is_published,
        }
      : {
          number: "",
          label_en: "",
          label_ru: "",
          label_uz: "",
          order_index: 0,
          is_published: true,
        },
  });

  const createMutation = useMutation({
    mutationFn: (data: StatFormData) => statService.createStat(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Stat created successfully!");
      form.reset();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create stat: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: StatFormData) => {
      if (!stat) throw new Error("No stat to update");
      return statService.updateStat({ id: stat.id, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Stat updated successfully!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update stat: ${error.message}`);
    },
  });

  const onSubmit = (data: StatFormData) => {
    if (stat) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number/Value</FormLabel>
              <FormControl>
                <Input placeholder="2+" {...field} />
              </FormControl>
              <FormDescription>
                The statistic value (e.g., &quot;2+&quot;, &quot;100%&quot;,
                &quot;50+&quot;)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* English Label */}
        <div className="space-y-4 border-b pb-4">
          <h3 className="text-sm font-semibold text-muted-foreground">
            English
          </h3>
          <FormField
            control={form.control}
            name="label_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input placeholder="Years of Experience" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Russian Label */}
        <div className="space-y-4 border-b pb-4">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Русский
          </h3>
          <FormField
            control={form.control}
            name="label_ru"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Метка</FormLabel>
                <FormControl>
                  <Input placeholder="Лет опыта" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Uzbek Label */}
        <div className="space-y-4 border-b pb-4">
          <h3 className="text-sm font-semibold text-muted-foreground">
            O&apos;zbekcha
          </h3>
          <FormField
            control={form.control}
            name="label_uz"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Yorliq</FormLabel>
                <FormControl>
                  <Input placeholder="Yillik tajriba" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                <FormDescription>Show this stat on the website</FormDescription>
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

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : stat ? (
              "Update Stat"
            ) : (
              "Create Stat"
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

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { skillSchema, SkillFormData } from "@/schemas/skill.schema";
import { skillService } from "@/services/skill-service";
import { Skill } from "@/types/skill";
import { iconMap, availableIcons } from "@/lib/icon-map";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface SkillFormProps {
  skill?: Skill;
  onSuccess?: () => void;
}

export function SkillForm({ skill, onSuccess }: SkillFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: skill
      ? {
          name: skill.name,
          icon_key: skill.icon_key,
          color_from: skill.color_from,
          color_to: skill.color_to,
          order_index: skill.order_index,
          is_published: skill.is_published,
        }
      : {
          name: "",
          icon_key: "",
          color_from: "#3B82F6",
          color_to: "#8B5CF6",
          order_index: 0,
          is_published: true,
        },
  });

  const createMutation = useMutation({
    mutationFn: (data: SkillFormData) => skillService.createSkill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill created successfully!");
      form.reset();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create skill: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: SkillFormData) => {
      if (!skill) throw new Error("No skill to update");
      return skillService.updateSkill({ id: skill.id, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill updated successfully!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update skill: ${error.message}`);
    },
  });

  const onSubmit = (data: SkillFormData) => {
    if (skill) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const selectedIconKey = form.watch("icon_key");
  const SelectedIcon = selectedIconKey ? iconMap[selectedIconKey] : null;
  const watchColorFrom = form.watch("color_from");
  const watchColorTo = form.watch("color_to");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill Name</FormLabel>
              <FormControl>
                <Input placeholder="React" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <div className="flex items-center gap-3">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableIcons.map((key) => {
                      const Icon = iconMap[key];
                      return (
                        <SelectItem key={key} value={key}>
                          <span className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {key.replace("Si", "")}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {SelectedIcon && (
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-full text-white"
                    style={{
                      background: `linear-gradient(to right, ${watchColorFrom}, ${watchColorTo})`,
                    }}
                  >
                    <SelectedIcon className="h-5 w-5" />
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="color_from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gradient Start</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={field.value}
                      onChange={field.onChange}
                      className="h-10 w-10 rounded cursor-pointer border-0"
                    />
                    <Input {...field} placeholder="#3B82F6" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gradient End</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={field.value}
                      onChange={field.onChange}
                      className="h-10 w-10 rounded cursor-pointer border-0"
                    />
                    <Input {...field} placeholder="#8B5CF6" />
                  </div>
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
                <FormDescription>
                  Show this skill on the website
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

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : skill ? (
              "Update Skill"
            ) : (
              "Create Skill"
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

import { supabase } from "@/lib/supabase";
import { About, UpdateAboutDTO } from "@/types/about";

export const aboutService = {
  async getAbout(): Promise<About | null> {
    const { data, error } = await supabase.from("about").select("*").single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }
    return data;
  },

  async getPublishedAbout(): Promise<About | null> {
    const { data, error } = await supabase
      .from("about")
      .select("*")
      .eq("is_published", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }
    return data;
  },

  async updateAbout({ id, ...updates }: UpdateAboutDTO): Promise<About> {
    const { data, error } = await supabase
      .from("about")
      .update(updates as never)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async togglePublish(id: string, isPublished: boolean): Promise<About> {
    const { data, error } = await supabase
      .from("about")
      .update({ is_published: isPublished } as never)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

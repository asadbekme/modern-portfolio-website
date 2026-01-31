import { supabase } from "@/lib/supabase";
import { Hero, UpdateHeroDTO } from "@/types/hero";

export const heroService = {
  async getHero(): Promise<Hero | null> {
    const { data, error } = await supabase.from("hero").select("*").single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found
        return null;
      }
      throw error;
    }
    return data;
  },

  async getPublishedHero(): Promise<Hero | null> {
    const { data, error } = await supabase
      .from("hero")
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

  async updateHero({ id, ...updates }: UpdateHeroDTO): Promise<Hero> {
    const { data, error } = await supabase
      .from("hero")
      .update(updates as never)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async togglePublish(id: string, isPublished: boolean): Promise<Hero> {
    const { data, error } = await supabase
      .from("hero")
      .update({ is_published: isPublished } as never)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

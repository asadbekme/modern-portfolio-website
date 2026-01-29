import { supabase } from "@/lib/supabase";
import { Stat, CreateStatDTO, UpdateStatDTO } from "@/types/stat";

export const statService = {
  async getPublishedStats(): Promise<Stat[]> {
    const { data, error } = await supabase
      .from("stats")
      .select("*")
      .eq("is_published", true)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getAllStats(): Promise<Stat[]> {
    const { data, error } = await supabase
      .from("stats")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getStat(id: string): Promise<Stat> {
    const { data, error } = await supabase
      .from("stats")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async createStat(stat: CreateStatDTO): Promise<Stat> {
    const { data, error } = await supabase
      .from("stats")
      .insert([stat] as never)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStat({ id, ...updates }: UpdateStatDTO): Promise<Stat> {
    const { data, error } = await supabase
      .from("stats")
      .update(updates as never)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteStat(id: string): Promise<void> {
    const { error } = await supabase.from("stats").delete().eq("id", id);

    if (error) throw error;
  },

  async togglePublish(id: string, isPublished: boolean): Promise<Stat> {
    const { data, error } = await supabase
      .from("stats")
      .update({ is_published: isPublished } as never)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

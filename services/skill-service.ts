import { supabase } from "@/lib/supabase";
import { Skill, CreateSkillDTO, UpdateSkillDTO } from "@/types/skill";

export const skillService = {
  async getPublishedSkills(): Promise<Skill[]> {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("is_published", true)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getAllSkills(): Promise<Skill[]> {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getSkill(id: string): Promise<Skill> {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async createSkill(skill: CreateSkillDTO): Promise<Skill> {
    const { data, error } = await supabase
      .from("skills")
      .insert([skill] as never)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSkill({ id, ...updates }: UpdateSkillDTO): Promise<Skill> {
    const { data, error } = await supabase
      .from("skills")
      .update(updates as never)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteSkill(id: string): Promise<void> {
    const { error } = await supabase.from("skills").delete().eq("id", id);

    if (error) throw error;
  },

  async togglePublish(id: string, isPublished: boolean): Promise<Skill> {
    const { data, error } = await supabase
      .from("skills")
      .update({ is_published: isPublished } as never)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

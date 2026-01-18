import { supabase } from "@/lib/supabase";
import { Project, CreateProjectDTO, UpdateProjectDTO } from "@/types/project";

export const projectService = {
  async getPublishedProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getAllProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getProject(id: string): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async createProject(project: CreateProjectDTO): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .insert([project] as never)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProject({ id, ...updates }: UpdateProjectDTO): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .update(updates as never)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) throw error;
  },

  async togglePublish(id: string, isPublished: boolean): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .update({ is_published: isPublished } as never)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

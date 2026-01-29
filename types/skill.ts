export interface Skill {
  id: string;
  name: string;
  icon_key: string;
  color_from: string;
  color_to: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSkillDTO {
  name: string;
  icon_key: string;
  color_from: string;
  color_to: string;
  order_index?: number;
  is_published?: boolean;
}

export interface UpdateSkillDTO extends Partial<CreateSkillDTO> {
  id: string;
}

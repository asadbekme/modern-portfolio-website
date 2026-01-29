export interface Stat {
  id: string;
  number: string;
  label_en: string;
  label_ru: string;
  label_uz: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateStatDTO {
  number: string;
  label_en: string;
  label_ru: string;
  label_uz: string;
  order_index?: number;
  is_published?: boolean;
}

export interface UpdateStatDTO extends Partial<CreateStatDTO> {
  id: string;
}

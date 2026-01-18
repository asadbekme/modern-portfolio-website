export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title_en: string;
          title_ru: string;
          title_uz: string;
          description_en: string;
          description_ru: string;
          description_uz: string;
          image: string;
          tech: string[];
          live_url: string;
          github_url: string;
          order_index: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["projects"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          role: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["admin_users"]["Row"],
          "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Insert"]>;
      };
    };
  };
}

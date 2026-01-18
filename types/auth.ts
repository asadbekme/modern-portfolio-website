import { User } from "@supabase/supabase-js";

export interface AuthUser extends User {
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

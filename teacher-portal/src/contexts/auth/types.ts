
import { Session, User } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "teacher" | "student";
  created_at: string;
  updated_at: string;
  birthdate: string | null;
  tup_id: string | null;
};

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (identifier: string, password: string, birthdate?: Date) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, role: "teacher" | "student", tupId: string, birthdate?: Date) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  validateTupId: (id: string) => boolean;
  validateTupEmail: (email: string) => boolean;
}


import { Json } from "@/integrations/supabase/types";

export interface Submission {
  id: string;
  student_id: string;
  assessment_id: string;
  content: string;
  submitted_at: string;
  status: "pending" | "submitted" | "graded";
  grade: string;
  score: number;
  feedback: Json;
  remarks: string;
  memory_usage: number;
  execution_time: number;
  assessment_results: Json;
  graded_at: string;
}

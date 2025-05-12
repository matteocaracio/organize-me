
// This is a temporary development type file that mirrors the structure in src/integrations/supabase/types.ts
// It's needed because we can't modify the read-only types.ts file directly

export interface NoteRow {
  id: string;
  title: string;
  content: string | null;
  is_pinned: boolean | null;
  is_protected: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  deleted: string | null;
  user_id: string;
}

export interface TaskRow {
  id: string;
  title: string;
  notes: string | null;
  priority: string | null;
  is_completed: boolean | null;
  due_date: string | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string;
}

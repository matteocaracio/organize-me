
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

export interface FlashcardDeckRow {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface FlashcardRow {
  id: string;
  question: string;
  answer: string;
  level: number | null;
  next_review: string | null;
  deck_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProfileRow {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  note_password: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Add mock database type with the profiles table
export type Database = {
  public: {
    Tables: {
      notes: {
        Row: NoteRow;
      };
      tasks: {
        Row: TaskRow;
      };
      flashcard_decks: {
        Row: FlashcardDeckRow;
      };
      flashcards: {
        Row: FlashcardRow;
      };
      profiles: {
        Row: ProfileRow;
      };
    };
  };
};

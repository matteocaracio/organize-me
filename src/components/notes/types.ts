
export interface Note {
  id: string;
  title: string;
  content: string;
  date: Date; // This will be created from updated_at
  isPinned: boolean; // This will be mapped from is_pinned
  isProtected: boolean; // This will be mapped from is_protected
  deletedAt?: Date; // This will be mapped from deleted
}

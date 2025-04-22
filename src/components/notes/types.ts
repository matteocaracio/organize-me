
export interface Note {
  id: string;
  title: string;
  content: string;
  date: Date;
  isPinned: boolean;
  isProtected: boolean;
  deletedAt?: Date;
}

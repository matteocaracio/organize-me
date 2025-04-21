
export type Priority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "completed";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  status: TaskStatus;
  due_date?: Date;
}

export interface NewTaskFormData {
  title: string;
  notes: string;
  priority: Priority;
  due_date?: Date;
}

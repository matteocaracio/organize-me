
import { Priority, Task } from "@/components/tasks/types";
import { compareAsc } from "date-fns";

// Priority order mapping
const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const sortByPriority = (a: Task, b: Task): number => {
  const priorityA = PRIORITY_ORDER[a.priority] || 1;
  const priorityB = PRIORITY_ORDER[b.priority] || 1;
  return priorityA - priorityB;
};

export const sortByDueDate = (a: Task, b: Task): number => {
  if (a.due_date && b.due_date) {
    return compareAsc(a.due_date, b.due_date);
  }
  if (a.due_date) return -1;
  if (b.due_date) return 1;
  return 0;
};


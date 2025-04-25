
import { Task } from "@/components/tasks/types";
import { compareDesc } from "date-fns";

export const useTaskSorting = () => {
  const sortTasksByPriority = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityA = priorityOrder[a.priority] || 1;
      const priorityB = priorityOrder[b.priority] || 1;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      if (a.due_date && b.due_date) {
        return compareDesc(a.due_date, b.due_date);
      } else if (a.due_date) {
        return -1;
      } else if (b.due_date) {
        return 1;
      }
      
      return 0;
    });
  };

  return { sortTasksByPriority };
};

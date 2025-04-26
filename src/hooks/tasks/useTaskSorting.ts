
import { Task } from "@/components/tasks/types";
import { sortByPriority, sortByDueDate } from "@/utils/sortingUtils";

export const useTaskSorting = () => {
  const sortTasksByPriorityAndDueDate = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      // First sort by priority
      const priorityComparison = sortByPriority(a, b);
      if (priorityComparison !== 0) {
        return priorityComparison;
      }
      
      // If priority is equal, sort by due date
      return sortByDueDate(a, b);
    });
  };

  return { sortTasksByPriorityAndDueDate };
};


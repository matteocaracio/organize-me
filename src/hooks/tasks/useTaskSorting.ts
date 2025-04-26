
import { Task } from "@/components/tasks/types";
import { compareAsc } from "date-fns";

export const useTaskSorting = () => {
  const sortTasksByPriorityAndDueDate = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      // Primeiro, ordenar por prioridade
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityA = priorityOrder[a.priority] || 1;
      const priorityB = priorityOrder[b.priority] || 1;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // Se a prioridade for igual, ordenar por data de vencimento
      if (a.due_date && b.due_date) {
        return compareAsc(a.due_date, b.due_date);
      }
      
      // Colocar tarefas sem data no final
      if (a.due_date) return -1;
      if (b.due_date) return 1;
      
      return 0;
    });
  };

  return { sortTasksByPriorityAndDueDate };
};


import { useState } from "react";
import { useTaskOperations } from "./useTaskOperations";
import { useTaskStatusOperations } from "./useTaskStatusOperations";
import { useTaskFetching } from "./useTaskFetching";
import { useTaskSorting } from "./useTaskSorting";

export const useTasks = () => {
  const [loading, setLoading] = useState(true);
  const { tasks, setTasks, addTask } = useTaskOperations();
  const { completeTask, deleteTask } = useTaskStatusOperations(tasks, setTasks);
  const { sortTasksByPriorityAndDueDate } = useTaskSorting();

  useTaskFetching(setTasks, setLoading, deleteTask);

  const pendingTasks = sortTasksByPriorityAndDueDate(tasks.filter((task) => task.status === "pending"));
  const completedTasks = tasks.filter((task) => task.status === "completed");

  return {
    tasks,
    loading,
    pendingTasks,
    completedTasks,
    addTask,
    completeTask,
    deleteTask,
    sortTasksByPriorityAndDueDate
  };
};

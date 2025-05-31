
import { useState } from "react";
import { useTaskOperations } from "./useTaskOperations";
import { useTaskStatusOperations } from "./useTaskStatusOperations";
import { useTaskFetching } from "./useTaskFetching";
import { useTaskSorting } from "./useTaskSorting";

export const useTasks = (
  setRefreshTask:React.Dispatch<React.SetStateAction<number>>,
  refreshTask:number,
) => {
  const [loading, setLoading] = useState(true);
  const { tasks, setTasks, addTask } = useTaskOperations(setRefreshTask);
  const { completeTask, deleteTask } = useTaskStatusOperations(tasks, setTasks, setRefreshTask);
  const { sortTasksByPriorityAndDueDate } = useTaskSorting();

  useTaskFetching(setTasks, setLoading, deleteTask, refreshTask);

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

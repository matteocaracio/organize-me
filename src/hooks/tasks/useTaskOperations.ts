
import { useTaskStore } from "./useTaskStore";
import { useAddTask } from "./useAddTask";

export const useTaskOperations = () => {
  const { tasks, setTasks } = useTaskStore();
  const { addTask } = useAddTask(tasks, setTasks);

  return {
    tasks,
    setTasks,
    addTask
  };
};


import { useTaskStore } from "./useTaskStore";
import { useAddTask } from "./useAddTask";

export const useTaskOperations = (
  setRefreshTask:React.Dispatch<React.SetStateAction<number>>,
) => {
  const { tasks, setTasks } = useTaskStore();
  const { addTask } = useAddTask(tasks, setTasks, setRefreshTask);

  return {
    tasks,
    setTasks,
    addTask
  };
};


import { useState } from "react";
import { Task } from "@/components/tasks/types";

export const useTaskStore = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  return {
    tasks,
    setTasks
  };
};

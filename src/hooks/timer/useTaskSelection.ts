
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/components/tasks/types";

export const useTaskSelection = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return;

        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.user.id)
          .eq('is_completed', false)
          .order('priority', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedTasks: Task[] = data.map(task => ({
            id: task.id,
            title: task.title,
            notes: task.notes || "",
            priority: (task.priority || "medium") as any,
            status: "pending",
            due_date: task.due_date ? new Date(task.due_date) : undefined
          }));
          setTasks(formattedTasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  return {
    tasks,
    selectedTask,
    setSelectedTask
  };
};

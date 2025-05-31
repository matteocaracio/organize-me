
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Task, Priority } from "@/components/tasks/types";
import { subHours, isAfter } from "date-fns";

export const useTaskFetching = (
  setTasks: (tasks: Task[]) => void,
  setLoading: (loading: boolean) => void,
  deleteTask: (id: string, silent: boolean) => Promise<void>,
  refreshTask:number,
) => {
  const { toast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      console.log("tasks fetch")
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return;

        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedTasks: Task[] = data.map(task => ({
            id: task.id,
            title: task.title,
            notes: task.notes || "",
            priority: (task.priority || "medium") as Priority,
            status: task.is_completed ? "completed" : "pending",
            due_date: task.due_date ? new Date(task.due_date) : undefined
          }));
          
          const oneDayAgo = subHours(new Date(), 24);
          const tasksToClean = formattedTasks.filter(task => 
            task.status === "completed" && 
            task.due_date && 
            isAfter(oneDayAgo, task.due_date)
          );
          
          if (tasksToClean.length > 0) {
            tasksToClean.forEach(async (task) => {
              await deleteTask(task.id, true);
            });
            
            const cleanedTasks = formattedTasks.filter(task => 
              !(task.status === "completed" && 
                task.due_date && 
                isAfter(oneDayAgo, task.due_date))
            );
            
            setTasks(cleanedTasks);
          } else {
            setTasks(formattedTasks);
          }
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar as tarefas."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [refreshTask]);
};

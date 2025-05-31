
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/components/tasks/types";

export const useTaskStatusOperations = (
  tasks: Task[], 
  setTasks: (tasks: Task[]) => void,
  setRefreshTask:React.Dispatch<React.SetStateAction<number>>,
) => {
  const { toast } = useToast();

  const completeTask = async (id: string) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;

      const { error } = await supabase
        .from('tasks')
        .update({ 
          is_completed: taskToUpdate.status === "pending",
          due_date: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setTasks(tasks.map((task) =>
        task.id === id 
          ? { 
              ...task, 
              status: task.status === "pending" ? "completed" : "pending",
              due_date: new Date()
            } 
          : task
      ));
      
      toast({
        title: "Sucesso",
        description: "Status da tarefa atualizado!"
      });
      setRefreshTask(prev => prev - 1);
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar a tarefa."
      });
    }
  };

  const deleteTask = async (id: string, silent: boolean = false) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTasks(tasks.filter(task => task.id !== id));
      
      if (!silent) {
        toast({
          title: "Sucesso",
          description: "Tarefa excluída com sucesso!"
        });
      }
      setRefreshTask(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting task:', error);
      if (!silent) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível excluir a tarefa."
        });
      }
    }
  };

  return {
    completeTask,
    deleteTask,
  };
};

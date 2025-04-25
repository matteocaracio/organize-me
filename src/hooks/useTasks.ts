
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Task, NewTaskFormData, Priority } from "@/components/tasks/types";
import { compareDesc, isAfter, subHours } from "date-fns";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Helper function to sort tasks by priority
  const sortTasksByPriority = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityA = priorityOrder[a.priority] || 1;
      const priorityB = priorityOrder[b.priority] || 1;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      if (a.due_date && b.due_date) {
        return compareDesc(a.due_date, b.due_date);
      } else if (a.due_date) {
        return -1;
      } else if (b.due_date) {
        return 1;
      }
      
      return 0;
    });
  };

  useEffect(() => {
    const fetchTasks = async () => {
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
  }, [toast]);

  const addTask = async (newTask: NewTaskFormData) => {
    if (newTask.title.trim() === "") return;

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para adicionar tarefas."
        });
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: newTask.title,
          notes: newTask.notes,
          priority: newTask.priority,
          is_completed: false,
          due_date: newTask.due_date?.toISOString(),
          user_id: user.user.id
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const task: Task = {
          id: data.id,
          title: data.title,
          notes: data.notes || "",
          priority: (data.priority || "medium") as Priority,
          status: "pending",
          due_date: data.due_date ? new Date(data.due_date) : undefined
        };

        // Substituir o setTasks para evitar adicionar tarefas duplicadas
        setTasks(prevTasks => {
          // Verificamos se a tarefa já existe no array
          const existingTaskIndex = prevTasks.findIndex(t => t.id === task.id);
          
          if (existingTaskIndex >= 0) {
            // Se a tarefa já existe, substituímos ela
            const updatedTasks = [...prevTasks];
            updatedTasks[existingTaskIndex] = task;
            return sortTasksByPriority(updatedTasks);
          } else {
            // Se não existe, adicionamos normalmente
            return sortTasksByPriority([task, ...prevTasks]);
          }
        });

        toast({
          title: "Sucesso",
          description: "Tarefa adicionada com sucesso!"
        });
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar a tarefa."
      });
    }
  };

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

      setTasks(
        sortTasksByPriority(tasks.map((task) =>
          task.id === id 
            ? { 
                ...task, 
                status: task.status === "pending" ? "completed" : "pending",
                due_date: new Date()
              } 
            : task
        ))
      );
      
      toast({
        title: "Sucesso",
        description: "Status da tarefa atualizado!"
      });
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

  const pendingTasks = sortTasksByPriority(tasks.filter((task) => task.status === "pending"));
  const completedTasks = tasks.filter((task) => task.status === "completed");

  return {
    tasks,
    loading,
    pendingTasks,
    completedTasks,
    addTask,
    completeTask,
    deleteTask,
    sortTasksByPriority
  };
};

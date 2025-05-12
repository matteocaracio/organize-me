
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Task, NewTaskFormData, Priority } from "@/components/tasks/types";
import { supabase } from "@/integrations/supabase/client";
import { useTaskSorting } from "./useTaskSorting";

export const useAddTask = (tasks: Task[], setTasks: (tasks: Task[]) => void) => {
  const { toast } = useToast();
  const { sortTasksByPriorityAndDueDate } = useTaskSorting();

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

        setTasks(prevTasks => {
          const existingTaskIndex = prevTasks.findIndex(t => t.id === task.id);
          
          if (existingTaskIndex >= 0) {
            const updatedTasks = [...prevTasks];
            updatedTasks[existingTaskIndex] = task;
            return sortTasksByPriorityAndDueDate(updatedTasks);
          } else {
            return sortTasksByPriorityAndDueDate([task, ...prevTasks]);
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

  return { addTask };
};

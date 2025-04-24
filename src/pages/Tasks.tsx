import { useState, useEffect } from "react";
import { Plus, CalendarDays, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Task, NewTaskFormData, Priority } from "@/components/tasks/types";
import NewTaskDialog from "@/components/tasks/NewTaskDialog";
import TaskCard from "@/components/tasks/TaskCard";
import TaskCalendarView from "@/components/tasks/TaskCalendarView";
import EmptyState from "@/components/tasks/EmptyState";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { compareDesc, isAfter, subHours } from "date-fns";

const Tasks = () => {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [newTask, setNewTask] = useState<NewTaskFormData>({
    title: "",
    notes: "",
    priority: "medium" as Priority,
    due_date: undefined,
  });
  const [currentView, setCurrentView] = useState<"list" | "calendar">("list");

  // Helper function para ordenar tarefas por prioridade
  const sortTasksByPriority = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityA = priorityOrder[a.priority] || 1;
      const priorityB = priorityOrder[b.priority] || 1;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB; // Ordena por prioridade primeiro
      }
      
      // Se mesma prioridade, ordena por data (mais recente primeiro)
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

        if (error) {
          throw error;
        }

        if (data) {
          const formattedTasks: Task[] = data.map(task => ({
            id: task.id,
            title: task.title,
            notes: task.notes || "",
            priority: (task.priority || "medium") as Priority,
            status: task.is_completed ? "completed" : "pending",
            due_date: task.due_date ? new Date(task.due_date) : undefined
          }));
          
          // Limpar tarefas concluídas há mais de 24 horas
          const oneDayAgo = subHours(new Date(), 24);
          const tasksToClean = formattedTasks.filter(task => 
            task.status === "completed" && 
            task.due_date && 
            isAfter(oneDayAgo, task.due_date)
          );
          
          if (tasksToClean.length > 0) {
            // Limpar automaticamente as tarefas antigas concluídas
            tasksToClean.forEach(async (task) => {
              await deleteTask(task.id, true);
            });
            
            // Remover as tarefas limpas do array local
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

  const addTask = async () => {
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

      if (error) {
        throw error;
      }

      if (data) {
        const task: Task = {
          id: data.id,
          title: data.title,
          notes: data.notes || "",
          priority: (data.priority || "medium") as Priority,
          status: "pending",
          due_date: data.due_date ? new Date(data.due_date) : undefined
        };

        setTasks(sortTasksByPriority([task, ...tasks]));
        setNewTask({
          title: "",
          notes: "",
          priority: "medium",
          due_date: undefined,
        });
        setOpen(false);
        
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
          due_date: new Date().toISOString() // Atualiza a data para poder calcular 24h depois
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTasks(
        sortTasksByPriority(tasks.map((task) =>
          task.id === id 
            ? { 
                ...task, 
                status: task.status === "pending" ? "completed" : "pending",
                due_date: new Date() // Atualiza a data local também
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

      if (error) {
        throw error;
      }

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

  // Organizar tarefas por prioridade
  const pendingTasks = sortTasksByPriority(tasks.filter((task) => task.status === "pending"));
  const completedTasks = tasks.filter((task) => task.status === "completed");

  const handleNewTaskChange = (task: NewTaskFormData) => {
    setNewTask(task);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tarefas</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentView(currentView === "list" ? "calendar" : "list")}
          >
            {currentView === "list" ? (
              <><CalendarDays className="h-4 w-4 mr-1" /> Calendário</>
            ) : (
              <><LayoutList className="h-4 w-4 mr-1" /> Lista</>
            )}
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Nova Tarefa
          </Button>
        </div>
      </div>

      <NewTaskDialog
        open={open}
        onOpenChange={setOpen}
        newTask={newTask}
        onNewTaskChange={handleNewTaskChange}
        onAddTask={addTask}
      />

      {loading ? (
        <div className="text-center py-8">Carregando tarefas...</div>
      ) : currentView === "calendar" ? (
        <TaskCalendarView
          tasks={sortTasksByPriority([...pendingTasks, ...completedTasks])}
          onComplete={completeTask}
          onDelete={deleteTask}
        />
      ) : (
        <Tabs defaultValue="pendentes">
          <TabsList className="w-full">
            <TabsTrigger value="pendentes" className="flex-1">
              Pendentes ({pendingTasks.length})
            </TabsTrigger>
            <TabsTrigger value="concluidas" className="flex-1">
              Concluídas ({completedTasks.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pendentes" className="space-y-4 mt-4">
            {pendingTasks.length === 0 ? (
              <EmptyState type="pending" />
            ) : (
              pendingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={completeTask}
                  onDelete={deleteTask}
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="concluidas" className="space-y-4 mt-4">
            <div className="text-sm text-muted-foreground mb-2">
              Tarefas concluídas são automaticamente excluídas após 24 horas.
            </div>
            {completedTasks.length === 0 ? (
              <EmptyState type="completed" />
            ) : (
              completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={completeTask}
                  onDelete={deleteTask}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Tasks;

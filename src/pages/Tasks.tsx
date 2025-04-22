
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Task, NewTaskFormData, Priority } from "@/components/tasks/types";
import NewTaskDialog from "@/components/tasks/NewTaskDialog";
import TaskCard from "@/components/tasks/TaskCard";
import EmptyState from "@/components/tasks/EmptyState";

const Tasks = () => {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<NewTaskFormData>({
    title: "",
    notes: "",
    priority: "medium" as Priority,
    due_date: undefined,
  });

  const addTask = () => {
    if (newTask.title.trim() === "") return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      notes: newTask.notes,
      priority: newTask.priority,
      status: "pending",
      due_date: newTask.due_date,
    };

    setTasks([task, ...tasks]);
    setNewTask({
      title: "",
      notes: "",
      priority: "medium",
      due_date: undefined,
    });
    setOpen(false);
  };

  const completeTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: "completed" } : task
      )
    );
  };

  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  const handleNewTaskChange = (task: NewTaskFormData) => {
    setNewTask(task);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tarefas</h1>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Nova Tarefa
        </Button>
      </div>

      <NewTaskDialog
        open={open}
        onOpenChange={setOpen}
        newTask={newTask}
        onNewTaskChange={handleNewTaskChange}
        onAddTask={addTask}
      />

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
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="concluidas" className="space-y-4 mt-4">
          {completedTasks.length === 0 ? (
            <EmptyState type="completed" />
          ) : (
            completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={completeTask}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;

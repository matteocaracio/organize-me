import { useState } from "react";
import { useTasks } from "@/hooks/tasks/useTasks";
import { NewTaskFormData } from "@/components/tasks/types";
import NewTaskDialog from "@/components/tasks/NewTaskDialog";
import TaskListView from "@/components/tasks/TaskListView";
import TaskCalendarView from "@/components/tasks/TaskCalendarView";
import TasksHeader from "@/components/tasks/TasksHeader";

const Tasks = () => {
  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"list" | "calendar">("list");
  const [newTask, setNewTask] = useState<NewTaskFormData>({
    title: "",
    notes: "",
    priority: "medium",
    due_date: undefined,
  });
  const [refreshTask, setRefreshTask] = useState(0);

  const {
    loading,
    pendingTasks,
    completedTasks,
    addTask,
    completeTask,
    deleteTask,
    sortTasksByPriorityAndDueDate
  } = useTasks(setRefreshTask, refreshTask);

  const handleNewTaskChange = (task: NewTaskFormData) => {
    setNewTask(task);
  };

  const handleAddTask = async () => {
    await addTask(newTask);
    setNewTask({
      title: "",
      notes: "",
      priority: "medium",
      due_date: undefined,
    });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <TasksHeader
        currentView={currentView}
        onViewChange={setCurrentView}
        onNewTask={() => setOpen(true)}
      />

      <NewTaskDialog
        open={open}
        onOpenChange={setOpen}
        newTask={newTask}
        onNewTaskChange={handleNewTaskChange}
        onAddTask={handleAddTask}
      />

      {loading ? (
        <div className="text-center py-8">Carregando tarefas...</div>
      ) : currentView === "calendar" ? (
        <TaskCalendarView
          tasks={sortTasksByPriorityAndDueDate([...pendingTasks, ...completedTasks])}
          onComplete={completeTask}
          onDelete={deleteTask}
        />
      ) : (
        <TaskListView
          pendingTasks={pendingTasks}
          completedTasks={completedTasks}
          onComplete={completeTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
};

export default Tasks;

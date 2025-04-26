
import { Task } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState";
import { useTaskSorting } from "@/hooks/tasks/useTaskSorting";

interface TaskListViewProps {
  pendingTasks: Task[];
  completedTasks: Task[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskListView = ({
  pendingTasks,
  completedTasks,
  onComplete,
  onDelete,
}: TaskListViewProps) => {
  const { sortTasksByPriorityAndDueDate } = useTaskSorting();
  const sortedPendingTasks = sortTasksByPriorityAndDueDate(pendingTasks);

  return (
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
          sortedPendingTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={onComplete}
              onDelete={onDelete}
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
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
};

export default TaskListView;

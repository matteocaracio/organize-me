
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Task } from "./types";
import TaskCard from "./TaskCard";
import { Card } from "@/components/ui/card";
import { useTaskSorting } from "@/hooks/tasks/useTaskSorting";

interface TaskCalendarViewProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskCalendarView = ({ tasks, onComplete, onDelete }: TaskCalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { sortTasksByPriorityAndDueDate } = useTaskSorting();

  // Filter pending tasks for the selected date and sort by priority
  const tasksForSelectedDate = sortTasksByPriorityAndDueDate(
    tasks.filter((task) => {
      if (!task.due_date || !selectedDate || task.status === "completed") return false;
      return format(task.due_date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
    })
  );

  // Get only pending tasks for calendar highlighting
  const pendingTasks = tasks.filter(task => task.status === "pending");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => setSelectedDate(date || new Date())}
          className="rounded-md"
          modifiers={{
            highlighted: (date) =>
              pendingTasks.some(
                (task) =>
                  task.due_date &&
                  format(task.due_date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
              ),
          }}
          modifiersStyles={{
            highlighted: { backgroundColor: "var(--primary)", color: "white" },
          }}
        />
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Tarefas para {format(selectedDate, "dd/MM/yyyy")}
        </h3>
        {tasksForSelectedDate.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma tarefa pendente para esta data.</p>
        ) : (
          tasksForSelectedDate.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskCalendarView;

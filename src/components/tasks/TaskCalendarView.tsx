
import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale"; // Import the locale correctly
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
  const [allDaysWithTasks, setAllDaysWithTasks] = useState<{[key: string]: Task[]}>({});

  // Get only pending tasks for calendar highlighting
  const pendingTasks = tasks.filter(task => task.status === "pending");
  
  // Process all tasks by date
  useEffect(() => {
    // Group tasks by date
    const tasksByDate: {[key: string]: Task[]} = {};
    
    // Get all days in the current month
    const firstDay = startOfMonth(selectedDate);
    const lastDay = endOfMonth(selectedDate);
    const allDaysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
    
    // Initialize all days with empty arrays
    allDaysInMonth.forEach(day => {
      const dateKey = format(day, "yyyy-MM-dd");
      tasksByDate[dateKey] = [];
    });
    
    // Group tasks by their due dates
    tasks.forEach(task => {
      if (task.due_date) {
        const dateKey = format(task.due_date, "yyyy-MM-dd");
        if (!tasksByDate[dateKey]) {
          tasksByDate[dateKey] = [];
        }
        tasksByDate[dateKey].push(task);
      }
    });
    
    // Sort tasks for each date
    Object.keys(tasksByDate).forEach(dateKey => {
      if (tasksByDate[dateKey].length > 0) {
        tasksByDate[dateKey] = sortTasksByPriorityAndDueDate(tasksByDate[dateKey]);
      }
    });
    
    setAllDaysWithTasks(tasksByDate);
  }, [tasks, selectedDate, sortTasksByPriorityAndDueDate]);

  // Filter tasks for the selected date and sort by priority
  const tasksForSelectedDate = allDaysWithTasks[format(selectedDate, "yyyy-MM-dd")] || [];

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => setSelectedDate(date || new Date())}
          className="rounded-md pointer-events-auto"
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
      
      <h3 className="text-lg font-semibold mt-4">
        Tarefas para {format(selectedDate, "dd/MM/yyyy")}
      </h3>
      
      {tasksForSelectedDate.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma tarefa pendente para esta data.</p>
      ) : (
        <div className="space-y-4">
          {tasksForSelectedDate.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
      
      {/* Show all days with tasks expanded */}
      <div className="space-y-8 mt-8">
        <h3 className="text-xl font-semibold border-b pb-2">Todas as tarefas do mês</h3>
        {Object.keys(allDaysWithTasks).sort().map(dateKey => {
          const dayTasks = allDaysWithTasks[dateKey];
          if (dayTasks.length === 0) return null;
          
          const displayDate = new Date(dateKey);
          
          return (
            <div key={dateKey} className="space-y-4">
              <h4 className="font-medium text-lg">
                {format(displayDate, "dd/MM/yyyy - EEEE", { locale: ptBR })}
              </h4>
              {dayTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={onComplete}
                  onDelete={onDelete}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskCalendarView;

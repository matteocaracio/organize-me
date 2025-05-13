
import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Task } from "./types";
import TaskCard from "./TaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskSorting } from "@/hooks/tasks/useTaskSorting";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TaskCalendarViewProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskCalendarView = ({ tasks, onComplete, onDelete }: TaskCalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const { sortTasksByPriorityAndDueDate } = useTaskSorting();
  const [allDaysWithTasks, setAllDaysWithTasks] = useState<{[key: string]: Task[]}>({});
  const [expandedView, setExpandedView] = useState(false);

  // Get only pending tasks for calendar highlighting
  const pendingTasks = tasks.filter(task => task.status === "pending");
  
  // Process all tasks by date
  useEffect(() => {
    // Group tasks by date
    const tasksByDate: {[key: string]: Task[]} = {};
    
    // Get all days in the current month
    const firstDay = startOfMonth(currentMonth);
    const lastDay = endOfMonth(currentMonth);
    const allDaysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
    
    // Initialize all days with empty arrays
    allDaysInMonth.forEach(day => {
      const dateKey = format(day, "yyyy-MM-dd");
      tasksByDate[dateKey] = [];
    });
    
    // Group tasks by their due dates
    tasks.forEach(task => {
      if (task.due_date) {
        const taskDate = new Date(task.due_date);
        if (isSameMonth(taskDate, currentMonth)) {
          const dateKey = format(taskDate, "yyyy-MM-dd");
          if (!tasksByDate[dateKey]) {
            tasksByDate[dateKey] = [];
          }
          tasksByDate[dateKey].push(task);
        }
      }
    });
    
    // Sort tasks for each date
    Object.keys(tasksByDate).forEach(dateKey => {
      if (tasksByDate[dateKey].length > 0) {
        tasksByDate[dateKey] = sortTasksByPriorityAndDueDate(tasksByDate[dateKey]);
      }
    });
    
    setAllDaysWithTasks(tasksByDate);
  }, [tasks, currentMonth, sortTasksByPriorityAndDueDate]);

  // Filter tasks for the selected date and sort by priority
  const tasksForSelectedDate = allDaysWithTasks[format(selectedDate, "yyyy-MM-dd")] || [];

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-4 border">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </h3>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {/* Day labels */}
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground pb-1">
              {day}
            </div>
          ))}
          
          {/* Calendar cells */}
          {eachDayOfInterval({
            start: startOfMonth(currentMonth),
            end: endOfMonth(currentMonth)
          }).map((date, i) => {
            // Add empty cells for the days of the week before the first day of the month
            const startingDay = startOfMonth(currentMonth).getDay();
            const emptyCells = i === 0 ? Array.from({ length: startingDay }).map((_, index) => (
              <div key={`empty-${index}`} className="h-24 bg-muted/20 rounded-md"></div>
            )) : [];
            
            const dateKey = format(date, "yyyy-MM-dd");
            const hasTasks = allDaysWithTasks[dateKey]?.length > 0;
            const isSelected = format(selectedDate, "yyyy-MM-dd") === dateKey;
            
            return [
              ...emptyCells,
              <div 
                key={dateKey}
                className={`h-24 p-1 border rounded-md overflow-hidden transition-colors ${
                  isToday(date) ? 'border-primary' : ''
                } ${
                  isSelected ? 'bg-primary/10 border-primary' : hasTasks ? 'bg-accent/50' : 'bg-card'
                } cursor-pointer`}
                onClick={() => setSelectedDate(date)}
              >
                <div className="text-right mb-1">
                  <span className={`inline-block rounded-full w-6 h-6 text-center leading-6 text-xs ${
                    isToday(date) ? 'bg-primary text-white' : ''
                  }`}>
                    {format(date, 'd')}
                  </span>
                </div>
                
                <div className="space-y-1">
                  {allDaysWithTasks[dateKey]?.slice(0, 2).map(task => (
                    <div 
                      key={task.id} 
                      className={`text-xs truncate px-1 py-0.5 rounded ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {task.title}
                    </div>
                  ))}
                  
                  {allDaysWithTasks[dateKey]?.length > 2 && (
                    <div className="text-xs text-center text-muted-foreground">
                      +{allDaysWithTasks[dateKey].length - 2} mais
                    </div>
                  )}
                </div>
              </div>
            ];
          })}
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle>
            Tarefas para {format(selectedDate, "dd/MM/yyyy")}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpandedView(!expandedView)}
          >
            {expandedView ? "Ver Menos" : "Ver Todos os Dias"}
          </Button>
        </CardHeader>
        <CardContent>
          {tasksForSelectedDate.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma tarefa para esta data.</p>
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
        </CardContent>
      </Card>
      
      {/* Expanded view showing all days with tasks */}
      {expandedView && (
        <div className="space-y-8">
          <h3 className="text-xl font-semibold border-b pb-2">Todas as tarefas do mês</h3>
          {Object.entries(allDaysWithTasks)
            .filter(([_, tasks]) => tasks.length > 0)
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .map(([dateKey, dayTasks]) => {
              const displayDate = new Date(dateKey);
              
              return (
                <Card key={dateKey} className="overflow-hidden">
                  <CardHeader className={`${
                    isToday(displayDate) ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <CardTitle className="text-lg">
                      {format(displayDate, "dd/MM/yyyy - EEEE", { locale: ptBR })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {dayTasks.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onComplete={onComplete}
                          onDelete={onDelete}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default TaskCalendarView;

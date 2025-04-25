
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays, LayoutList } from "lucide-react";

interface TasksHeaderProps {
  currentView: "list" | "calendar";
  onViewChange: (view: "list" | "calendar") => void;
  onNewTask: () => void;
}

const TasksHeader = ({ currentView, onViewChange, onNewTask }: TasksHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight">Tarefas</h1>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onViewChange(currentView === "list" ? "calendar" : "list")}
        >
          {currentView === "list" ? (
            <><CalendarDays className="h-4 w-4 mr-1" /> Calendário</>
          ) : (
            <><LayoutList className="h-4 w-4 mr-1" /> Lista</>
          )}
        </Button>
        <Button size="sm" onClick={onNewTask}>
          <Plus className="h-4 w-4 mr-1" /> Nova Tarefa
        </Button>
      </div>
    </div>
  );
};

export default TasksHeader;

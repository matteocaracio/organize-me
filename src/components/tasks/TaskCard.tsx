
import React, { useState } from "react";
import { Task } from "./types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock, ArrowUp, ArrowUpRight, MoreVertical, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskCard = ({ task, onComplete, onDelete }: TaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const priorityIcons = {
    high: <ArrowUp className="h-4 w-4 text-priority-high" />,
    medium: <ArrowUpRight className="h-4 w-4 text-priority-medium" />,
    low: <Check className="h-4 w-4 text-priority-low" />,
  };

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className={task.status === "completed" ? "opacity-60" : "card-hover"}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-grow">
            {task.status === "pending" ? (
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 shrink-0 rounded-full"
                onClick={() => onComplete(task.id)}
              >
                <Check className="h-3 w-3" />
                <span className="sr-only">Marcar como concluída</span>
              </Button>
            ) : (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                <Check className="h-3 w-3" />
              </div>
            )}
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                {priorityIcons[task.priority]}
                <span className={task.status === "completed" ? "line-through" : "font-medium"}>
                  {task.title}
                </span>
              </div>
              
              {task.notes && (
                <div className="mt-1">
                  {isExpanded ? (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                      {task.notes}
                    </p>
                  ) : null}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleDescription} 
                    className="mt-1 h-6 px-2 py-1 text-xs"
                  >
                    {isExpanded ? (
                      <>Fechar <ChevronUp className="h-3 w-3 ml-1" /></>
                    ) : (
                      <>Abrir <ChevronDown className="h-3 w-3 ml-1" /></>
                    )}
                  </Button>
                </div>
              )}
              
              {task.due_date && (
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {task.due_date.toLocaleDateString("pt-BR")}
                  </span>
                </div>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Mais opções</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onComplete(task.id)}>
                {task.status === "pending" ? "Concluir" : "Reabrir"}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(task.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;

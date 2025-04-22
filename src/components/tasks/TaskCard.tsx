
import React from "react";
import { Task } from "./types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock, ArrowUp, ArrowUpRight, MoreVertical, Trash2 } from "lucide-react";
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
  const priorityIcons = {
    high: <ArrowUp className="h-4 w-4 text-priority-high" />,
    medium: <ArrowUpRight className="h-4 w-4 text-priority-medium" />,
    low: <Check className="h-4 w-4 text-priority-low" />,
  };

  return (
    <Card className={task.status === "completed" ? "opacity-60" : "card-hover"}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
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
            <div>
              <div className="flex items-center gap-2">
                {priorityIcons[task.priority]}
                <span className={task.status === "completed" ? "line-through" : "font-medium"}>
                  {task.title}
                </span>
              </div>
              {task.notes && (
                <p className="text-sm text-muted-foreground mt-1">{task.notes}</p>
              )}
              {task.due_date && (
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {task.due_date.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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


import React from "react";
import { CheckSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "@/components/tasks/types";

interface TaskSelectorProps {
  tasks: Task[];
  selectedTask: Task | null;
  setSelectedTask: (task: Task) => void;
}

const TaskSelector = ({ tasks, selectedTask, setSelectedTask }: TaskSelectorProps) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Vincular atividade</h3>
      <Card>
        <CardContent className="p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CheckSquare className="h-4 w-4 mr-2" />
                {selectedTask ? selectedTask.title : "Selecionar uma tarefa"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {tasks.length === 0 ? (
                <DropdownMenuItem disabled>
                  Nenhuma tarefa disponível
                </DropdownMenuItem>
              ) : (
                tasks.map(task => (
                  <DropdownMenuItem 
                    key={task.id} 
                    onClick={() => setSelectedTask(task)}
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    {task.title}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskSelector;

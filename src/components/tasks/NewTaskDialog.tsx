
import React from "react";
import { NewTaskFormData } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newTask: NewTaskFormData;
  onNewTaskChange: (task: NewTaskFormData) => void;
  onAddTask: () => void;
}

const NewTaskDialog = ({
  open,
  onOpenChange,
  newTask,
  onNewTaskChange,
  onAddTask,
}: NewTaskDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar nova tarefa</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Digite o título da tarefa"
              value={newTask.title}
              onChange={(e) =>
                onNewTaskChange({ ...newTask, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Anotações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione detalhes sobre a tarefa"
              value={newTask.notes}
              onChange={(e) =>
                onNewTaskChange({ ...newTask, notes: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Prioridade</Label>
            <RadioGroup
              defaultValue={newTask.priority}
              onValueChange={(value: "low" | "medium" | "high") =>
                onNewTaskChange({ ...newTask, priority: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="text-priority-low">
                  Baixa
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="text-priority-medium">
                  Média
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="text-priority-high">
                  Alta
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>Data de Vencimento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !newTask.due_date && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {newTask.due_date
                    ? format(newTask.due_date, "PPP")
                    : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newTask.due_date}
                  onSelect={(date) => onNewTaskChange({ ...newTask, due_date: date })}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onAddTask}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;

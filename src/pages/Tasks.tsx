import { useState } from "react";
import { 
  Plus, Check, Clock, ArrowUp, ArrowUpRight, 
  MoreVertical, CalendarDays, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Tipo para as tarefas
type Priority = "low" | "medium" | "high";
type TaskStatus = "pending" | "completed";

interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  status: TaskStatus;
  due_date?: Date;
}

const Tasks = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Enviar relatório final",
      notes: "Incluir todas as métricas do último trimestre",
      priority: "high",
      status: "pending",
      due_date: new Date(2025, 3, 21, 10, 0)
    },
    {
      id: "2",
      title: "Reunião com equipe",
      notes: "Discutir os novos projetos",
      priority: "medium",
      status: "pending",
      due_date: new Date(2025, 3, 21, 14, 30)
    },
    {
      id: "3",
      title: "Revisar cartões de Biologia",
      notes: "Focar no capítulo 5",
      priority: "low",
      status: "pending",
      due_date: new Date(2025, 3, 21, 19, 0)
    },
    {
      id: "4",
      title: "Atualizar LinkedIn",
      status: "completed",
      priority: "medium"
    }
  ]);
  
  // Update the newTask state to include due_date
  const [newTask, setNewTask] = useState({
    title: "",
    notes: "",
    priority: "medium" as Priority,
    due_date: undefined as Date | undefined
  });

  // Função para adicionar uma nova tarefa
  const addTask = () => {
    if (newTask.title.trim() === "") return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      notes: newTask.notes,
      priority: newTask.priority,
      status: "pending",
      due_date: newTask.due_date
    };
    
    setTasks([task, ...tasks]);
    setNewTask({
      title: "",
      notes: "",
      priority: "medium",
      due_date: undefined
    });
    setOpen(false);
  };

  // Função para marcar tarefa como concluída
  const completeTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: "completed" } : task
      )
    );
  };

  // Filtra tarefas por status
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  // Mapeia prioridades para ícones e cores
  const priorityIcons = {
    high: <ArrowUp className="h-4 w-4 text-priority-high" />,
    medium: <ArrowUpRight className="h-4 w-4 text-priority-medium" />,
    low: <Check className="h-4 w-4 text-priority-low" />
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tarefas</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Nova Tarefa
            </Button>
          </DialogTrigger>
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
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Anotações (opcional)</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Adicione detalhes sobre a tarefa"
                  value={newTask.notes}
                  onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <RadioGroup 
                  defaultValue={newTask.priority}
                  onValueChange={(value: Priority) => 
                    setNewTask({...newTask, priority: value})
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low" className="text-priority-low">Baixa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="text-priority-medium">Média</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high" className="text-priority-high">Alta</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Data de Vencimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newTask.due_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {newTask.due_date ? format(newTask.due_date, "PPP") : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newTask.due_date}
                    onSelect={(date) => setNewTask({...newTask, due_date: date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={addTask}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
            <div className="text-center p-6 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Sem tarefas pendentes. Adicione uma nova tarefa!</p>
            </div>
          ) : (
            pendingTasks.map((task) => (
              <Card key={task.id} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 shrink-0 rounded-full"
                        onClick={() => completeTask(task.id)}
                      >
                        <Check className="h-3 w-3" />
                        <span className="sr-only">Marcar como concluída</span>
                      </Button>
                      <div>
                        <div className="flex items-center gap-2">
                          {priorityIcons[task.priority]}
                          <span className="font-medium">{task.title}</span>
                        </div>
                        {task.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.notes}
                          </p>
                        )}
                        {task.due_date && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {task.due_date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
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
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Adiar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        <TabsContent value="concluidas" className="space-y-4 mt-4">
          {completedTasks.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground">
              <Check className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma tarefa concluída ainda.</p>
            </div>
          ) : (
            completedTasks.map((task) => (
              <Card key={task.id} className="opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="line-through">{task.title}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Mais opções</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Restaurar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;

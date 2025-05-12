import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckSquare, FileText, Layers, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Task, Priority, TaskStatus } from "@/components/tasks/types";
import { Note } from "@/components/notes/types";
import { compareAsc } from "date-fns";
const Dashboard = () => {
  const [highPriorityTasks, setHighPriorityTasks] = useState(0);
  const [recentNotes, setRecentNotes] = useState(0);
  const [flashcardsToReview, setFlashcardsToReview] = useState(0);
  const [userName, setUserName] = useState("Usuário");
  const [focusTasks, setFocusTasks] = useState<Task[]>([]);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const {
          data: userData
        } = await supabase.auth.getUser();
        if (!userData.user) return;

        // Buscar tarefas de alta prioridade
        const {
          data: tasksData
        } = await supabase.from('tasks').select('*').eq('user_id', userData.user.id).eq('is_completed', false).eq('priority', 'high');
        setHighPriorityTasks(tasksData?.length || 0);

        // Buscar tarefas próximas do prazo (não concluídas e ordenadas por data)
        const {
          data: focusTasksData
        } = await supabase.from('tasks').select('*').eq('user_id', userData.user.id).eq('is_completed', false).not('due_date', 'is', null).order('due_date', {
          ascending: true
        }).limit(3);
        if (focusTasksData) {
          const formattedTasks: Task[] = focusTasksData.map(task => ({
            id: task.id,
            title: task.title,
            notes: task.notes || "",
            priority: (task.priority || "medium") as Priority,
            status: task.is_completed ? "completed" : "pending" as TaskStatus,
            due_date: task.due_date ? new Date(task.due_date) : undefined
          })).sort((a, b) => {
            if (a.due_date && b.due_date) {
              return compareAsc(a.due_date, b.due_date);
            }
            return 0;
          });
          setFocusTasks(formattedTasks);
        }

        // Buscar notas recentes
        const {
          data: notesData
        } = await supabase.from('notes').select('*').eq('user_id', userData.user.id).order('updated_at', {
          ascending: false
        }).limit(5);
        setRecentNotes(notesData?.length || 0);

        // Número de flashcards para revisão (simulação, já que não temos campo de next_review ainda)
        setFlashcardsToReview(12); // Placeholder

        // Buscar o nome do usuário (se existir)
        const {
          data: profileData
        } = await supabase.from('profiles').select('first_name, last_name').eq('id', userData.user.id).single();
        if (profileData && profileData.first_name) {
          setUserName(profileData.first_name);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      }
    };
    fetchDashboardData();
  }, []);
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Olá, {userName}</h1>
          <p className="text-muted-foreground">
            <Clock className="inline-block h-4 w-4 mr-1" />
            <span>{new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Tarefas de alta prioridade */}
        <Link to="/tasks" className="card-hover">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{highPriorityTasks}</div>
              <p className="text-xs text-muted-foreground">Tarefas de alta prioridade em aberto</p>
            </CardContent>
          </Card>
        </Link>

        {/* Notas recentes */}
        <Link to="/notes" className="card-hover">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Notas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentNotes}</div>
              <p className="text-xs text-muted-foreground">
                Notas recentes ou fixadas
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Flashcards para revisão */}
        
      </div>

      {/* Resumo do dia */}
      <Card className="border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle>Foco do dia</CardTitle>
          <CardDescription>Tarefas com prazo mais próximo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {focusTasks.length === 0 ? <div className="text-center text-muted-foreground py-4">
              Não há tarefas com prazo definido
            </div> : focusTasks.map(task => <div key={task.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-priority-high' : task.priority === 'medium' ? 'bg-priority-medium' : 'bg-priority-low'}`}></div>
                    <span className="font-medium">{task.title}</span>
                  </div>
                  {task.due_date && <span className="text-xs text-muted-foreground">
                      {task.due_date.toLocaleDateString('pt-BR')}
                    </span>}
                </div>
              </div>)}
        </CardContent>
      </Card>

      {/* Timer rápido */}
      <Link to="/timer" className="block card-hover">
        <Card className="bg-primary/5 border-primary">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Timer className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Iniciar foco</h3>
                <p className="text-sm text-muted-foreground">Temporizador rápido para sua próxima tarefa</p>
              </div>
            </div>
            <span className="text-2xl font-bold">25:00</span>
          </CardContent>
        </Card>
      </Link>
    </div>;
};
export default Dashboard;
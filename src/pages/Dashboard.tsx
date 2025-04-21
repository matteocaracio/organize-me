
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckSquare, FileText, Layers, Timer } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Olá, Usuário</h1>
          <p className="text-muted-foreground">
            <Clock className="inline-block h-4 w-4 mr-1" />
            <span>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Tarefas de alta prioridade */}
        <Link to="/tasks" className="card-hover">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Tarefas de alta prioridade hoje
              </p>
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
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                Notas recentes ou fixadas
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Flashcards para revisão */}
        <Link to="/flashcards" className="card-hover">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Flashcards</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Cartões para revisar hoje
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Resumo do dia */}
      <Card className="border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle>Foco do dia</CardTitle>
          <CardDescription>Tarefas e atividades prioritárias para hoje</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-priority-high"></div>
                <span className="font-medium">Enviar relatório final</span>
              </div>
              <span className="text-xs text-muted-foreground">10:00</span>
            </div>
          </div>
          <div className="border rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-priority-medium"></div>
                <span className="font-medium">Reunião com equipe</span>
              </div>
              <span className="text-xs text-muted-foreground">14:30</span>
            </div>
          </div>
          <div className="border rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-priority-low"></div>
                <span className="font-medium">Revisar cartões de Biologia</span>
              </div>
              <span className="text-xs text-muted-foreground">19:00</span>
            </div>
          </div>
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
    </div>
  );
};

export default Dashboard;

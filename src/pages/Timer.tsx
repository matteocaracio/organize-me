import { useState, useEffect, useRef } from "react";
import { 
  Play, Pause, RotateCcw, Volume2, Settings, 
  CheckSquare, FileText, Layers 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/components/tasks/types";
import { useToast } from "@/hooks/use-toast";

// Tipos para o timer
type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

interface TimerSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

const Timer = () => {
  // Configurações do timer
  const [settings, setSettings] = useState<TimerSettings>({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: true,
    autoStartPomodoros: false
  });
  
  // Estado do timer
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [volume, setVolume] = useState(50);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { toast } = useToast();
  
  // Refs
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Buscar tarefas do usuário
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return;

        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.user.id)
          .eq('is_completed', false)
          .order('priority', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedTasks: Task[] = data.map(task => ({
            id: task.id,
            title: task.title,
            notes: task.notes || "",
            priority: (task.priority || "medium") as any,
            status: "pending",
            due_date: task.due_date ? new Date(task.due_date) : undefined
          }));
          setTasks(formattedTasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);
  
  // Efeito para inicializar o áudio
  useEffect(() => {
    // Check if audio is already created
    if (!audioRef.current) {
      // Create the audio element programmatically
      const audio = new Audio();
      audio.src = "/audio/notification.mp3";
      audio.volume = volume / 100;
      audio.preload = "auto";
      
      // Add event listeners for debugging
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        toast({
          variant: "destructive",
          title: "Erro de áudio",
          description: "Não foi possível carregar o som de notificação."
        });
      });
      
      audio.addEventListener('canplaythrough', () => {
        console.log('Audio can play through');
      });
      
      // Store in ref
      audioRef.current = audio;
    }
    
    // Test audio load
    try {
      audioRef.current.load();
    } catch (e) {
      console.error('Failed to load audio:', e);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [toast]);
  
  // Efeito para atualizar o volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  // Efeito para atualizar o timer quando o modo muda
  useEffect(() => {
    switch (mode) {
      case "pomodoro":
        setTimeLeft(settings.pomodoro * 60);
        break;
      case "shortBreak":
        setTimeLeft(settings.shortBreak * 60);
        break;
      case "longBreak":
        setTimeLeft(settings.longBreak * 60);
        break;
    }
    
    // Limpa o timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsActive(false);
  }, [mode, settings]);
  
  // Test audio function
  const testAudio = () => {
    if (audioRef.current) {
      // Reset audio to beginning
      audioRef.current.currentTime = 0;
      
      // Play audio
      const playPromise = audioRef.current.play();
      
      // Handle play promise
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio playing successfully');
          })
          .catch(error => {
            console.error('Audio play failed:', error);
            toast({
              variant: "destructive", 
              title: "Erro de reprodução",
              description: "O navegador bloqueou a reprodução automática do áudio. Clique na tela e tente novamente."
            });
          });
      }
    } else {
      console.error('Audio element not initialized');
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Elemento de áudio não inicializado."
      });
    }
  };
  
  // Função para iniciar ou pausar o timer
  const toggleTimer = () => {
    if (isActive) {
      // Pausar o timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      // Iniciar o timer
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Timer acabou
            clearInterval(timerRef.current!);
            timerRef.current = null;
            
            // Toca o som de notificação
            if (audioRef.current) {
              // Reset audio to beginning
              audioRef.current.currentTime = 0;
              
              // Play audio
              const playPromise = audioRef.current.play();
              
              // Handle play promise
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    console.log('Audio playing successfully');
                  })
                  .catch(error => {
                    console.error('Audio play failed:', error);
                    toast({
                      variant: "destructive", 
                      title: "Erro de reprodução",
                      description: "O navegador bloqueou a reprodução automática do áudio."
                    });
                  });
              }
            }
            
            // Lógica para mudar para o próximo modo
            if (mode === "pomodoro") {
              setCycles((prev) => prev + 1);
              
              // A cada 4 pomodoros, faz uma pausa longa
              const nextMode = cycles % 4 === 3 ? "longBreak" : "shortBreak";
              
              if (settings.autoStartBreaks) {
                setMode(nextMode);
                return nextMode === "longBreak" 
                  ? settings.longBreak * 60 
                  : settings.shortBreak * 60;
              } else {
                setMode(nextMode);
              }
            } else {
              // Fim do intervalo, volta para o pomodoro
              if (settings.autoStartPomodoros) {
                setMode("pomodoro");
                return settings.pomodoro * 60;
              } else {
                setMode("pomodoro");
              }
            }
            
            setIsActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    setIsActive(!isActive);
  };
  
  // Função para reiniciar o timer
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    switch (mode) {
      case "pomodoro":
        setTimeLeft(settings.pomodoro * 60);
        break;
      case "shortBreak":
        setTimeLeft(settings.shortBreak * 60);
        break;
      case "longBreak":
        setTimeLeft(settings.longBreak * 60);
        break;
    }
    
    setIsActive(false);
  };
  
  // Formatação do tempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  // Calcula o progresso para a barra de progresso
  const calculateProgress = () => {
    let totalTime;
    switch (mode) {
      case "pomodoro":
        totalTime = settings.pomodoro * 60;
        break;
      case "shortBreak":
        totalTime = settings.shortBreak * 60;
        break;
      case "longBreak":
        totalTime = settings.longBreak * 60;
        break;
      default:
        totalTime = settings.pomodoro * 60;
    }
    
    return 100 - (timeLeft / totalTime) * 100;
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-13rem)]">
      <div className="w-full max-w-md">
        <Tabs 
          defaultValue="pomodoro" 
          value={mode}
          onValueChange={(value) => setMode(value as TimerMode)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
            <TabsTrigger value="shortBreak">Pausa Curta</TabsTrigger>
            <TabsTrigger value="longBreak">Pausa Longa</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pomodoro" className="mt-0">
            <Card className="text-center">
              <CardContent className="pt-6 pb-8">
                <div className="text-6xl font-bold mb-8">{formatTime(timeLeft)}</div>
                <div className="flex justify-center gap-4 mb-8">
                  <Button 
                    size="lg" 
                    className="h-14 w-14 rounded-full"
                    onClick={toggleTimer}
                  >
                    {isActive ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-0.5" />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-14 w-14 rounded-full"
                    onClick={resetTimer}
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center">
                    <Volume2 className="h-5 w-5 text-muted-foreground mr-2" />
                    <Slider
                      className="w-24"
                      value={[volume]}
                      max={100}
                      step={1}
                      onValueChange={(value) => setVolume(value[0])}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-2" 
                      onClick={testAudio}
                    >
                      Testar
                    </Button>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-5 w-5 mr-1" />
                        Configurações
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Configurações do Timer</DialogTitle>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Tempo de Foco (minutos)
                          </label>
                          <Slider
                            defaultValue={[settings.pomodoro]}
                            max={60}
                            min={1}
                            step={1}
                            onValueChange={(value) => 
                              setSettings({...settings, pomodoro: value[0]})
                            }
                          />
                          <div className="text-right text-sm text-muted-foreground mt-1">
                            {settings.pomodoro} minutos
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Pausa Curta (minutos)
                          </label>
                          <Slider
                            defaultValue={[settings.shortBreak]}
                            max={30}
                            min={1}
                            step={1}
                            onValueChange={(value) => 
                              setSettings({...settings, shortBreak: value[0]})
                            }
                          />
                          <div className="text-right text-sm text-muted-foreground mt-1">
                            {settings.shortBreak} minutos
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Pausa Longa (minutos)
                          </label>
                          <Slider
                            defaultValue={[settings.longBreak]}
                            max={45}
                            min={1}
                            step={1}
                            onValueChange={(value) => 
                              setSettings({...settings, longBreak: value[0]})
                            }
                          />
                          <div className="text-right text-sm text-muted-foreground mt-1">
                            {settings.longBreak} minutos
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shortBreak" className="mt-0">
            <Card className="text-center">
              <CardContent className="pt-6 pb-8">
                <div className="text-6xl font-bold mb-8">{formatTime(timeLeft)}</div>
                <div className="flex justify-center gap-4 mb-8">
                  <Button 
                    size="lg" 
                    className="h-14 w-14 rounded-full"
                    onClick={toggleTimer}
                  >
                    {isActive ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-0.5" />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-14 w-14 rounded-full"
                    onClick={resetTimer}
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="longBreak" className="mt-0">
            <Card className="text-center">
              <CardContent className="pt-6 pb-8">
                <div className="text-6xl font-bold mb-8">{formatTime(timeLeft)}</div>
                <div className="flex justify-center gap-4 mb-8">
                  <Button 
                    size="lg" 
                    className="h-14 w-14 rounded-full"
                    onClick={toggleTimer}
                  >
                    {isActive ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-0.5" />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-14 w-14 rounded-full"
                    onClick={resetTimer}
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
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
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Ciclos completados hoje: {cycles}</p>
          {cycles > 0 && (
            <p className="mt-1">
              Total: {cycles * settings.pomodoro} minutos de foco
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;

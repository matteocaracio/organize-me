
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { BellRing, Calendar, CheckCircle2, Clock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NotificationSettings = () => {
  const [loading, setLoading] = useState(false);
  const { toast: uiToast } = useToast();

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [appointmentAlerts, setAppointmentAlerts] = useState(true);
  const [completionNotices, setCompletionNotices] = useState(true);
  const [timerAlerts, setTimerAlerts] = useState(true);

  const testNotification = () => {
    // Using two different toast systems to demonstrate both
    toast.success("Notificação de teste via Sonner");
    
    uiToast({
      title: "Notificação de teste",
      description: "Este é um exemplo de notificação do sistema usando o componente UI Toast",
    });
    
    // Try to play notification sound
    try {
      const audio = new Audio('/audio/notification.mp3');
      audio.play();
    } catch (error) {
      console.error("Erro ao reproduzir áudio:", error);
    }
  };

  const saveNotificationSettings = () => {
    setLoading(true);
    
    // In a real app, this would save to the database
    setTimeout(() => {
      setLoading(false);
      toast.success("Preferências de notificação atualizadas");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Preferências de Notificação</h3>
        <p className="text-sm text-muted-foreground">
          Configure como e quando você deseja receber notificações.
        </p>
      </div>
      
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Notificações por Email</p>
                  <p className="text-sm text-muted-foreground">Receba atualizações importantes por email</p>
                </div>
              </div>
              <Switch 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <BellRing className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Lembretes de Tarefas</p>
                  <p className="text-sm text-muted-foreground">Seja lembrado sobre tarefas próximas do prazo</p>
                </div>
              </div>
              <Switch 
                checked={taskReminders} 
                onCheckedChange={setTaskReminders} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Alertas de Compromissos</p>
                  <p className="text-sm text-muted-foreground">Notificações para eventos agendados</p>
                </div>
              </div>
              <Switch 
                checked={appointmentAlerts} 
                onCheckedChange={setAppointmentAlerts} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Avisos de Conclusão</p>
                  <p className="text-sm text-muted-foreground">Notificações quando tarefas forem concluídas</p>
                </div>
              </div>
              <Switch 
                checked={completionNotices} 
                onCheckedChange={setCompletionNotices} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Alertas do Timer</p>
                  <p className="text-sm text-muted-foreground">Sons e notificações quando o temporizador terminar</p>
                </div>
              </div>
              <Switch 
                checked={timerAlerts} 
                onCheckedChange={setTimerAlerts} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex space-x-4">
        <Button 
          onClick={saveNotificationSettings} 
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar preferências"}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={testNotification}
        >
          Testar notificação
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;

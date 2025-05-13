
import React from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TimerSettingsProps {
  settings: {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
  };
  setSettings: (settings: any) => void;
}

const TimerSettings = ({ settings, setSettings }: TimerSettingsProps) => {
  return (
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
  );
};

export default TimerSettings;

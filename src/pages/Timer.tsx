
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimerMode, useTimerState } from "@/hooks/timer/useTimerState";
import { useTimerAudio } from "@/hooks/timer/useTimerAudio";
import { useTaskSelection } from "@/hooks/timer/useTaskSelection";
import TimerClock from "@/components/timer/TimerClock";
import AudioControls from "@/components/timer/AudioControls";
import TimerSettings from "@/components/timer/TimerSettings";
import TaskSelector from "@/components/timer/TaskSelector";

const Timer = () => {
  // Custom hooks
  const { volume, setVolume, audioReady, playNotificationSound, testAudio, handleInitializeAudio } = useTimerAudio();
  const { settings, setSettings, mode, setMode, timeLeft, isActive, cycles, toggleTimer, resetTimer, formatTime, calculateProgress } = useTimerState(playNotificationSound);
  const { tasks, selectedTask, setSelectedTask } = useTaskSelection();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-13rem)]">
      <div className="w-full max-w-md">
        {!audioReady && (
          <Card className="mb-6 bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-amber-700">
                  <p className="font-medium">Ative o som do timer</p>
                  <p className="text-sm">Clique no botão ao lado para permitir notificações sonoras</p>
                </div>
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={handleInitializeAudio}
                >
                  Ativar Som
                </button>
              </div>
            </CardContent>
          </Card>
        )}
        
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
                <TimerClock 
                  timeLeft={timeLeft}
                  isActive={isActive}
                  toggleTimer={toggleTimer}
                  resetTimer={resetTimer}
                  calculateProgress={calculateProgress}
                  formatTime={formatTime}
                />
                <div className="flex justify-between items-center mt-6">
                  <AudioControls 
                    volume={volume}
                    setVolume={setVolume}
                    testAudio={testAudio}
                  />
                  <TimerSettings 
                    settings={settings}
                    setSettings={setSettings}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shortBreak" className="mt-0">
            <Card className="text-center">
              <CardContent className="pt-6 pb-8">
                <TimerClock 
                  timeLeft={timeLeft}
                  isActive={isActive}
                  toggleTimer={toggleTimer}
                  resetTimer={resetTimer}
                  calculateProgress={calculateProgress}
                  formatTime={formatTime}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="longBreak" className="mt-0">
            <Card className="text-center">
              <CardContent className="pt-6 pb-8">
                <TimerClock 
                  timeLeft={timeLeft}
                  isActive={isActive}
                  toggleTimer={toggleTimer}
                  resetTimer={resetTimer}
                  calculateProgress={calculateProgress}
                  formatTime={formatTime}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <TaskSelector 
          tasks={tasks}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
        />
        
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


import { useState, useRef, useEffect } from "react";

// Timer mode type
export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

// Timer settings interface
export interface TimerSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

export const useTimerState = (playNotificationSound: () => void) => {
  // Timer settings
  const [settings, setSettings] = useState<TimerSettings>({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: true,
    autoStartPomodoros: false
  });
  
  // Timer state
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  
  // Timer ref
  const timerRef = useRef<number | null>(null);
  
  // Update timer when mode changes
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
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsActive(false);
  }, [mode, settings]);
  
  // Start or pause timer
  const toggleTimer = () => {
    if (isActive) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            
            playNotificationSound();
            
            if (mode === "pomodoro") {
              setCycles((prev) => prev + 1);
              
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
  
  // Reset timer
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
  
  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  // Calculate progress
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

  return {
    settings,
    setSettings,
    mode,
    setMode,
    timeLeft,
    isActive,
    cycles,
    toggleTimer,
    resetTimer,
    formatTime,
    calculateProgress
  };
};

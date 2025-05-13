
import React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface TimerClockProps {
  timeLeft: number;
  isActive: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  calculateProgress: () => number;
  formatTime: (seconds: number) => string;
}

const TimerClock = ({
  timeLeft,
  isActive,
  toggleTimer,
  resetTimer,
  calculateProgress,
  formatTime,
}: TimerClockProps) => {
  return (
    <>
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
    </>
  );
};

export default TimerClock;

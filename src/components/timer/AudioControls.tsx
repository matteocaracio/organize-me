
import React from "react";
import { Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface AudioControlsProps {
  volume: number;
  setVolume: (volume: number) => void;
  testAudio: () => void;
}

const AudioControls = ({ volume, setVolume, testAudio }: AudioControlsProps) => {
  return (
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
  );
};

export default AudioControls;

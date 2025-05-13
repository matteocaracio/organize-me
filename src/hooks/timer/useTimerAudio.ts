
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

export const useTimerAudio = () => {
  const [volume, setVolume] = useState(50);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Initialize audio
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.src = "https://www.soundjay.com/buttons/sounds/button-3.mp3";
      audio.volume = volume / 100;
      audio.preload = "auto";
      
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
        setAudioReady(true);
      });
      
      audioRef.current = audio;
    }
    
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
  
  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const playNotificationSound = () => {
    if (audioRef.current && audioReady) {
      audioRef.current.currentTime = 0;
      
      audioRef.current.play()
        .then(() => {
          console.log('Audio playing successfully');
        })
        .catch(error => {
          console.error('Audio play failed:', error);
          toast({
            variant: "destructive", 
            title: "Erro de reprodução",
            description: "O navegador bloqueou a reprodução do áudio."
          });
        });
    }
  };
  
  const testAudio = () => {
    playNotificationSound();
  };

  const handleInitializeAudio = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          audioRef.current?.pause();
          audioRef.current!.currentTime = 0;
          setAudioReady(true);
          toast({
            title: "Áudio inicializado",
            description: "O som de notificação foi ativado com sucesso!"
          });
        })
        .catch(error => {
          console.error('Failed to initialize audio:', error);
          toast({
            variant: "destructive",
            title: "Erro de inicialização",
            description: "Não foi possível ativar o som. Tente novamente."
          });
        });
    }
  };

  return {
    volume,
    setVolume,
    audioReady,
    playNotificationSound,
    testAudio,
    handleInitializeAudio
  };
};


import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useGlobalPasswordCheck = (
  setHasGlobalPassword: (value: boolean) => void,
  setNotePassword: (value: string | null) => void
) => {
  const [isChecking, setIsChecking] = useState(false);

  const checkGlobalPassword = async () => {
    // Previne verificações simultâneas
    if (isChecking) return;
    
    setIsChecking(true);
    
    try {
      console.time("checkGlobalPassword");
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.log("Usuário não autenticado, ignorando verificação de senha");
        setHasGlobalPassword(false);
        setNotePassword(null);
        return;
      }

      // Otimizando a query para ser mais direta e rápida
      const { data, error } = await supabase
        .from('profiles')
        .select('note_password')
        .eq('id', user.user.id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao verificar senha global:", error);
        throw error;
      }

      const hasPassword = data && data.note_password !== null;
      console.log("Verificação de senha global:", hasPassword ? "Senha configurada" : "Sem senha");
      setHasGlobalPassword(hasPassword);
      
      if (hasPassword) {
        // Use a placeholder to indicate a password exists without revealing it
        setNotePassword("PASSWORD_EXISTS");
      } else {
        setNotePassword(null);
      }
      console.timeEnd("checkGlobalPassword");
    } catch (error) {
      console.error('Erro ao verificar senha global:', error);
      setHasGlobalPassword(false);
      setNotePassword(null);
    } finally {
      setIsChecking(false);
    }
  };

  return { checkGlobalPassword, isChecking };
};

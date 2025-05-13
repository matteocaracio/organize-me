
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const usePasswordManagement = (
  password: string, 
  setNotePassword: (value: string | null) => void,
  setHasGlobalPassword: (value: boolean) => void
) => {
  const saveGlobalPassword = async (): Promise<boolean> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para configurar a senha global."
        });
        return false;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ note_password: password })
        .eq('id', user.user.id);

      if (error) {
        throw error;
      }

      setNotePassword("PASSWORD_EXISTS");
      setHasGlobalPassword(true);
      toast({
        title: "Sucesso",
        description: "Senha global salva com sucesso!"
      });
      return true;
    } catch (error) {
      console.error('Error saving global password:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar a senha global."
      });
      return false;
    }
  };

  return { saveGlobalPassword };
};

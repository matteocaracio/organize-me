
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const usePasswordValidation = (password: string, setNotePassword: (value: string | null) => void) => {
  const validatePassword = async (): Promise<boolean> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;

      const { data, error } = await supabase
        .from('profiles')
        .select('note_password')
        .eq('id', user.user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data && data.note_password === password) {
        setNotePassword("PASSWORD_EXISTS");
        toast({
          title: "Sucesso",
          description: "Senha validada com sucesso!"
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Senha incorreta."
        });
        return false;
      }
    } catch (error) {
      console.error('Error validating password:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível validar a senha."
      });
      return false;
    }
  };

  return { validatePassword };
};

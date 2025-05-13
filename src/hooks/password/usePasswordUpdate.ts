
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const usePasswordUpdate = (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  setNotePassword: (value: string | null) => void,
  setPasswordMismatch: (value: boolean) => void
) => {
  const validateAndUpdateGlobalPassword = async (): Promise<boolean> => {
    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true);
      return false;
    } 
    
    setPasswordMismatch(false);
    
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para atualizar a senha global."
        });
        return false;
      }

      // First, validate current password
      const { data, error } = await supabase
        .from('profiles')
        .select('note_password')
        .eq('id', user.user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data && data.note_password !== currentPassword) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Senha atual incorreta."
        });
        return false;
      }

      // If current password is valid, update to new password
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ note_password: newPassword })
        .eq('id', user.user.id);

      if (updateError) {
        throw updateError;
      }

      setNotePassword("PASSWORD_EXISTS");
      toast({
        title: "Sucesso",
        description: "Senha global atualizada com sucesso!"
      });
      
      return true;
    } catch (error) {
      console.error('Error updating global password:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar a senha global."
      });
      return false;
    }
  };

  return { validateAndUpdateGlobalPassword };
};

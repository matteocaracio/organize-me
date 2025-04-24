
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useNotePassword = () => {
  const [password, setPassword] = useState("");
  const [notePassword, setNotePassword] = useState<string | null>(null);
  const { toast } = useToast();

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
        setNotePassword(password);
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
    } finally {
      setPassword("");
    }
  };

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

      setNotePassword(password);
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

  return {
    password,
    setPassword,
    notePassword,
    setNotePassword,
    validatePassword,
    saveGlobalPassword,
  };
};

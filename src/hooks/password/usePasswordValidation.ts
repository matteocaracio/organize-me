
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
// Import just the compare function we need
import { compare } from "bcryptjs"; 

export const usePasswordValidation = (
  password: string,
  setNotePassword: (value: string | null) => void
) => {
  const validatePassword = async (): Promise<boolean> => {
    try {
      if (!password.trim()) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Digite uma senha para continuar."
        });
        return false;
      }
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para visualizar notas protegidas."
        });
        return false;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('note_password')
        .eq('id', user.user.id)
        .single();

      if (error) {
        throw error;
      }

      if (!data?.note_password) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não há senha global configurada. Configure uma senha nas opções de notas."
        });
        return false;
      }

      // Simple check if stored passwords are not hashed
      if (data.note_password === password) {
        setNotePassword(password);
        return true;
      }

      // For password comparison using bcryptjs (if passwords are hashed)
      try {
        const isValid = await compare(password, data.note_password);
        if (isValid) {
          setNotePassword(password);
          return true;
        }
      } catch (err) {
        console.error("Error comparing passwords:", err);
      }

      toast({
        variant: "destructive",
        title: "Erro",
        description: "Senha incorreta."
      });
      return false;
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

  return {
    validatePassword,
  };
};

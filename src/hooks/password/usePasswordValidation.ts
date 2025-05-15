
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const usePasswordValidation = (
  password: string,
  setNotePassword: (value: string | null) => void
) => {
  const validatePassword = async (): Promise<boolean> => {
    try {
      console.log("Iniciando validação de senha");
      
      if (!password || !password.trim()) {
        console.error("Senha vazia fornecida");
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Digite uma senha para continuar."
        });
        return false;
      }
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.error("Nenhum usuário autenticado");
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para visualizar notas protegidas."
        });
        return false;
      }

      console.log("Buscando senha global para o usuário:", user.user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('note_password')
        .eq('id', user.user.id)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error);
        throw error;
      }

      console.log("Perfil encontrado:", data ? "sim" : "não");
      
      if (!data?.note_password) {
        console.error("Senha global não configurada");
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não há senha global configurada. Configure uma senha nas opções de notas."
        });
        return false;
      }

      // Simple check if stored passwords are not hashed
      if (data.note_password === password) {
        console.log("Senha corresponde diretamente (não-hash)");
        setNotePassword(password);
        return true;
      }

      console.error("Senha incorreta");
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Senha incorreta."
      });
      return false;
    } catch (error) {
      console.error('Erro ao validar senha:', error);
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

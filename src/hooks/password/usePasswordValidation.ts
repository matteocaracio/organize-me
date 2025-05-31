
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const usePasswordValidation = (
  password: string,
  setNotePassword: (value: string | null) => void
) => {
  const validatePassword = async (password: string): Promise<boolean> => {
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
      
      // Get current user
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Erro ao obter sessão:", sessionError);
        throw sessionError;
      }
      
      if (!session.session?.user) {
        console.error("Nenhum usuário autenticado");
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para visualizar notas protegidas."
        });
        return false;
      }
      
      const userId = session.session.user.id;
      console.log("Buscando senha global para o usuário:", userId);
      
      // Get the user's profile with note_password in a simpler query
      const { data, error } = await supabase
        .from('profiles')
        .select('note_password')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível verificar a senha. Tente novamente."
        });
        return false;
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

      console.log("Comparando senhas fornecidas:", password.length, "caracteres com", data.note_password.length, "caracteres");
      
      // Direct comparison of passwords
      if (data.note_password === password) {
        console.log("Senha válida! Definindo senha da nota.");
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
        description: "Não foi possível validar a senha. Tente novamente."
      });
      return false;
    }
  };

  return {
    validatePassword,
  };
};


import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePasswordValidation = (
  password: string,
  setNotePassword: (value: string | null) => void
) => {
  const { toast } = useToast();

  const validatePassword = async (): Promise<boolean> => {
    try {
      console.time("validatePassword");
      
      if (!password || !password.trim()) {
        console.error("Senha vazia fornecida");
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Digite uma senha para continuar."
        });
        return false;
      }
      
      // Get current user - using concise query
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        console.error("Nenhum usuário autenticado");
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para visualizar notas protegidas."
        });
        return false;
      }
      
      const userId = userData.user.id;
      
      // Otimizando a query para ser mais direta e eficiente
      const { data, error } = await supabase
        .from('profiles')
        .select('note_password')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar perfil:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível verificar a senha. Tente novamente."
        });
        return false;
      }
      
      if (!data?.note_password) {
        console.error("Senha global não configurada");
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não há senha global configurada. Configure uma senha nas opções de notas."
        });
        return false;
      }
      
      // Comparação direta de senhas
      if (data.note_password === password) {
        setNotePassword(password);
        console.timeEnd("validatePassword");
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

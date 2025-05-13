
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useNotePassword = () => {
  const [password, setPassword] = useState("");
  const [notePassword, setNotePassword] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [hasGlobalPassword, setHasGlobalPassword] = useState(false);
  
  // Check if global password is set on component mount
  useEffect(() => {
    checkGlobalPassword();
  }, []);
  
  const checkGlobalPassword = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('note_password')
        .eq('id', user.user.id)
        .single();

      if (error) {
        throw error;
      }

      const hasPassword = data && data.note_password !== null;
      setHasGlobalPassword(hasPassword);
      
      if (hasPassword) {
        // Use a placeholder to indicate a password exists without revealing it
        setNotePassword("PASSWORD_EXISTS");
      } else {
        setNotePassword(null);
      }
    } catch (error) {
      console.error('Error checking global password:', error);
    }
  };

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
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
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

  return {
    password,
    setPassword,
    notePassword,
    setNotePassword,
    validatePassword,
    saveGlobalPassword,
    // New password update fields
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordMismatch,
    validateAndUpdateGlobalPassword,
    hasGlobalPassword,
    checkGlobalPassword,
  };
};


import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useGlobalPasswordCheck = (
  setHasGlobalPassword: (value: boolean) => void,
  setNotePassword: (value: string | null) => void
) => {
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

  return { checkGlobalPassword };
};

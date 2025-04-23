
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@/components/notes/types";

export const useFetchNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const { toast } = useToast();

  const fetchNotes = async (showDeleted: boolean = false) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      let query = supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (showDeleted) {
        query = query.not('deleted', 'is', null);
      } else {
        query = query.is('deleted', null);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        const formattedNotes: Note[] = data.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content || '',
          date: new Date(note.updated_at),
          isPinned: !!note.is_pinned,
          isProtected: !!note.is_protected,
          deletedAt: note.deleted ? new Date(note.deleted) : undefined,
        }));
        setNotes(formattedNotes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as notas."
      });
    }
  };

  return { notes, setNotes, fetchNotes };
};

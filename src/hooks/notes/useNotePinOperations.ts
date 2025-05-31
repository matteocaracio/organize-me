
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@/components/notes/types";

export const useNotePinOperations = (
  notes: Note[],
 setNotes: (notes: Note[]) => void,
 setRefresh ?: React.Dispatch<React.SetStateAction<number>>
) => {
  const { toast } = useToast();

  const togglePin = async (id: string) => {
    try {
      const noteToUpdate = notes.find(note => note.id === id);
      if (!noteToUpdate) return false;

      const { error } = await supabase
        .from('notes')
        .update({ is_pinned: !noteToUpdate.isPinned })
        .eq('id', id);

      if (error) throw error;

      setNotes(
        notes.map((note) =>
          note.id === id ? { ...note, isPinned: !note.isPinned } : note
        )
      );

      toast({
        title: "Sucesso",
        description: `Nota ${noteToUpdate.isPinned ? "desafixada" : "fixada"}!`
      });

      setRefresh(prev => prev - 1);
      return true;
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível alterar o status da nota."
      });
      return false;
    }
  };

  return { togglePin };
};

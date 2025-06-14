
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@/components/notes/types";

export const useNoteDeleteOperations = (
  notes: Note[], 
  setNotes: (notes: Note[]) => void,
  setRefresh ?: React.Dispatch<React.SetStateAction<number>>
) => {
  const { toast } = useToast();

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ deleted: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setNotes(notes.map(note =>
        note.id === id ? { ...note, deletedAt: new Date() } : note
      ));

      toast({
        title: "Sucesso",
        description: "Nota movida para a lixeira!"
      });

      setRefresh(prev => prev + 1);

      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível mover a nota para a lixeira."
      });
      return false;
    }
  };

  const permanentlyDeleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotes(notes.filter(note => note.id !== id));

      toast({
        title: "Sucesso",
        description: "Nota excluída permanentemente!"
      });
      setRefresh(prev => prev - 1);
      return true;
    } catch (error) {
      console.error('Error permanently deleting note:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir permanentemente a nota."
      });
      return false;
    }
  };

  const clearTrash = async () => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .not('deleted', 'is', null);

      if (error) throw error;

      setNotes(notes.filter(note => !note.deletedAt));

      toast({
        title: "Sucesso",
        description: "Lixeira esvaziada com sucesso!"
      });

      setRefresh(prev => prev + 1);

      return true;
    } catch (error) {
      console.error('Error clearing trash:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível esvaziar a lixeira."
      });
      return false;
    }
  };

  const restoreNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ deleted: null })
        .eq('id', id);

      if (error) throw error;

      setNotes(notes.filter(note => note.id !== id));

      toast({
        title: "Sucesso",
        description: "Nota restaurada com sucesso!"
      });
      setRefresh(prev => prev + 1);
      return true;
    } catch (error) {
      console.error('Error restoring note:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível restaurar a nota."
      });
      return false;
    }
  };

  return {
    deleteNote,
    permanentlyDeleteNote,
    clearTrash,
    restoreNote,
  };
};

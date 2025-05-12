
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@/components/notes/types";
import type { NoteRow } from "@/types/supabase";

export const useAddOrUpdateNote = (notes: Note[], setNotes: (notes: Note[]) => void) => {
  const { toast } = useToast();

  const addOrUpdateNote = async (
    newNote: { title: string; content: string; isProtected: boolean },
    selectedNote: Note | null
  ) => {
    if (newNote.title.trim() === "") return null;

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para adicionar notas."
        });
        return null;
      }

      const noteData = {
        title: newNote.title,
        content: newNote.content,
        is_pinned: selectedNote?.isPinned || false,
        is_protected: newNote.isProtected,
        updated_at: new Date().toISOString(),
        user_id: user.user.id
      };

      let response;

      if (selectedNote) {
        response = await supabase
          .from('notes')
          .update(noteData)
          .eq('id', selectedNote.id)
          .select()
          .single();
      } else {
        response = await supabase
          .from('notes')
          .insert(noteData)
          .select()
          .single();
      }

      if (response.error) throw response.error;

      if (response.data) {
        const noteRow = response.data as NoteRow;
        const note: Note = {
          id: noteRow.id,
          title: noteRow.title,
          content: noteRow.content || '',
          date: new Date(noteRow.updated_at || ''),
          isPinned: !!noteRow.is_pinned,
          isProtected: !!noteRow.is_protected,
          deletedAt: noteRow.deleted ? new Date(noteRow.deleted) : undefined,
        };

        if (selectedNote) {
          setNotes(notes.map((n) => (n.id === selectedNote.id ? note : n)));
        } else {
          setNotes([note, ...notes]);
        }

        toast({
          title: "Sucesso",
          description: selectedNote ? "Nota atualizada com sucesso!" : "Nota adicionada com sucesso!"
        });
        
        return note;
      }
      return null;
    } catch (error) {
      console.error('Error adding/updating note:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: selectedNote ? "Não foi possível atualizar a nota." : "Não foi possível adicionar a nota."
      });
      return null;
    }
  };

  return { addOrUpdateNote };
};

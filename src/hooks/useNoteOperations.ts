
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@/components/notes/types";

export const useNoteOperations = () => {
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

      if (error) {
        throw error;
      }

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

  const addOrUpdateNote = async (
    newNote: { title: string; content: string; isProtected: boolean },
    selectedNote: Note | null
  ) => {
    if (newNote.title.trim() === "") return;

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

      if (response.error) {
        throw response.error;
      }

      if (response.data) {
        const note: Note = {
          id: response.data.id,
          title: response.data.title,
          content: response.data.content || '',
          date: new Date(response.data.updated_at),
          isPinned: !!response.data.is_pinned,
          isProtected: !!response.data.is_protected,
          deletedAt: response.data.deleted ? new Date(response.data.deleted) : undefined,
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

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ deleted: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setNotes(notes.map(note =>
        note.id === id ? { ...note, deletedAt: new Date() } : note
      ));

      toast({
        title: "Sucesso",
        description: "Nota movida para a lixeira!"
      });
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

  const togglePin = async (id: string) => {
    try {
      const noteToUpdate = notes.find(note => note.id === id);
      if (!noteToUpdate) return false;

      const { error } = await supabase
        .from('notes')
        .update({ is_pinned: !noteToUpdate.isPinned })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setNotes(
        notes.map((note) =>
          note.id === id ? { ...note, isPinned: !note.isPinned } : note
        )
      );

      toast({
        title: "Sucesso",
        description: `Nota ${noteToUpdate.isPinned ? "desafixada" : "fixada"}!`
      });
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

  const restoreNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ deleted: null })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setNotes(notes.filter(note => note.id !== id));

      toast({
        title: "Sucesso",
        description: "Nota restaurada com sucesso!"
      });
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

  const permanentlyDeleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setNotes(notes.filter(note => note.id !== id));

      toast({
        title: "Sucesso",
        description: "Nota excluída permanentemente!"
      });
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

      if (error) {
        throw error;
      }

      setNotes([]);

      toast({
        title: "Sucesso",
        description: "Lixeira esvaziada com sucesso!"
      });
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

  return {
    notes,
    setNotes,
    fetchNotes,
    addOrUpdateNote,
    deleteNote,
    togglePin,
    restoreNote,
    permanentlyDeleteNote,
    clearTrash,
  };
};

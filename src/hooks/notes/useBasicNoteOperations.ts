
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@/components/notes/types";
import type { NoteRow } from "@/types/supabase";

export const useBasicNoteOperations = (
  setRefresh ?: React.Dispatch<React.SetStateAction<number>>
) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const { toast } = useToast();

  const fetchNotes = async (showDeleted: boolean = false) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para visualizar suas notas."
        });
        return [];
      }

      let query = supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.user.id);

      if (showDeleted) {
        query = query.not('deleted', 'is', null);
      } else {
        query = query.is('deleted', null);
      }

      query = query.order('is_pinned', { ascending: false })
                 .order('updated_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (data) {
        const formattedNotes: Note[] = (data as NoteRow[]).map(note => ({
          id: note.id,
          title: note.title,
          content: note.content || '',
          date: new Date(note.updated_at || ''),
          isPinned: !!note.is_pinned,
          isProtected: !!note.is_protected,
          deletedAt: note.deleted ? new Date(note.deleted) : undefined,
        }));
        
        console.log("Notas carregadas:", formattedNotes.length, "showDeleted:", showDeleted);
        setNotes(formattedNotes);
        return formattedNotes;
      }
      return [];
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as notas."
      });
      return [];
    }
  };

  const addOrUpdateNote = async (
    newNote: { title: string; content: string; isProtected: boolean },
    selectedNote: Note | null
  ) => {
    if (newNote.title.trim() === "") {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O título da nota não pode estar vazio."
      });
      return null;
    }

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
        title: newNote.title.trim(),
        content: newNote.content,
        is_pinned: selectedNote?.isPinned || false,
        is_protected: newNote.isProtected,
        updated_at: new Date().toISOString(),
        user_id: user.user.id
      };

      // First create the note object for instant UI update
      const tempNote: Note = {
        id: selectedNote?.id || crypto.randomUUID(),
        title: noteData.title,
        content: noteData.content || '',
        date: new Date(),
        isPinned: noteData.is_pinned,
        isProtected: noteData.is_protected,
        deletedAt: undefined,
      };

      // Update UI state immediately for a responsive feel
      if (selectedNote) {
        setNotes(prevNotes => prevNotes.map((n) => (n.id === selectedNote.id ? tempNote : n)));
      } else {
        setNotes(prevNotes => [tempNote, ...prevNotes]);
      }

      // Now do the actual database operation
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
        console.error("Erro ao salvar nota:", response.error);
        // Revert the UI change if there was an error
        if (selectedNote) {
          await fetchNotes();
        } else {
          setNotes(prevNotes => prevNotes.filter(n => n.id !== tempNote.id));
        }
        throw response.error;
      }

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

        console.log("Nota salva com sucesso:", note);

        // Update the notes list with the correct data from the server
        if (selectedNote) {
          setNotes(prevNotes => prevNotes.map((n) => (n.id === selectedNote.id ? note : n)));
        } else {
          // For new notes, replace our temporary entry with the real one
          setNotes(prevNotes => [
            note, 
            ...prevNotes.filter(n => n.id !== tempNote.id)
          ]);
        }
        setRefresh(prev => prev + 1);
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

  return {
    notes,
    setNotes,
    fetchNotes,
    addOrUpdateNote,
  };
};

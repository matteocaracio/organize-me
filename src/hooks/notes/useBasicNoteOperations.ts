
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@/components/notes/types";
import type { NoteRow } from "@/types/supabase";

export const useBasicNoteOperations = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchNotes = async (showDeleted: boolean = false) => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para visualizar suas notas."
        });
        setLoading(false);
        return [];
      }

      // Otimização: simplificar a consulta e reduzir o número de operações
      const query = supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.user.id)
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false });

      if (showDeleted) {
        query.not('deleted', 'is', null);
      } else {
        query.is('deleted', null);
      }

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
        setLoading(false);
        return formattedNotes;
      }
      setLoading(false);
      return [];
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as notas."
      });
      setLoading(false);
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
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
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
        user_id: userData.user.id
      };

      // Atualização otimista da UI para resposta imediata
      const tempId = selectedNote?.id || crypto.randomUUID();
      const tempNote: Note = {
        id: tempId,
        title: noteData.title,
        content: noteData.content || '',
        date: new Date(),
        isPinned: !!noteData.is_pinned,
        isProtected: !!noteData.is_protected,
        deletedAt: undefined,
      };

      if (selectedNote) {
        setNotes(prevNotes => prevNotes.map((n) => (n.id === selectedNote.id ? {...tempNote, id: selectedNote.id} : n)));
      } else {
        setNotes(prevNotes => [tempNote, ...prevNotes]);
      }

      // Agora, faça a operação de banco de dados
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
        // Reverter a alteração da UI se houver um erro
        if (selectedNote) {
          setNotes(prevNotes => prevNotes.map((n) => (n.id === selectedNote.id ? selectedNote : n)));
        } else {
          setNotes(prevNotes => prevNotes.filter(n => n.id !== tempId));
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

        // Atualizar a lista de notas com os dados corretos do servidor
        if (selectedNote) {
          setNotes(prevNotes => prevNotes.map((n) => (n.id === selectedNote.id ? note : n)));
        } else {
          // Para notas novas, substitua nossa entrada temporária pela real
          setNotes(prevNotes => [
            note, 
            ...prevNotes.filter(n => n.id !== tempId)
          ]);
        }
        
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
    loading,
    fetchNotes,
    addOrUpdateNote,
  };
};

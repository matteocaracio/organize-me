
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NotesProvider, useNotes } from "@/components/notes/NotesContext";
import SearchBar from "@/components/notes/SearchBar";
import NoteList from "@/components/notes/NoteList";
import ViewNoteDialog from "@/components/notes/ViewNoteDialog";
import NewNoteDialog from "@/components/notes/NewNoteDialog";
import PasswordDialog from "@/components/notes/PasswordDialog";
import DeletedNoteList from "@/components/notes/DeletedNoteList";
import type { Note } from "@/components/notes/types";

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [open, setOpen] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [password, setPassword] = useState("");
  const [notePassword, setNotePassword] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    isProtected: false,
    password: ""
  });

  const { toast } = useToast();

  const fetchNotes = async () => {
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

  const addOrUpdateNote = async () => {
    if (newNote.title.trim() === "") return;

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para adicionar notas."
        });
        return;
      }

      const noteData = {
        title: newNote.title,
        content: newNote.content,
        is_pinned: false,
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
          setNotes(
            notes.map((n) => (n.id === selectedNote.id ? note : n))
          );
        } else {
          setNotes([note, ...notes]);
        }

        setOpen(false);
        setNewNote({ title: "", content: "", isProtected: false, password: "" });
        setSelectedNote(null);
        toast({
          title: "Sucesso",
          description: selectedNote ? "Nota atualizada com sucesso!" : "Nota adicionada com sucesso!"
        });
      }
    } catch (error) {
      console.error('Error adding/updating note:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: selectedNote ? "Não foi possível atualizar a nota." : "Não foi possível adicionar a nota."
      });
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
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível mover a nota para a lixeira."
      });
    }
  };

  const validatePassword = async () => {
    if (!selectedNote) return;

    // Instead of querying note_passwords, we'll check the password in the notes table
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Get the profile with the note_password
      const { data, error } = await supabase
        .from('profiles')
        .select('note_password')
        .eq('id', user.user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data && data.note_password === password) {
        setNotePassword(password);
        setPasswordDialog(false);
        setViewDialog(true);
        toast({
          title: "Sucesso",
          description: "Senha validada com sucesso!"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Senha incorreta."
        });
      }
    } catch (error) {
      console.error('Error validating password:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível validar a senha."
      });
    } finally {
      setPassword("");
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      const noteToUpdate = notes.find(note => note.id === id);
      if (!noteToUpdate) return;

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
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível alterar o status da nota."
      });
    }
  };

  const handleEditNote = async (id: string) => {
    const noteToEdit = notes.find(note => note.id === id);
    if (noteToEdit) {
      setSelectedNote(noteToEdit);
      setNewNote({ 
        title: noteToEdit.title, 
        content: noteToEdit.content, 
        isProtected: noteToEdit.isProtected,
        password: ""
      });
      setOpen(true);
    }
  };

  const handleViewNote = async (id: string) => {
    const noteToView = notes.find(note => note.id === id);
    if (noteToView) {
      setSelectedNote(noteToView);
      if (noteToView.isProtected) {
        setPasswordDialog(true);
      } else {
        setViewDialog(true);
      }
    }
  };
  
  const handleRestoreNote = async (id: string) => {
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
    } catch (error) {
      console.error('Error restoring note:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível restaurar a nota."
      });
    }
  };

  const handlePermanentDelete = async (id: string) => {
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
    } catch (error) {
      console.error('Error permanently deleting note:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir permanentemente a nota."
      });
    }
  };

  const handleClearTrash = async () => {
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
    } catch (error) {
      console.error('Error clearing trash:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível esvaziar a lixeira."
      });
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [showDeleted]);

  useEffect(() => {
    if (notes.length > 0) {
      const filtered = notes.filter((note) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          note.title.toLowerCase().includes(searchTermLower) ||
          note.content.toLowerCase().includes(searchTermLower)
        );
      });
      setNotes(filtered);
    }
  }, [searchTerm]);

  const saveGlobalPassword = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para configurar a senha global."
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ note_password: password })
        .eq('id', user.user.id);

      if (error) {
        throw error;
      }

      setNotePassword(password);
      toast({
        title: "Sucesso",
        description: "Senha global salva com sucesso!"
      });
    } catch (error) {
      console.error('Error saving global password:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar a senha global."
      });
    }
  };

  return (
    <NotesProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Notas</h1>
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Nova Nota
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <SearchBar />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowDeleted(!showDeleted)}
          >
            {showDeleted ? "Ver Notas Ativas" : "Ver Lixeira"}
          </Button>
        </div>

        {showDeleted ? (
          <DeletedNoteList 
            notes={notes} 
            onRestore={handleRestoreNote}
            onDelete={handlePermanentDelete}
            onClearTrash={handleClearTrash}
          />
        ) : (
          <NoteList
            onDelete={deleteNote}
            onEdit={handleEditNote}
            onTogglePin={handleTogglePin}
            onViewNote={handleViewNote}
          />
        )}

        <NewNoteDialog
          open={open}
          onOpenChange={setOpen}
          newNote={newNote}
          onNewNoteChange={(note) => setNewNote({...note, password: newNote.password})}
          onSave={addOrUpdateNote}
          password={notePassword || newNote.password}
          onPasswordChange={(password) => setNewNote({...newNote, password})}
        />

        <ViewNoteDialog
          open={viewDialog}
          onOpenChange={setViewDialog}
          note={selectedNote}
          onEdit={() => {
            setViewDialog(false);
            if (selectedNote) {
              handleEditNote(selectedNote.id);
            }
          }}
        />

        <PasswordDialog
          open={passwordDialog}
          onOpenChange={setPasswordDialog}
          onValidate={validatePassword}
          password={password}
          onPasswordChange={setPassword}
        />
      </div>
    </NotesProvider>
  );
};

export default Notes;

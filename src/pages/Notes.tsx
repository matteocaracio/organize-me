import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NotesProvider } from "@/components/notes/NotesContext";
import SearchBar from "@/components/notes/SearchBar";
import NoteList from "@/components/notes/NoteList";
import ViewNoteDialog from "@/components/notes/ViewNoteDialog";
import NewNoteDialog from "@/components/notes/NewNoteDialog";
import PasswordDialog from "@/components/notes/PasswordDialog";
import GlobalPasswordDialog from "@/components/notes/GlobalPasswordDialog";
import DeletedNoteList from "@/components/notes/DeletedNoteList";
import type { Note } from "@/components/notes/types";

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [open, setOpen] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [globalPasswordDialog, setGlobalPasswordDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [password, setPassword] = useState("");
  const [globalPassword, setGlobalPassword] = useState("");
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
        .order('date', { ascending: false });

      if (showDeleted) {
        query = query.not('deletedAt', 'is', null);
      } else {
        query = query.is('deletedAt', null);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (data) {
        const formattedNotes: Note[] = data.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content,
          date: new Date(note.date),
          isPinned: note.isPinned,
          isProtected: note.isProtected,
          deletedAt: note.deletedAt ? new Date(note.deletedAt) : undefined,
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
        isPinned: false,
        isProtected: newNote.isProtected,
        date: new Date().toISOString(),
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
          content: response.data.content,
          date: new Date(response.data.date),
          isPinned: response.data.isPinned,
          isProtected: response.data.isProtected,
          deletedAt: response.data.deletedAt ? new Date(response.data.deletedAt) : undefined,
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
        .update({ deletedAt: new Date().toISOString() })
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

    try {
      const { data, error } = await supabase
        .from('note_passwords')
        .select('password')
        .eq('note_id', selectedNote.id)
        .single();

      if (error) {
        throw error;
      }

      if (data && data.password === password) {
        setNotePassword(password);
        setPasswordDialog(false);
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
        .update({ isPinned: !noteToUpdate.isPinned })
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

  useEffect(() => {
    fetchNotes();
  }, [showDeleted]);

  useEffect(() => {
    const filtered = notes.filter((note) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        note.title.toLowerCase().includes(searchTermLower) ||
        note.content.toLowerCase().includes(searchTermLower)
      );
    });
    setNotes(filtered);
  }, [notes, searchTerm]);

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
          <DeletedNoteList notes={notes} onRestore={fetchNotes} />
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

        <GlobalPasswordDialog
          open={globalPasswordDialog}
          onOpenChange={setGlobalPasswordDialog}
          onSave={async () => {
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
        
              const { data, error } = await supabase
                .from('user_passwords')
                .upsert(
                  { user_id: user.user.id, password: globalPassword },
                  { onConflict: 'user_id' }
                )
                .select()
                .single();
        
              if (error) {
                throw error;
              }
        
              setNotePassword(globalPassword);
              setGlobalPasswordDialog(false);
              setNotePassword(globalPassword);
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
          }}
          password={globalPassword}
          onPasswordChange={setGlobalPassword}
          isUpdate={!!notePassword}
        />
      </div>
    </NotesProvider>
  );
};

export default Notes;

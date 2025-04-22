import React, { useState, useEffect } from "react";
import { Plus, Search, AlertCircle, Lock, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import NoteCard from "@/components/notes/NoteCard";
import NewNoteDialog from "@/components/notes/NewNoteDialog";
import PasswordDialog from "@/components/notes/PasswordDialog";
import GlobalPasswordDialog from "@/components/notes/GlobalPasswordDialog";
import ViewNoteDialog from "@/components/notes/ViewNoteDialog";
import DeletedNoteList from "@/components/notes/DeletedNoteList";
import type { Note } from "@/components/notes/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Notes = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [deletedNotes, setDeletedNotes] = useState<Note[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [notePassword, setNotePassword] = useState("");
  const [protectedNoteId, setProtectedNoteId] = useState<string | null>(null);
  const [viewNoteDialog, setViewNoteDialog] = useState(false);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [globalPasswordDialog, setGlobalPasswordDialog] = useState(false);
  const [globalPassword, setGlobalPassword] = useState("");
  const [userGlobalPassword, setUserGlobalPassword] = useState("");
  const [setPasswordMode, setSetPasswordMode] = useState(false);
  
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    isProtected: false,
    password: ""
  });

  useEffect(() => {
    fetchNotes();
    fetchDeletedNotes();
    checkGlobalPassword();
  }, []);

  const checkGlobalPassword = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('note_password')
        .eq('id', userData.user.id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // Não encontrado
          throw error;
        }
      }

      if (data && data.note_password) {
        setUserGlobalPassword(data.note_password);
      }
    } catch (error) {
      console.error("Error checking global password:", error);
    }
  };

  const saveGlobalPassword = async () => {
    try {
      if (globalPassword.trim() === "") {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "A senha não pode ser vazia."
        });
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ note_password: globalPassword })
        .eq('id', userData.user.id);

      if (error) throw error;

      setUserGlobalPassword(globalPassword);
      setGlobalPassword("");
      setGlobalPasswordDialog(false);
      
      toast({
        title: "Sucesso",
        description: "Senha global configurada com sucesso!"
      });
    } catch (error) {
      console.error("Error saving global password:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao salvar senha global."
      });
    }
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userData.user.id)
        .is('deleted', null)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedNotes: Note[] = data.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content || "",
          date: new Date(note.updated_at),
          isPinned: note.is_pinned || false,
          isProtected: note.is_protected || false,
          deletedAt: note.deleted ? new Date(note.deleted) : undefined
        }));
        setNotes(formattedNotes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao carregar notas."
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedNotes = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userData.user.id)
        .not('deleted', 'is', null)
        .order('deleted', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedNotes: Note[] = data.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content || "",
          date: new Date(note.updated_at),
          isPinned: false,
          isProtected: note.is_protected || false,
          deletedAt: note.deleted ? new Date(note.deleted) : undefined
        }));
        setDeletedNotes(formattedNotes);
      }
    } catch (error) {
      console.error("Error fetching deleted notes:", error);
    }
  };

  const moveToTrash = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ deleted: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      // Mover a nota da lista principal para a lixeira
      const noteToTrash = notes.find(note => note.id === id);
      if (noteToTrash) {
        setNotes(notes.filter(note => note.id !== id));
        setDeletedNotes([{
          ...noteToTrash,
          deletedAt: new Date()
        }, ...deletedNotes]);
      }
      
      toast({
        title: "Sucesso",
        description: "Nota movida para a lixeira"
      });
    } catch (error) {
      console.error("Error moving note to trash:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao mover nota para a lixeira."
      });
    }
  };

  const restoreFromTrash = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ deleted: null })
        .eq('id', id);

      if (error) throw error;

      // Mover a nota da lixeira para a lista principal
      const noteToRestore = deletedNotes.find(note => note.id === id);
      if (noteToRestore) {
        const { deletedAt, ...restoredNote } = noteToRestore;
        setDeletedNotes(deletedNotes.filter(note => note.id !== id));
        setNotes([restoredNote, ...notes]);
      }
      
      toast({
        title: "Sucesso",
        description: "Nota restaurada com sucesso"
      });
    } catch (error) {
      console.error("Error restoring note:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao restaurar nota."
      });
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDeletedNotes(deletedNotes.filter(note => note.id !== id));
      toast({
        title: "Sucesso",
        description: "Nota excluída permanentemente"
      });
    } catch (error) {
      console.error("Error deleting note permanently:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao excluir nota permanentemente."
      });
    }
  };

  const clearTrash = async () => {
    try {
      const noteIds = deletedNotes.map(note => note.id);
      
      if (noteIds.length === 0) {
        toast({
          title: "Info",
          description: "A lixeira já está vazia."
        });
        return;
      }

      const { error } = await supabase
        .from('notes')
        .delete()
        .in('id', noteIds);

      if (error) throw error;

      setDeletedNotes([]);
      toast({
        title: "Sucesso",
        description: "Lixeira esvaziada com sucesso"
      });
    } catch (error) {
      console.error("Error clearing trash:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao esvaziar a lixeira."
      });
    }
  };

  const viewNote = (id: string) => {
    const noteToView = notes.find(note => note.id === id);
    if (noteToView) {
      // Se a nota for protegida, solicite a senha
      if (noteToView.isProtected) {
        setProtectedNoteId(id);
        setPasswordDialog(true);
        return;
      }
      
      setViewingNote(noteToView);
      setViewNoteDialog(true);
    }
  };

  const editNote = (id: string) => {
    const noteToEdit = notes.find(note => note.id === id);
    if (noteToEdit) {
      // Se a nota for protegida, solicite a senha
      if (noteToEdit.isProtected) {
        setProtectedNoteId(id);
        setPasswordDialog(true);
        return;
      }
      
      setEditingNoteId(id);
      setNewNote({
        title: noteToEdit.title,
        content: noteToEdit.content || "",
        isProtected: noteToEdit.isProtected || false,
        password: userGlobalPassword
      });
      setOpen(true);
    }
  };

  const validatePassword = async () => {
    try {
      if (!protectedNoteId) return;
      
      // Validar com senha global
      if (notePassword === userGlobalPassword) {
        unlockProtectedNote();
        return;
      }
      
      // Verificar senha específica da nota (para compatibilidade)
      const { data, error } = await supabase
        .from('notes')
        .select('password')
        .eq('id', protectedNoteId)
        .single();
      
      if (error) throw error;
      
      if (data && data.password === notePassword) {
        // Senha correta, desbloqueia a nota
        unlockProtectedNote();
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Senha incorreta."
        });
      }
    } catch (error) {
      console.error("Error validating password:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao validar senha."
      });
    }
  };

  const unlockProtectedNote = () => {
    const noteToAccess = notes.find(note => note.id === protectedNoteId);
    if (noteToAccess) {
      if (editingNoteId) {
        setNewNote({
          title: noteToAccess.title,
          content: noteToAccess.content || "",
          isProtected: true,
          password: userGlobalPassword
        });
        setOpen(true);
      } else {
        setViewingNote(noteToAccess);
        setViewNoteDialog(true);
      }
      setPasswordDialog(false);
      setNotePassword("");
    }
  };

  const addOrUpdateNote = async () => {
    if (newNote.title.trim() === "") return;
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para adicionar notas."
        });
        return;
      }

      // Prepara os dados para o Supabase
      const noteData = {
        title: newNote.title,
        content: newNote.content,
        is_protected: newNote.isProtected,
        user_id: userData.user.id
      };

      // Adiciona a senha global se a nota for protegida
      if (newNote.isProtected) {
        if (!userGlobalPassword) {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Configure uma senha global primeiro."
          });
          return;
        }
        Object.assign(noteData, { password: userGlobalPassword });
      }

      let result;
      
      if (editingNoteId) {
        // Atualizando nota existente
        result = await supabase
          .from('notes')
          .update(noteData)
          .eq('id', editingNoteId)
          .select()
          .single();
      } else {
        // Criando nova nota
        result = await supabase
          .from('notes')
          .insert(noteData)
          .select()
          .single();
      }

      const { data, error } = result;
      
      if (error) throw error;

      if (data) {
        const formattedNote: Note = {
          id: data.id,
          title: data.title,
          content: data.content || "",
          date: new Date(data.updated_at),
          isPinned: false,
          isProtected: data.is_protected || false
        };

        if (editingNoteId) {
          // Atualizando a lista de notas
          setNotes(notes.map(note => note.id === editingNoteId ? formattedNote : note));
          toast({
            title: "Sucesso",
            description: "Nota atualizada com sucesso"
          });
        } else {
          // Adicionando nova nota à lista
          setNotes([formattedNote, ...notes]);
          toast({
            title: "Sucesso",
            description: "Nota criada com sucesso"
          });
        }
        
        // Resetando o estado
        setNewNote({
          title: "",
          content: "",
          isProtected: false,
          password: ""
        });
        setOpen(false);
        setEditingNoteId(null);
      }
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao salvar nota."
      });
    }
  };

  const togglePin = async (id: string) => {
    try {
      const noteToUpdate = notes.find(note => note.id === id);
      if (!noteToUpdate) return;
      
      const isCurrentlyPinned = noteToUpdate.isPinned;
      
      const { error } = await supabase
        .from('notes')
        .update({ is_pinned: !isCurrentlyPinned })
        .eq('id', id);

      if (error) throw error;

      setNotes(
        notes.map((note) =>
          note.id === id ? { ...note, isPinned: !note.isPinned } : note
        )
      );
      
      toast({
        title: "Sucesso",
        description: isCurrentlyPinned ? "Nota desafixada" : "Nota fixada"
      });
    } catch (error) {
      console.error("Error toggling pin:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao fixar/desafixar nota."
      });
    }
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.date.getTime() - a.date.getTime();
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="notes">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Notas</h1>
          <div className="w-full sm:w-auto flex gap-2 items-center">
            <TabsList className="mr-2">
              <TabsTrigger value="notes">Notas</TabsTrigger>
              <TabsTrigger value="trash">Lixeira</TabsTrigger>
            </TabsList>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar notas..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              size="sm" 
              onClick={() => {
                if (!userGlobalPassword && !setPasswordMode) {
                  setSetPasswordMode(true);
                  setGlobalPasswordDialog(true);
                } else {
                  setEditingNoteId(null);
                  setNewNote({
                    title: "",
                    content: "",
                    isProtected: false,
                    password: ""
                  });
                  setOpen(true);
                }
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> Nova Nota
            </Button>
            {userGlobalPassword && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSetPasswordMode(true);
                  setGlobalPasswordDialog(true);
                }}
              >
                <Lock className="h-4 w-4 mr-1" /> Alterar Senha
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="notes" className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <p>Carregando notas...</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedNotes.length === 0 ? (
                <div className="text-center p-6 text-muted-foreground col-span-full">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma nota encontrada. Crie uma nota!</p>
                </div>
              ) : (
                sortedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onDelete={moveToTrash}
                    onEdit={editNote}
                    onTogglePin={togglePin}
                    onViewNote={viewNote}
                  />
                ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="trash" className="mt-6">
          <DeletedNoteList
            notes={deletedNotes}
            onRestore={restoreFromTrash}
            onDelete={deleteNote}
            onClearTrash={clearTrash}
          />
        </TabsContent>
      </Tabs>

      <NewNoteDialog
        open={open}
        onOpenChange={setOpen}
        newNote={newNote}
        onNewNoteChange={(note) => setNewNote(note)}
        onSave={addOrUpdateNote}
        password={newNote.password}
        onPasswordChange={(password) => setNewNote({...newNote, password})}
      />

      <PasswordDialog
        open={passwordDialog}
        onOpenChange={setPasswordDialog}
        onValidate={validatePassword}
        password={notePassword}
        onPasswordChange={setNotePassword}
      />

      <GlobalPasswordDialog
        open={globalPasswordDialog}
        onOpenChange={(open) => {
          setGlobalPasswordDialog(open);
          if (!open) setSetPasswordMode(false);
        }}
        onSave={saveGlobalPassword}
        password={globalPassword}
        onPasswordChange={setGlobalPassword}
        isUpdate={Boolean(userGlobalPassword && setPasswordMode)}
      />

      <ViewNoteDialog
        open={viewNoteDialog}
        onOpenChange={setViewNoteDialog}
        note={viewingNote}
        onEdit={() => {
          setViewNoteDialog(false);
          if (viewingNote) editNote(viewingNote.id);
        }}
      />
    </div>
  );
};

export default Notes;

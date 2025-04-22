
import React, { useState, useEffect } from "react";
import { Plus, Search, AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import NoteCard from "@/components/notes/NoteCard";
import NewNoteDialog from "@/components/notes/NewNoteDialog";
import type { Note } from "@/components/notes/types";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

const Notes = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [notePassword, setNotePassword] = useState("");
  const [protectedNoteId, setProtectedNoteId] = useState<string | null>(null);
  
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    isProtected: false,
    password: ""
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedNotes: Note[] = data.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content || "",
          date: new Date(note.updated_at),
          isPinned: false, // We'll implement pinning later
          isProtected: note.is_protected || false
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

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotes(notes.filter(note => note.id !== id));
      toast({
        title: "Sucesso",
        description: "Nota excluída com sucesso"
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao excluir nota."
      });
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
        password: ""
      });
      setOpen(true);
    }
  };

  const validatePassword = async () => {
    try {
      if (!protectedNoteId) return;
      
      const { data, error } = await supabase
        .from('notes')
        .select('password')
        .eq('id', protectedNoteId)
        .single();
      
      if (error) throw error;
      
      if (data && data.password === notePassword) {
        // Senha correta, abre o editor
        const noteToEdit = notes.find(note => note.id === protectedNoteId);
        if (noteToEdit) {
          setEditingNoteId(protectedNoteId);
          setNewNote({
            title: noteToEdit.title,
            content: noteToEdit.content || "",
            isProtected: true,
            password: notePassword
          });
          setOpen(true);
          setPasswordDialog(false);
          setNotePassword("");
        }
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

      // Adiciona a senha se a nota for protegida
      if (newNote.isProtected && newNote.password) {
        Object.assign(noteData, { password: newNote.password });
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
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    );
    // Implementaremos a persistência do estado de pin mais tarde
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

  const handleNewNoteChange = (note: typeof newNote) => {
    setNewNote(note);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Notas</h1>
        <div className="w-full sm:w-auto flex gap-2 items-center">
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
          <Button size="sm" onClick={() => {
            setEditingNoteId(null);
            setNewNote({
              title: "",
              content: "",
              isProtected: false,
              password: ""
            });
            setOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-1" /> Nova Nota
          </Button>
        </div>
      </div>

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
                onDelete={deleteNote}
                onEdit={editNote}
                onTogglePin={togglePin}
              />
            ))
          )}
        </div>
      )}

      <NewNoteDialog
        open={open}
        onOpenChange={setOpen}
        newNote={{
          title: newNote.title,
          content: newNote.content,
          isProtected: newNote.isProtected
        }}
        onNewNoteChange={(note) => handleNewNoteChange({
          ...newNote,
          title: note.title,
          content: note.content,
          isProtected: note.isProtected
        })}
        onSave={addOrUpdateNote}
        password={newNote.password}
        onPasswordChange={(password) => setNewNote({...newNote, password})}
      />

      {/* Dialog para solicitar senha */}
      <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nota Protegida</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center mb-4">
              <Lock className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Esta nota está protegida por senha. Digite a senha para continuar.
            </p>
            <Input
              type="password"
              placeholder="Digite a senha"
              value={notePassword}
              onChange={(e) => setNotePassword(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setPasswordDialog(false);
              setNotePassword("");
            }}>
              Cancelar
            </Button>
            <Button onClick={validatePassword}>Continuar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notes;

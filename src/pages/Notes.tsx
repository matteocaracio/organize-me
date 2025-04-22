
import React, { useState, useEffect } from "react";
import { Plus, Search, AlertCircle, Lock, Eye, Trash2 } from "lucide-react";
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
        .is('deleted', null) // Somente notas não excluídas
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedNotes: Note[] = data.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content || "",
          date: new Date(note.updated_at),
          isPinned: note.is_pinned || false,
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

  const fetchDeletedNotes = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userData.user.id)
        .not('deleted', 'is', null) // Somente notas excluídas
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

  const handleNewNoteChange = (note: typeof newNote) => {
    setNewNote(note);
  };

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
            <Button size="sm" onClick={() => {
              if (!userGlobalPassword && setPasswordMode === false) {
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
            }}>
              <Plus className="h-4 w-4 mr-1" /> Nova Nota
            </Button>
            {userGlobalPassword ? (
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
            ) : null}
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Lixeira</h2>
            {deletedNotes.length > 0 && (
              <Button 
                variant="destructive" 
                onClick={clearTrash}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Limpar Lixeira
              </Button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deletedNotes.length === 0 ? (
              <div className="text-center p-6 text-muted-foreground col-span-full">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>A lixeira está vazia.</p>
              </div>
            ) : (
              deletedNotes.map((note) => (
                <Card key={note.id} className="card-hover opacity-70">
                  <CardContent className="p-4 pt-6">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg truncate">{note.title}</h3>
                      <div className="flex items-center">
                        {note.isProtected && (
                          <Lock className="h-4 w-4 mr-1 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="h-24 overflow-hidden">
                      <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4">
                        {note.content}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 py-2 text-xs text-muted-foreground border-t flex justify-between">
                    <span>
                      Excluída em {note.deletedAt?.toLocaleDateString('pt-BR')}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() => restoreFromTrash(note.id)}
                      >
                        Restaurar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                        onClick={() => deleteNote(note.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

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

      {/* Dialog para visualizar nota */}
      <Dialog open={viewNoteDialog} onOpenChange={setViewNoteDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingNote?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            <p className="whitespace-pre-line">{viewingNote?.content}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewNoteDialog(false)}>
              Fechar
            </Button>
            {viewingNote && (
              <Button onClick={() => {
                setViewNoteDialog(false);
                editNote(viewingNote.id);
              }}>
                Editar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      {/* Dialog para configurar senha global */}
      <Dialog 
        open={globalPasswordDialog} 
        onOpenChange={(open) => {
          setGlobalPasswordDialog(open);
          if (!open) setSetPasswordMode(false);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {userGlobalPassword && setPasswordMode 
                ? "Alterar Senha Global" 
                : "Configurar Senha Global"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center mb-4">
              <Lock className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {userGlobalPassword && setPasswordMode 
                ? "Esta senha será usada para proteger todas as suas notas."
                : "Configure uma senha global para proteger suas notas. Você precisará dessa senha para acessar notas protegidas."}
            </p>
            <Input
              type="password"
              placeholder="Digite a senha global"
              value={globalPassword}
              onChange={(e) => setGlobalPassword(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setGlobalPasswordDialog(false);
              setGlobalPassword("");
              setSetPasswordMode(false);
            }}>
              Cancelar
            </Button>
            <Button onClick={saveGlobalPassword}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notes;

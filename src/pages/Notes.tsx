import React, { useState } from "react";
import { Plus, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import NoteCard from "@/components/notes/NoteCard";
import NewNoteDialog from "@/components/notes/NewNoteDialog";
import type { Note } from "@/components/notes/types";

const Notes = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Ideias para o projeto final",
      content: "1. Implementar autenticação\n2. Criar dashboard interativo\n3. Adicionar notificações\n4. Melhorar a interface mobile",
      date: new Date(2025, 3, 15),
      isPinned: true,
      isProtected: false
    },
    {
      id: "2",
      title: "Informações pessoais",
      content: "Dados importantes, senhas e contatos",
      date: new Date(2025, 3, 10),
      isPinned: false,
      isProtected: true
    },
    {
      id: "3",
      title: "Lista de livros para ler",
      content: "- Clean Code\n- Design Patterns\n- Refactoring\n- Domain-Driven Design",
      date: new Date(2025, 3, 5),
      isPinned: false,
      isProtected: false
    }
  ]);
  
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    isProtected: false
  });

  const deleteNote = async (id: string) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete note"
      });
      return;
    }

    setNotes(notes.filter(note => note.id !== id));
    toast({
      title: "Success",
      description: "Note deleted successfully"
    });
  };

  const editNote = (id: string) => {
    const noteToEdit = notes.find(note => note.id === id);
    if (noteToEdit) {
      setNewNote({
        title: noteToEdit.title,
        content: noteToEdit.content || "",
        isProtected: noteToEdit.isProtected || false
      });
      setOpen(true);
    }
  };

  const addNote = () => {
    if (newNote.title.trim() === "") return;
    
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      date: new Date(),
      isPinned: false,
      isProtected: newNote.isProtected
    };
    
    setNotes([note, ...notes]);
    setNewNote({
      title: "",
      content: "",
      isProtected: false
    });
    setOpen(false);
  };

  const togglePin = (id: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    );
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
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Nova Nota
          </Button>
        </div>
      </div>

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

      <NewNoteDialog
        open={open}
        onOpenChange={setOpen}
        newNote={newNote}
        onNewNoteChange={setNewNote}
        onSave={addNote}
      />
    </div>
  );
};

export default Notes;

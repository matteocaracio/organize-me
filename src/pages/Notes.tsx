
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotesProvider } from "@/components/notes/NotesContext";
import SearchBar from "@/components/notes/SearchBar";
import NoteList from "@/components/notes/NoteList";
import ViewNoteDialog from "@/components/notes/ViewNoteDialog";
import NewNoteDialog from "@/components/notes/NewNoteDialog";
import PasswordDialog from "@/components/notes/PasswordDialog";
import DeletedNoteList from "@/components/notes/DeletedNoteList";
import type { Note } from "@/components/notes/types";
import { useNotePassword } from "@/hooks/useNotePassword";
import { useNoteOperations } from "@/hooks/useNoteOperations";
import { useNoteFilters } from "@/hooks/useNoteFilters";

const Notes = () => {
  const [open, setOpen] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    isProtected: false,
    password: ""
  });

  const {
    password,
    setPassword,
    notePassword,
    validatePassword,
  } = useNotePassword();

  const {
    notes,
    fetchNotes,
    addOrUpdateNote,
    deleteNote,
    togglePin,
    restoreNote,
    permanentlyDeleteNote,
    clearTrash,
  } = useNoteOperations();

  const {
    searchTerm,
    setSearchTerm,
    filteredNotes,
  } = useNoteFilters(notes);

  useEffect(() => {
    fetchNotes(showDeleted);
  }, [showDeleted]);

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

  const handleSaveNote = async () => {
    const savedNote = await addOrUpdateNote(newNote, selectedNote);
    if (savedNote) {
      setOpen(false);
      setNewNote({ title: "", content: "", isProtected: false, password: "" });
      setSelectedNote(null);
    }
  };

  const handlePasswordValidation = async () => {
    const isValid = await validatePassword();
    if (isValid) {
      setPasswordDialog(false);
      setViewDialog(true);
    }
  };

  const handleNewNoteChange = (note: { title: string; content: string; isProtected: boolean }) => {
    setNewNote({
      ...newNote,
      title: note.title,
      content: note.content,
      isProtected: note.isProtected
    });
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
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
            notes={filteredNotes}
            onRestore={restoreNote}
            onDelete={permanentlyDeleteNote}
            onClearTrash={clearTrash}
          />
        ) : (
          <NoteList
            onDelete={deleteNote}
            onEdit={handleEditNote}
            onTogglePin={togglePin}
            onViewNote={handleViewNote}
          />
        )}

        <NewNoteDialog
          open={open}
          onOpenChange={setOpen}
          newNote={newNote}
          onNewNoteChange={handleNewNoteChange}
          onSave={handleSaveNote}
          password={notePassword}
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
          onValidate={handlePasswordValidation}
          password={password}
          onPasswordChange={setPassword}
        />
      </div>
    </NotesProvider>
  );
};

export default Notes;

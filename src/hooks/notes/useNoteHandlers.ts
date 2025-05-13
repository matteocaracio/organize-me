
import { useNoteOperations } from "@/hooks/notes/useNoteOperations";
import { useNotePassword } from "@/hooks/useNotePassword";
import type { Note } from "@/components/notes/types";

export const useNoteHandlers = (
  setNewNoteDialog: (value: boolean) => void,
  setPasswordDialog: (value: boolean) => void,
  setViewDialog: (value: boolean) => void,
  selectedNote: Note | null,
  setSelectedNote: (note: Note | null) => void,
  newNote: any,
  setNewNote: (note: any) => void
) => {
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
    password,
    setPassword,
    validatePassword,
  } = useNotePassword();

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
      setNewNoteDialog(true);
    }
  };

  const handleSaveNote = async () => {
    const savedNote = await addOrUpdateNote(newNote, selectedNote);
    if (savedNote) {
      setNewNoteDialog(false);
      setNewNote({ title: "", content: "", isProtected: false, password: "" });
      setSelectedNote(null);
      // Atualiza a lista de notas após salvar
      await fetchNotes();
    }
  };

  const handlePasswordValidation = async () => {
    const isValid = await validatePassword();
    if (isValid) {
      setPasswordDialog(false);
      setViewDialog(true);
    }
  };

  return {
    handleViewNote,
    handleEditNote,
    handleSaveNote,
    handlePasswordValidation,
    deleteNote,
    togglePin,
    restoreNote,
    permanentlyDeleteNote,
    clearTrash,
    fetchNotes
  };
};


import React, { useState, useEffect } from "react";
import { NotesProvider } from "@/components/notes/NotesContext";
import NoteList from "@/components/notes/NoteList";
import DeletedNoteList from "@/components/notes/DeletedNoteList";
import type { Note } from "@/components/notes/types";
import { useNotePassword } from "@/hooks/useNotePassword";
import { useNoteOperations } from "@/hooks/notes/useNoteOperations";
import { useNoteFilters } from "@/hooks/useNoteFilters";
import { supabase } from "@/integrations/supabase/client";
import NotesHeader from "@/components/notes/NotesHeader";
import NotesToolbar from "@/components/notes/NotesToolbar";
import NotesDialogs from "@/components/notes/NotesDialogs";

const Notes = () => {
  const [newNoteDialog, setNewNoteDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [globalPasswordDialog, setGlobalPasswordDialog] = useState(false);
  const [passwordUpdateDialog, setPasswordUpdateDialog] = useState(false);
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [hasGlobalPassword, setHasGlobalPassword] = useState<boolean | null>(null);
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
    saveGlobalPassword,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordMismatch,
    validateAndUpdateGlobalPassword
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
    const checkGlobalPassword = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('note_password')
        .eq('id', user.user.id)
        .single();

      if (!error) {
        setHasGlobalPassword(!!data?.note_password);
      }
    };

    checkGlobalPassword();
  }, [globalPasswordDialog, passwordUpdateDialog]);

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
      setNewNoteDialog(true);
    }
  };

  const handleSaveNote = async () => {
    const savedNote = await addOrUpdateNote(newNote, selectedNote);
    if (savedNote) {
      setNewNoteDialog(false);
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

  return (
    <NotesProvider>
      <div className="space-y-6">
        <NotesHeader
          hasGlobalPassword={hasGlobalPassword}
          onNewNote={() => setNewNoteDialog(true)}
          onChangePassword={() => {
            setPasswordUpdateDialog(true);
          }}
          onConfigurePassword={() => setGlobalPasswordDialog(true)}
        />

        <NotesToolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showDeleted={showDeleted}
          onToggleDeleted={() => setShowDeleted(!showDeleted)}
        />

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
            notes={filteredNotes}
          />
        )}

        <NotesDialogs
          viewDialog={viewDialog}
          setViewDialog={setViewDialog}
          selectedNote={selectedNote}
          onEditNote={() => {
            setViewDialog(false);
            if (selectedNote) {
              handleEditNote(selectedNote.id);
            }
          }}
          newNoteDialog={newNoteDialog}
          setNewNoteDialog={setNewNoteDialog}
          newNote={newNote}
          onNewNoteChange={(note) => setNewNote({
            ...newNote,
            title: note.title,
            content: note.content,
            isProtected: note.isProtected
          })}
          onSaveNote={handleSaveNote}
          password={password}
          passwordDialog={passwordDialog}
          setPasswordDialog={setPasswordDialog}
          onValidatePassword={handlePasswordValidation}
          onPasswordChange={setPassword}
          globalPasswordDialog={globalPasswordDialog}
          setGlobalPasswordDialog={setGlobalPasswordDialog}
          onSaveGlobalPassword={saveGlobalPassword}
          isUpdatePassword={isUpdatePassword}
          setIsUpdatePassword={setIsUpdatePassword}
          // New props for password update
          passwordUpdateDialog={passwordUpdateDialog}
          setPasswordUpdateDialog={setPasswordUpdateDialog}
          currentPassword={currentPassword}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          passwordMismatch={passwordMismatch}
          onCurrentPasswordChange={setCurrentPassword}
          onNewPasswordChange={setNewPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onValidateAndUpdate={validateAndUpdateGlobalPassword}
        />
      </div>
    </NotesProvider>
  );
};

export default Notes;


import React, { useState, useEffect } from "react";
import { NotesProvider } from "@/components/notes/NotesContext";
import NoteList from "@/components/notes/NoteList";
import DeletedNoteList from "@/components/notes/DeletedNoteList";
import { useNotePassword } from "@/hooks/useNotePassword";
import { useNoteFilters } from "@/hooks/useNoteFilters";
import { supabase } from "@/integrations/supabase/client";
import NotesHeader from "@/components/notes/NotesHeader";
import NotesToolbar from "@/components/notes/NotesToolbar";
import NotesDialogs from "@/components/notes/NotesDialogs";
import { useNoteDialogs } from "@/components/notes/hooks/useNoteDialogs";
import { useNoteHandlers } from "@/hooks/notes/useNoteHandlers";
import { useNoteOperations } from "@/hooks/notes/useNoteOperations";

const Notes = () => {
  const [showDeleted, setShowDeleted] = useState(false);
  const [hasGlobalPassword, setHasGlobalPassword] = useState<boolean | null>(null);
  
  const { notes, fetchNotes } = useNoteOperations();
  
  const {
    newNoteDialog,
    setNewNoteDialog,
    viewDialog,
    setViewDialog,
    passwordDialog,
    setPasswordDialog,
    globalPasswordDialog,
    setGlobalPasswordDialog,
    passwordUpdateDialog,
    setPasswordUpdateDialog,
    isUpdatePassword,
    setIsUpdatePassword,
    selectedNote,
    setSelectedNote,
    newNote,
    setNewNote
  } = useNoteDialogs();

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
    validateAndUpdateGlobalPassword,
    checkGlobalPassword
  } = useNotePassword();

  const {
    handleViewNote,
    handleEditNote,
    handleSaveNote,
    handlePasswordValidation,
    deleteNote,
    togglePin,
    restoreNote,
    permanentlyDeleteNote,
    clearTrash
  } = useNoteHandlers(
    setNewNoteDialog,
    setPasswordDialog,
    setViewDialog,
    selectedNote,
    setSelectedNote,
    newNote,
    setNewNote
  );

  const { searchTerm, setSearchTerm, filteredNotes } = useNoteFilters(notes);

  useEffect(() => {
    const checkPassword = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('note_password')
        .eq('id', user.user.id)
        .single();

      if (!error) {
        setHasGlobalPassword(!!data?.note_password);
        // Run the checkGlobalPassword function to update any state in the hook
        await checkGlobalPassword();
      }
    };

    checkPassword();
  }, [globalPasswordDialog, passwordUpdateDialog]);

  useEffect(() => {
    // Fetch notes initially and when showDeleted changes
    fetchNotes(showDeleted);
  }, [showDeleted, fetchNotes]);

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

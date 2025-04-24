
import React from "react";
import ViewNoteDialog from "./ViewNoteDialog";
import NewNoteDialog from "./NewNoteDialog";
import PasswordDialog from "./PasswordDialog";
import GlobalPasswordDialog from "./GlobalPasswordDialog";
import type { Note } from "./types";

interface NotesDialogsProps {
  viewDialog: boolean;
  setViewDialog: (open: boolean) => void;
  selectedNote: Note | null;
  onEditNote: () => void;
  newNoteDialog: boolean;
  setNewNoteDialog: (open: boolean) => void;
  newNote: {
    title: string;
    content: string;
    isProtected: boolean;
    password: string;
  };
  onNewNoteChange: (note: { title: string; content: string; isProtected: boolean }) => void;
  onSaveNote: () => Promise<void>;
  password: string;
  passwordDialog: boolean;
  setPasswordDialog: (open: boolean) => void;
  onValidatePassword: () => Promise<void>;
  onPasswordChange: (value: string) => void;
  globalPasswordDialog: boolean;
  setGlobalPasswordDialog: (open: boolean) => void;
  onSaveGlobalPassword: () => Promise<boolean>; // Changed from Promise<void> to Promise<boolean>
  isUpdatePassword: boolean;
  setIsUpdatePassword: (value: boolean) => void;
}

const NotesDialogs = ({
  viewDialog,
  setViewDialog,
  selectedNote,
  onEditNote,
  newNoteDialog,
  setNewNoteDialog,
  newNote,
  onNewNoteChange,
  onSaveNote,
  password,
  passwordDialog,
  setPasswordDialog,
  onValidatePassword,
  onPasswordChange,
  globalPasswordDialog,
  setGlobalPasswordDialog,
  onSaveGlobalPassword,
  isUpdatePassword,
  setIsUpdatePassword,
}: NotesDialogsProps) => {
  return (
    <>
      <NewNoteDialog
        open={newNoteDialog}
        onOpenChange={setNewNoteDialog}
        newNote={newNote}
        onNewNoteChange={onNewNoteChange}
        onSave={onSaveNote}
        password={password}
      />

      <ViewNoteDialog
        open={viewDialog}
        onOpenChange={setViewDialog}
        note={selectedNote}
        onEdit={onEditNote}
      />

      <PasswordDialog
        open={passwordDialog}
        onOpenChange={setPasswordDialog}
        onValidate={onValidatePassword}
        password={password}
        onPasswordChange={onPasswordChange}
      />

      <GlobalPasswordDialog
        open={globalPasswordDialog}
        onOpenChange={(open) => {
          setGlobalPasswordDialog(open);
          if (!open) setIsUpdatePassword(false);
        }}
        onSave={onSaveGlobalPassword}
        password={password}
        onPasswordChange={onPasswordChange}
        isUpdate={isUpdatePassword}
      />
    </>
  );
};

export default NotesDialogs;

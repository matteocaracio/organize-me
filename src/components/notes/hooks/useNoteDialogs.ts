
import { useState } from "react";
import type { Note } from "@/components/notes/types";

export const useNoteDialogs = () => {
  const [newNoteDialog, setNewNoteDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [globalPasswordDialog, setGlobalPasswordDialog] = useState(false);
  const [passwordUpdateDialog, setPasswordUpdateDialog] = useState(false);
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    isProtected: false,
    password: ""
  });

  return {
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
  };
};

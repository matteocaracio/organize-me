
import React, { createContext, useContext, useState } from "react";
import type { Note } from "./types";

interface NotesContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showDeleted: boolean;
  setShowDeleted: (show: boolean) => void;
  filteredNotes: Note[];
  setFilteredNotes: (notes: Note[]) => void;
  protectedNoteId: string | null;
  setProtectedNoteId: (id: string | null) => void;
  editingNoteId: string | null;
  setEditingNoteId: (id: string | null) => void;
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [protectedNoteId, setProtectedNoteId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  return (
    <NotesContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        showDeleted,
        setShowDeleted,
        filteredNotes,
        setFilteredNotes,
        protectedNoteId,
        setProtectedNoteId,
        editingNoteId,
        setEditingNoteId,
        selectedNote,
        setSelectedNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};

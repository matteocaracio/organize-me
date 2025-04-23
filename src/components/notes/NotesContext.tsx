
import React, { createContext, useContext, useState } from "react";
import type { Note } from "./types";

interface NotesContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredNotes: Note[];
  setFilteredNotes: (notes: Note[]) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  return (
    <NotesContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        filteredNotes,
        setFilteredNotes,
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


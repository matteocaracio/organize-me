
import { useState, useEffect } from "react";
import type { Note } from "@/components/notes/types";

export const useNoteFilters = (notes: Note[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>(notes);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredNotes(notes);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(lowercaseSearch) ||
          note.content.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredNotes(filtered);
    }
  }, [notes, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredNotes,
  };
};

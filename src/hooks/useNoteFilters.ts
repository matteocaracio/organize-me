
import { useState, useEffect } from "react";
import type { Note } from "@/components/notes/types";

export const useNoteFilters = (allNotes: Note[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>(allNotes);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredNotes(allNotes);
      return;
    }

    const filtered = allNotes.filter((note) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        note.title.toLowerCase().includes(searchTermLower) ||
        note.content.toLowerCase().includes(searchTermLower)
      );
    });
    setFilteredNotes(filtered);
  }, [searchTerm, allNotes]);

  return {
    searchTerm,
    setSearchTerm,
    filteredNotes,
  };
};

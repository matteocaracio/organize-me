
import { useFetchNotes } from "./useFetchNotes";
import { useAddOrUpdateNote } from "./useAddOrUpdateNote";

export const useBasicNoteOperations = () => {
  const { notes, setNotes, fetchNotes } = useFetchNotes();
  const { addOrUpdateNote } = useAddOrUpdateNote(notes, setNotes);

  return {
    notes,
    setNotes,
    fetchNotes,
    addOrUpdateNote,
  };
};

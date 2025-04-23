
import { useBasicNoteOperations } from "./useBasicNoteOperations";
import { useNoteDeleteOperations } from "./useNoteDeleteOperations";
import { useNotePinOperations } from "./useNotePinOperations";

export const useNoteOperations = () => {
  const {
    notes,
    setNotes,
    fetchNotes,
    addOrUpdateNote,
  } = useBasicNoteOperations();

  const {
    deleteNote,
    permanentlyDeleteNote,
    clearTrash,
  } = useNoteDeleteOperations(notes, setNotes);

  const { togglePin } = useNotePinOperations(notes, setNotes);

  return {
    notes,
    setNotes,
    fetchNotes,
    addOrUpdateNote,
    deleteNote,
    togglePin,
    permanentlyDeleteNote,
    clearTrash,
  };
};

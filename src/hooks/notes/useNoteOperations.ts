
import { useBasicNoteOperations } from "./useBasicNoteOperations";
import { useNoteDeleteOperations } from "./useNoteDeleteOperations";
import { useNotePinOperations } from "./useNotePinOperations";

export const useNoteOperations = (
  setRefresh ?: React.Dispatch<React.SetStateAction<number>>
) => {
  const {
    notes,
    setNotes,
    fetchNotes,
    addOrUpdateNote,
  } = useBasicNoteOperations(setRefresh);

  const {
    deleteNote,
    permanentlyDeleteNote,
    clearTrash,
    restoreNote,
  } = useNoteDeleteOperations(notes, setNotes, setRefresh);

  const { togglePin } = useNotePinOperations(notes, setNotes, setRefresh);

  return {
    notes,
    setNotes,
    fetchNotes,
    addOrUpdateNote,
    deleteNote,
    togglePin,
    permanentlyDeleteNote,
    clearTrash,
    restoreNote,
  };
};

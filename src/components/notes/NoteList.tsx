
import { useNotes } from "./NotesContext";
import NoteCard from "./NoteCard";
import EmptyState from "./EmptyState";
import type { Note } from "./types";

interface NoteListProps {
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onTogglePin: (id: string) => void;
  onViewNote: (id: string) => void;
  notes: Note[];
}

const NoteList = ({ onDelete, onEdit, onTogglePin, onViewNote, notes }: NoteListProps) => {
  if (notes.length === 0) {
    return <EmptyState />;
  }

  // Separate pinned and unpinned notes
  const pinnedNotes = notes.filter((note) => note.isPinned);
  const unpinnedNotes = notes.filter((note) => !note.isPinned);

  return (
    <div className="space-y-6">
      {pinnedNotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground">Fixadas</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={onDelete}
                onEdit={onEdit}
                onTogglePin={onTogglePin}
                onViewNote={onViewNote}
              />
            ))}
          </div>
        </div>
      )}
      
      {unpinnedNotes.length > 0 && (
        <div className="space-y-4">
          {pinnedNotes.length > 0 && (
            <h2 className="text-sm font-medium text-muted-foreground">Outras</h2>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unpinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={onDelete}
                onEdit={onEdit}
                onTogglePin={onTogglePin}
                onViewNote={onViewNote}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteList;

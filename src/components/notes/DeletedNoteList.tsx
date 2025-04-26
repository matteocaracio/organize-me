
import React from "react";
import { AlertCircle, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Note } from "./types";

interface DeletedNoteListProps {
  notes: Note[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onClearTrash: () => void;
}

const DeletedNoteList = ({
  notes,
  onRestore,
  onDelete,
  onClearTrash,
}: DeletedNoteListProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Lixeira</h2>
        {notes.length > 0 && (
          <Button variant="destructive" onClick={onClearTrash}>
            <Trash2 className="h-4 w-4 mr-1" /> Limpar Lixeira
          </Button>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.length === 0 ? (
          <div className="text-center p-6 text-muted-foreground col-span-full">
            <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>A lixeira está vazia.</p>
          </div>
        ) : (
          notes.map((note) => (
            <Card key={note.id} className="card-hover opacity-70">
              <CardContent className="p-4 pt-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg truncate">{note.title}</h3>
                  {note.isProtected && <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="h-24 overflow-hidden">
                  {note.isProtected ? (
                    <p className="text-sm text-muted-foreground italic">
                      Esta nota está protegida por senha.
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4">
                      {note.content}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="px-4 py-2 text-xs text-muted-foreground border-t flex justify-between">
                <span>
                  Excluída em {note.deletedAt?.toLocaleDateString('pt-BR')}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => onRestore(note.id)}
                  >
                    Restaurar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                    onClick={() => onDelete(note.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </>
  );
};

export default DeletedNoteList;


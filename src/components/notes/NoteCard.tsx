
import React, { useState } from "react";
import { Lock, MoreVertical, PinIcon, FileEdit, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Note } from "./types";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onTogglePin: (id: string) => void;
  onViewNote: (id: string) => void;
}

const NoteCard = ({ note, onDelete, onEdit, onTogglePin, onViewNote }: NoteCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandToggle = () => {
    // If the note is protected, we need to view it to validate the password first
    if (note.isProtected && !expanded) {
      onViewNote(note.id); // This will trigger the password dialog
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <Card className="card-hover">
      <CardContent className="p-4 pt-6 relative">
        {note.isPinned && (
          <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
            <PinIcon className="h-5 w-5 text-primary" />
          </div>
        )}
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg truncate">{note.title}</h3>
          <div className="flex items-center">
            {note.isProtected && <Lock className="h-4 w-4 mr-1 text-muted-foreground" />}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(note.id)}>
                  <FileEdit className="h-4 w-4 mr-2" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewNote(note.id)}>
                  <Eye className="h-4 w-4 mr-2" /> Ver Nota
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTogglePin(note.id)}>
                  <PinIcon className="h-4 w-4 mr-2" /> 
                  {note.isPinned ? "Desafixar" : "Fixar"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(note.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" /> Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {expanded && (
          <div className="mt-4 overflow-hidden">
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {note.content}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="px-4 py-2 text-xs text-muted-foreground border-t flex justify-between items-center">
        <span>Atualizado em {note.date.toLocaleDateString('pt-BR')}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-xs"
          onClick={handleExpandToggle}
        >
          {expanded ? "Ocultar" : "Expandir"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;

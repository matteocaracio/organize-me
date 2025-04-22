
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Note } from "./types";

interface ViewNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note | null;
  onEdit: () => void;
}

const ViewNoteDialog = ({
  open,
  onOpenChange,
  note,
  onEdit,
}: ViewNoteDialogProps) => {
  if (!note) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{note.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          <p className="whitespace-pre-line">{note.content}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={onEdit}>
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewNoteDialog;


import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NewFlashcardFormData } from "./types";

interface AddFlashcardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newFlashcard: NewFlashcardFormData;
  onNewFlashcardChange: (flashcard: NewFlashcardFormData) => void;
  onAddFlashcard: () => void;
}

const AddFlashcardDialog = ({
  open,
  onOpenChange,
  newFlashcard,
  onNewFlashcardChange,
  onAddFlashcard
}: AddFlashcardDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar novo cartão</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Pergunta</Label>
            <Input
              value={newFlashcard.question}
              onChange={(e) => onNewFlashcardChange({
                ...newFlashcard,
                question: e.target.value
              })}
              placeholder="Digite a pergunta"
            />
          </div>
          <div className="space-y-2">
            <Label>Resposta</Label>
            <Textarea
              value={newFlashcard.answer}
              onChange={(e) => onNewFlashcardChange({
                ...newFlashcard,
                answer: e.target.value
              })}
              placeholder="Digite a resposta"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onAddFlashcard}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFlashcardDialog;

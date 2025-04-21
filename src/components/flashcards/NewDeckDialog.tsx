
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NewDeckFormData } from "./types";

interface NewDeckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newDeck: NewDeckFormData;
  onNewDeckChange: (deck: NewDeckFormData) => void;
  onAddDeck: () => void;
}

const NewDeckDialog = ({
  open,
  onOpenChange,
  newDeck,
  onNewDeckChange,
  onAddDeck,
}: NewDeckDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar novo deck</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Digite o nome do deck"
              value={newDeck.name}
              onChange={(e) => onNewDeckChange({ ...newDeck, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o conteúdo deste deck..."
              value={newDeck.description}
              onChange={(e) => onNewDeckChange({ ...newDeck, description: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onAddDeck}>Criar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewDeckDialog;

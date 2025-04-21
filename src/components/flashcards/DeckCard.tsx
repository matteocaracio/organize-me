
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Layers, MoreVertical, Plus, Repeat, FileEdit, Trash2 } from "lucide-react";
import { Deck } from "./types";

interface DeckCardProps {
  deck: Deck;
  onStudy: (deck: Deck) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddCard: (deck: Deck) => void;
}

const DeckCard = ({ deck, onStudy, onEdit, onDelete, onAddCard }: DeckCardProps) => {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{deck.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAddCard(deck)}>
                <Plus className="h-4 w-4 mr-2" /> Adicionar cartão
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(deck.id)}>
                <FileEdit className="h-4 w-4 mr-2" /> Editar deck
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete(deck.id)}>
                <Trash2 className="h-4 w-4 mr-2" /> Excluir deck
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{deck.description}</p>
        <div className="flex justify-between text-sm mb-2">
          <span>Progresso</span>
          <span>{deck.progress}%</span>
        </div>
        <Progress value={deck.progress} className="h-2" />
        <div className="mt-4 flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Layers className="h-4 w-4 mr-1" />
            <span>{deck.cards.length} cartões</span>
          </div>
          {deck.lastStudied && (
            <div className="flex items-center">
              <Repeat className="h-4 w-4 mr-1" />
              <span>{new Date(deck.lastStudied).toLocaleDateString("pt-BR")}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          className="w-full"
          onClick={() => onStudy(deck)}
          disabled={deck.cards.length === 0}
        >
          Estudar Agora
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeckCard;

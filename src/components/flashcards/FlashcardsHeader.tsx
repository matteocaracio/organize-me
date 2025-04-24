
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FlashcardsHeaderProps {
  totalCardsForToday: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onNewDeck: () => void;
}

const FlashcardsHeader = ({
  totalCardsForToday,
  searchQuery,
  onSearchChange,
  onNewDeck
}: FlashcardsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Flashcards</h1>
        <p className="text-muted-foreground">
          {totalCardsForToday} cartões para revisar hoje
        </p>
      </div>
      <div className="w-full sm:w-auto flex gap-2 items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar decks..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button onClick={onNewDeck}>
          <Plus className="h-4 w-4 mr-2" /> Novo Deck
        </Button>
      </div>
    </div>
  );
};

export default FlashcardsHeader;

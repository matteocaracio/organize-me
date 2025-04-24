
import { Book, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Deck } from "./types";
import DeckCard from "./DeckCard";

interface DeckTabsProps {
  isLoading: boolean;
  totalCardsForToday: number;
  filteredDecks: Deck[];
  onStudy: (deck: Deck) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddCard: (deck: Deck) => void;
}

const DeckTabs = ({
  isLoading,
  totalCardsForToday,
  filteredDecks,
  onStudy,
  onEdit,
  onDelete,
  onAddCard
}: DeckTabsProps) => {
  const getCardsForToday = (deck: Deck) => {
    const today = new Date();
    return deck.cards.filter(card => 
      card.nextReview <= today || !card.nextReview
    ).length;
  };

  return (
    <Tabs defaultValue="today">
      <TabsList className="w-full">
        <TabsTrigger value="today" className="flex-1">
          Para Revisar Hoje
        </TabsTrigger>
        <TabsTrigger value="decks" className="flex-1">
          Seus Decks
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="today" className="mt-4">
        <div className="grid gap-4">
          {isLoading ? (
            <div className="text-center p-6 text-muted-foreground">
              <p>Carregando decks...</p>
            </div>
          ) : totalCardsForToday === 0 ? (
            <div className="text-center p-6 text-muted-foreground">
              <Book className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Você não tem cartões para revisar hoje. Bom trabalho!</p>
            </div>
          ) : (
            filteredDecks.map((deck) => {
              const cardsToday = getCardsForToday(deck);
              if (cardsToday === 0) return null;
              
              return (
                <Card key={deck.id} className="card-hover">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{deck.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {cardsToday} cartões para revisar
                      </p>
                    </div>
                    <Button onClick={() => onStudy(deck)}>
                      Estudar
                    </Button>
                  </CardContent>
                </Card>
              );
            }).filter(Boolean)
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="decks" className="mt-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="text-center p-6 text-muted-foreground col-span-full">
              <p>Carregando decks...</p>
            </div>
          ) : filteredDecks.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground col-span-full">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum deck encontrado. Crie um novo deck!</p>
            </div>
          ) : (
            filteredDecks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                onStudy={onStudy}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddCard={onAddCard}
              />
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DeckTabs;

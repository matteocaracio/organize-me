
import { useState, useEffect } from "react";
import { Plus, Search, Book, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Deck, NewDeckFormData, NewFlashcardFormData } from "@/components/flashcards/types";
import NewDeckDialog from "@/components/flashcards/NewDeckDialog";
import DeckCard from "@/components/flashcards/DeckCard";
import StudyMode from "@/components/flashcards/StudyMode";

const Flashcards = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [studyMode, setStudyMode] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [addingCard, setAddingCard] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newDeck, setNewDeck] = useState<NewDeckFormData>({
    name: "",
    description: ""
  });

  const [newFlashcard, setNewFlashcard] = useState<NewFlashcardFormData>({
    question: "",
    answer: ""
  });

  // Fetch decks from Supabase
  const fetchDecks = async () => {
    try {
      setIsLoading(true);
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        setDecks([]);
        setIsLoading(false);
        return;
      }
      
      const { data: deckData, error: deckError } = await supabase
        .from('flashcard_decks')
        .select('*')
        .eq('user_id', user.user.id);
        
      if (deckError) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os decks."
        });
        console.error(deckError);
        setIsLoading(false);
        return;
      }
      
      // Get cards for each deck
      const decksWithCards = await Promise.all(deckData.map(async (deck) => {
        const { data: cards, error: cardsError } = await supabase
          .from('flashcards')
          .select('*')
          .eq('deck_id', deck.id);
          
        if (cardsError) {
          console.error(cardsError);
          return {
            ...deck,
            cards: [],
            progress: 0
          };
        }
        
        // Format the cards
        const formattedCards = cards.map(card => ({
          id: card.id,
          question: card.question,
          answer: card.answer,
          level: 0,
          nextReview: new Date()
        }));
        
        return {
          id: deck.id,
          name: deck.name,
          description: deck.description || '',
          cards: formattedCards,
          lastStudied: deck.updated_at ? new Date(deck.updated_at) : undefined,
          progress: 0
        };
      }));
      
      setDecks(decksWithCards);
    } catch (error) {
      console.error("Error fetching decks:", error);
      toast({
        variant: "destructive", 
        title: "Erro",
        description: "Falha ao carregar os decks."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const deleteDeck = async (id: string) => {
    try {
      // First delete all flashcards associated with the deck
      const { error: flashcardError } = await supabase
        .from('flashcards')
        .delete()
        .eq('deck_id', id);
        
      if (flashcardError) throw flashcardError;
      
      // Then delete the deck
      const { error: deckError } = await supabase
        .from('flashcard_decks')
        .delete()
        .eq('id', id);
        
      if (deckError) throw deckError;
      
      // Update local state
      setDecks(decks.filter(deck => deck.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Deck excluído com sucesso!"
      });
    } catch (error) {
      console.error("Error deleting deck:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o deck."
      });
    }
  };

  const addFlashcard = async (deckId: string) => {
    if (!newFlashcard.question.trim() || !newFlashcard.answer.trim()) return;

    try {
      const { data, error } = await supabase
        .from('flashcards')
        .insert({
          question: newFlashcard.question,
          answer: newFlashcard.answer,
          deck_id: deckId
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local state
      setDecks(decks.map(deck => {
        if (deck.id === deckId) {
          return {
            ...deck,
            cards: [...deck.cards, {
              id: data.id,
              question: data.question,
              answer: data.answer,
              level: 0,
              nextReview: new Date()
            }]
          };
        }
        return deck;
      }));
      
      setNewFlashcard({ question: "", answer: "" });
      setAddingCard(false);
      
      toast({
        title: "Sucesso",
        description: "Cartão adicionado com sucesso!"
      });
    } catch (error) {
      console.error("Error adding flashcard:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar o cartão."
      });
    }
  };

  const addDeck = async () => {
    if (newDeck.name.trim() === "") return;
    
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para criar um deck."
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('flashcard_decks')
        .insert({
          name: newDeck.name,
          description: newDeck.description,
          user_id: user.user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Add new deck to state
      const newDeckObj: Deck = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        cards: [],
        progress: 0
      };
      
      setDecks([...decks, newDeckObj]);
      setNewDeck({ name: "", description: "" });
      setOpen(false);
      
      toast({
        title: "Sucesso",
        description: "Deck criado com sucesso!"
      });
    } catch (error) {
      console.error("Error adding deck:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar o deck."
      });
    }
  };

  const startStudy = (deck: Deck) => {
    setSelectedDeck(deck);
    setCurrentCard(0);
    setShowAnswer(false);
    setStudyMode(true);
  };

  const nextCard = () => {
    if (!selectedDeck) return;
    
    if (currentCard < selectedDeck.cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    } else {
      setStudyMode(false);
      setSelectedDeck(null);
    }
  };

  const getCardsForToday = (deck: Deck) => {
    const today = new Date();
    return deck.cards.filter(card => 
      card.nextReview <= today || !card.nextReview
    ).length;
  };

  const totalCardsForToday = decks.reduce(
    (total, deck) => total + getCardsForToday(deck), 0
  );

  const filteredDecks = decks.filter(deck => 
    deck.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    deck.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (studyMode && selectedDeck) {
    return (
      <StudyMode
        deck={selectedDeck}
        currentCard={currentCard}
        showAnswer={showAnswer}
        onShowAnswer={() => setShowAnswer(true)}
        onNext={nextCard}
        onExit={() => setStudyMode(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Novo Deck
          </Button>
          <NewDeckDialog
            open={open}
            onOpenChange={setOpen}
            newDeck={newDeck}
            onNewDeckChange={setNewDeck}
            onAddDeck={addDeck}
          />
        </div>
      </div>

      <Dialog open={addingCard} onOpenChange={setAddingCard}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar novo cartão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Pergunta</Label>
              <Input
                value={newFlashcard.question}
                onChange={(e) => setNewFlashcard({
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
                onChange={(e) => setNewFlashcard({
                  ...newFlashcard,
                  answer: e.target.value
                })}
                placeholder="Digite a resposta"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddingCard(false)}>
              Cancelar
            </Button>
            <Button onClick={() => editingDeck && addFlashcard(editingDeck.id)}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              decks.map((deck) => {
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
                      <Button onClick={() => startStudy(deck)}>
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
                  onStudy={startStudy}
                  onEdit={(id) => console.log(`Editing deck with ID: ${id}`)}
                  onDelete={deleteDeck}
                  onAddCard={(deck) => {
                    setEditingDeck(deck);
                    setAddingCard(true);
                  }}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Flashcards;

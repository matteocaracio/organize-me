
import { useState, useEffect } from "react";
import { useFlashcards } from "@/hooks/useFlashcards";
import { Deck, NewDeckFormData, NewFlashcardFormData } from "@/components/flashcards/types";
import NewDeckDialog from "@/components/flashcards/NewDeckDialog";
import StudyMode from "@/components/flashcards/StudyMode";
import FlashcardsHeader from "@/components/flashcards/FlashcardsHeader";
import AddFlashcardDialog from "@/components/flashcards/AddFlashcardDialog";
import DeckTabs from "@/components/flashcards/DeckTabs";

const Flashcards = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [studyMode, setStudyMode] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [addingCard, setAddingCard] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  
  const [newDeck, setNewDeck] = useState<NewDeckFormData>({
    name: "",
    description: ""
  });

  const [newFlashcard, setNewFlashcard] = useState<NewFlashcardFormData>({
    question: "",
    answer: ""
  });

  const {
    decks,
    isLoading,
    fetchDecks,
    deleteDeck,
    addFlashcard,
    addDeck
  } = useFlashcards();

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleAddDeck = async () => {
    if (newDeck.name.trim() === "") return;
    const success = await addDeck(newDeck.name, newDeck.description);
    if (success) {
      setNewDeck({ name: "", description: "" });
      setOpen(false);
    }
  };

  const handleAddFlashcard = async () => {
    if (!editingDeck || !newFlashcard.question.trim() || !newFlashcard.answer.trim()) return;
    const success = await addFlashcard(editingDeck.id, newFlashcard.question, newFlashcard.answer);
    if (success) {
      setNewFlashcard({ question: "", answer: "" });
      setAddingCard(false);
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
      <FlashcardsHeader
        totalCardsForToday={totalCardsForToday}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewDeck={() => setOpen(true)}
      />

      <NewDeckDialog
        open={open}
        onOpenChange={setOpen}
        newDeck={newDeck}
        onNewDeckChange={setNewDeck}
        onAddDeck={handleAddDeck}
      />

      <AddFlashcardDialog
        open={addingCard}
        onOpenChange={setAddingCard}
        newFlashcard={newFlashcard}
        onNewFlashcardChange={setNewFlashcard}
        onAddFlashcard={handleAddFlashcard}
      />

      <DeckTabs
        isLoading={isLoading}
        totalCardsForToday={totalCardsForToday}
        filteredDecks={filteredDecks}
        onStudy={startStudy}
        onEdit={(id) => console.log(`Editing deck with ID: ${id}`)}
        onDelete={deleteDeck}
        onAddCard={(deck) => {
          setEditingDeck(deck);
          setAddingCard(true);
        }}
      />
    </div>
  );
};

export default Flashcards;

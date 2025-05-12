
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Deck, Flashcard } from "@/components/flashcards/types";
import { FlashcardDeckRow, FlashcardRow } from "@/types/supabase";

export const useFlashcards = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [decks, setDecks] = useState<Deck[]>([]);

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
      
      const decksWithCards = await Promise.all((deckData as FlashcardDeckRow[]).map(async (deck) => {
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
        
        const formattedCards = (cards as FlashcardRow[]).map(card => ({
          id: card.id,
          question: card.question,
          answer: card.answer,
          level: card.level || 0,
          nextReview: card.next_review ? new Date(card.next_review) : new Date()
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

  const deleteDeck = async (id: string) => {
    try {
      const { error: deckError } = await supabase
        .from('flashcard_decks')
        .delete()
        .eq('id', id);
        
      if (deckError) throw deckError;
      
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

  const addFlashcard = async (deckId: string, question: string, answer: string) => {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .insert({
          question,
          answer,
          deck_id: deckId
        })
        .select()
        .single();
        
      if (error) throw error;
      
      const newCard: Flashcard = {
        id: data.id,
        question: data.question,
        answer: data.answer,
        level: data.level || 0,
        nextReview: data.next_review ? new Date(data.next_review) : new Date()
      };
      
      setDecks(decks.map(deck => {
        if (deck.id === deckId) {
          return {
            ...deck,
            cards: [...deck.cards, newCard]
          };
        }
        return deck;
      }));
      
      toast({
        title: "Sucesso",
        description: "Cartão adicionado com sucesso!"
      });
      
      return true;
    } catch (error) {
      console.error("Error adding flashcard:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar o cartão."
      });
      return false;
    }
  };

  const addDeck = async (name: string, description: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para criar um deck."
        });
        return false;
      }
      
      const { data, error } = await supabase
        .from('flashcard_decks')
        .insert({
          name,
          description,
          user_id: user.user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      const newDeck: Deck = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        cards: [],
        progress: 0
      };
      
      setDecks([...decks, newDeck]);
      
      toast({
        title: "Sucesso",
        description: "Deck criado com sucesso!"
      });
      
      return true;
    } catch (error) {
      console.error("Error adding deck:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar o deck."
      });
      return false;
    }
  };

  return {
    decks,
    isLoading,
    fetchDecks,
    deleteDeck,
    addFlashcard,
    addDeck
  };
};

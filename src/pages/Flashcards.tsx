
import { useState } from "react";
import { 
  Plus, Search, MoreVertical, Book, Layers, 
  BarChart, Repeat, ChevronLeft, ChevronRight, 
  ThumbsUp, ThumbsDown, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Tipos para flashcards
interface Flashcard {
  id: string;
  question: string;
  answer: string;
  level: number; // 0-5, 0 = novo, 5 = dominado
  nextReview: Date;
}

interface Deck {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  lastStudied?: Date;
  progress: number; // 0-100
}

const Flashcards = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [studyMode, setStudyMode] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  
  const [decks, setDecks] = useState<Deck[]>([
    {
      id: "1",
      name: "Matemática Básica",
      description: "Conceitos fundamentais de matemática",
      cards: [
        {
          id: "101",
          question: "Quanto é 2 + 2?",
          answer: "4",
          level: 3,
          nextReview: new Date(2025, 3, 22)
        },
        {
          id: "102",
          question: "O que é um número primo?",
          answer: "Um número natural maior que 1 que só é divisível por 1 e por ele mesmo.",
          level: 2,
          nextReview: new Date(2025, 3, 21)
        },
        {
          id: "103",
          question: "Qual é a raiz quadrada de 64?",
          answer: "8",
          level: 4,
          nextReview: new Date(2025, 3, 25)
        }
      ],
      lastStudied: new Date(2025, 3, 19),
      progress: 65
    },
    {
      id: "2",
      name: "Vocabulário de Inglês",
      description: "Palavras e frases para conversação",
      cards: [
        {
          id: "201",
          question: "Como se diz 'Olá' em inglês?",
          answer: "Hello",
          level: 5,
          nextReview: new Date(2025, 3, 30)
        },
        {
          id: "202",
          question: "Como se diz 'Obrigado' em inglês?",
          answer: "Thank you",
          level: 4,
          nextReview: new Date(2025, 3, 26)
        }
      ],
      lastStudied: new Date(2025, 3, 20),
      progress: 85
    },
    {
      id: "3",
      name: "Biologia Celular",
      description: "Estrutura e função das células",
      cards: [
        {
          id: "301",
          question: "Qual é a função da mitocôndria?",
          answer: "Produzir energia para a célula através da respiração celular.",
          level: 1,
          nextReview: new Date(2025, 3, 21)
        },
        {
          id: "302",
          question: "O que é o citoplasma?",
          answer: "É o material contido no interior da célula, entre a membrana plasmática e o núcleo.",
          level: 0,
          nextReview: new Date(2025, 3, 21)
        },
        {
          id: "303",
          question: "O que é DNA?",
          answer: "Ácido desoxirribonucleico, a molécula que contém as instruções genéticas para o desenvolvimento e funcionamento de todos os organismos vivos.",
          level: 2,
          nextReview: new Date(2025, 3, 22)
        }
      ],
      progress: 30
    }
  ]);
  
  // Estado para novo deck
  const [newDeck, setNewDeck] = useState({
    name: "",
    description: ""
  });

  // Função para adicionar um novo deck
  const addDeck = () => {
    if (newDeck.name.trim() === "") return;
    
    const deck: Deck = {
      id: Date.now().toString(),
      name: newDeck.name,
      description: newDeck.description,
      cards: [],
      progress: 0
    };
    
    setDecks([...decks, deck]);
    setNewDeck({
      name: "",
      description: ""
    });
    setOpen(false);
  };

  // Filtra decks pela busca
  const filteredDecks = decks.filter(deck => 
    deck.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    deck.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Inicia modo de estudo
  const startStudy = (deck: Deck) => {
    setSelectedDeck(deck);
    setCurrentCard(0);
    setShowAnswer(false);
    setStudyMode(true);
  };

  // Navegação entre cards
  const nextCard = () => {
    if (!selectedDeck) return;
    
    if (currentCard < selectedDeck.cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    } else {
      // Terminou de estudar o deck
      setStudyMode(false);
      setSelectedDeck(null);
    }
  };

  // Contagem de cards para revisar hoje
  const getCardsForToday = (deck: Deck) => {
    const today = new Date();
    return deck.cards.filter(card => 
      card.nextReview <= today || !card.nextReview
    ).length;
  };

  // Total de cards para revisar hoje em todos os decks
  const totalCardsForToday = decks.reduce(
    (total, deck) => total + getCardsForToday(deck), 0
  );

  if (studyMode && selectedDeck) {
    return (
      <div className="flex flex-col h-[calc(100vh-13rem)] justify-between">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setStudyMode(false)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <h2 className="text-lg font-semibold">{selectedDeck.name}</h2>
          <div className="text-sm text-muted-foreground">
            {currentCard + 1} / {selectedDeck.cards.length}
          </div>
        </div>

        <Card className="flex-1 flex flex-col justify-center text-center mx-auto w-full max-w-xl">
          <CardHeader>
            <CardTitle>
              {showAnswer ? "Resposta" : "Pergunta"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 py-6 flex-1 flex items-center justify-center">
            <div className="text-xl">
              {showAnswer 
                ? selectedDeck.cards[currentCard].answer 
                : selectedDeck.cards[currentCard].question
              }
            </div>
          </CardContent>
          <CardFooter className="flex justify-center p-6 gap-4">
            {!showAnswer ? (
              <Button 
                size="lg" 
                onClick={() => setShowAnswer(true)}
                className="w-full"
              >
                Mostrar Resposta
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1"
                  onClick={nextCard}
                >
                  <ThumbsDown className="h-5 w-5 mr-2 text-destructive" />
                  Difícil
                </Button>
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={nextCard}
                >
                  <ThumbsUp className="h-5 w-5 mr-2" />
                  Fácil
                </Button>
              </>
            )}
          </CardFooter>
        </Card>

        <Progress value={(currentCard / selectedDeck.cards.length) * 100} className="mt-4" />
      </div>
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" /> Novo Deck
              </Button>
            </DialogTrigger>
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
                    onChange={(e) => setNewDeck({...newDeck, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Descreva o conteúdo deste deck..."
                    value={newDeck.description}
                    onChange={(e) => setNewDeck({...newDeck, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button onClick={addDeck}>Criar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="decks">
        <TabsList className="w-full">
          <TabsTrigger value="decks" className="flex-1">
            Seus Decks
          </TabsTrigger>
          <TabsTrigger value="today" className="flex-1">
            Para Revisar Hoje
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="decks" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDecks.length === 0 ? (
              <div className="text-center p-6 text-muted-foreground col-span-full">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum deck encontrado. Crie um novo deck!</p>
              </div>
            ) : (
              filteredDecks.map((deck) => (
                <Card key={deck.id} className="card-hover">
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
                          <DropdownMenuItem>Adicionar cartões</DropdownMenuItem>
                          <DropdownMenuItem>Editar deck</DropdownMenuItem>
                          <DropdownMenuItem>Estatísticas</DropdownMenuItem>
                          <DropdownMenuItem>Exportar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {deck.description}
                    </p>
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
                          <span>
                            {new Date(deck.lastStudied).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full" 
                      onClick={() => startStudy(deck)}
                      disabled={deck.cards.length === 0}
                    >
                      Estudar Agora
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="today" className="mt-4">
          <div className="grid gap-4">
            {totalCardsForToday === 0 ? (
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
      </Tabs>
    </div>
  );
};

export default Flashcards;

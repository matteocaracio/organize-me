
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ThumbsDown, ThumbsUp } from "lucide-react";
import { Deck } from "./types";

interface StudyModeProps {
  deck: Deck;
  currentCard: number;
  showAnswer: boolean;
  onShowAnswer: () => void;
  onNext: () => void;
  onExit: () => void;
}

const StudyMode = ({
  deck,
  currentCard,
  showAnswer,
  onShowAnswer,
  onNext,
  onExit,
}: StudyModeProps) => {
  return (
    <div className="flex flex-col h-[calc(100vh-13rem)] justify-between">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="sm" onClick={onExit}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
        <h2 className="text-lg font-semibold">{deck.name}</h2>
        <div className="text-sm text-muted-foreground">
          {currentCard + 1} / {deck.cards.length}
        </div>
      </div>

      <Card className="flex-1 flex flex-col justify-center text-center mx-auto w-full max-w-xl">
        <CardHeader>
          <CardTitle>{showAnswer ? "Resposta" : "Pergunta"}</CardTitle>
        </CardHeader>
        <CardContent className="px-8 py-6 flex-1 flex items-center justify-center">
          <div className="text-xl">
            {showAnswer
              ? deck.cards[currentCard].answer
              : deck.cards[currentCard].question}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center p-6 gap-4">
          {!showAnswer ? (
            <Button size="lg" onClick={onShowAnswer} className="w-full">
              Mostrar Resposta
            </Button>
          ) : (
            <>
              <Button variant="outline" size="lg" className="flex-1" onClick={onNext}>
                <ThumbsDown className="h-5 w-5 mr-2 text-destructive" />
                Difícil
              </Button>
              <Button size="lg" className="flex-1" onClick={onNext}>
                <ThumbsUp className="h-5 w-5 mr-2" />
                Fácil
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      <Progress value={(currentCard / deck.cards.length) * 100} className="mt-4" />
    </div>
  );
};

export default StudyMode;

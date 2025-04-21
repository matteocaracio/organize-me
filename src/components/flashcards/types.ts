
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  level: number;
  nextReview: Date;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  lastStudied?: Date;
  progress: number;
}

export interface NewDeckFormData {
  name: string;
  description: string;
}

export interface NewFlashcardFormData {
  question: string;
  answer: string;
}

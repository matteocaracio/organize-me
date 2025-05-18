
export type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
};

export const EXPENSE_CATEGORIES = [
  "Alimentação", "Entretenimento", "Moradia", "Transporte", "Saúde", 
  "Educação", "Roupas", "Lazer", "Restaurantes", "Assinaturas", 
  "Utilidades", "Tecnologia", "Internet", "Outros"
];

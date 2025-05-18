
import { useState } from "react";
import { Expense } from "./types/expense";
import ExpenseForm from "./expense/ExpenseForm";
import ExpenseSummary from "./expense/ExpenseSummary";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    { 
      id: "1", 
      description: "Supermercado", 
      amount: 250.75, 
      date: "2025-04-20", 
      category: "Alimentação" 
    },
    { 
      id: "2", 
      description: "Netflix", 
      amount: 39.90, 
      date: "2025-04-15", 
      category: "Entretenimento" 
    },
    { 
      id: "3", 
      description: "Conta de luz", 
      amount: 120.35, 
      date: "2025-04-10", 
      category: "Moradia" 
    },
    { 
      id: "4", 
      description: "Combustível", 
      amount: 200.00, 
      date: "2025-04-05", 
      category: "Transporte" 
    },
    { 
      id: "5", 
      description: "Farmácia", 
      amount: 89.75, 
      date: "2025-04-18", 
      category: "Saúde" 
    }
  ]);

  const handleAddExpense = (newExpenseData: Omit<Expense, "id">) => {
    const expense: Expense = {
      ...newExpenseData,
      id: Date.now().toString()
    };
    
    setExpenses([...expenses, expense]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  return (
    <div className="space-y-4">
      <ExpenseForm onAddExpense={handleAddExpense} />
      <ExpenseSummary 
        expenses={expenses} 
        onDeleteExpense={handleDeleteExpense}
      />
    </div>
  );
};

export default ExpenseTracker;

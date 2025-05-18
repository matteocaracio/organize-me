
import { useEffect } from "react";
import ExpenseForm from "./expense/ExpenseForm";
import ExpenseSummary from "./expense/ExpenseSummary";
import { useExpenseOperations } from "@/hooks/finance/useExpenseOperations";
import { Expense } from "./types/expense";
import { Loader2 } from "lucide-react";

const ExpenseTracker = () => {
  const { 
    expenses, 
    loading, 
    fetchExpenses, 
    addExpense, 
    deleteExpense 
  } = useExpenseOperations();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = (newExpenseData: Omit<Expense, "id">) => {
    addExpense(newExpenseData);
  };

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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


import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import ExpenseTable from "./ExpenseTable";
import { Expense } from "../types/expense";

interface ExpenseSummaryProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const ExpenseSummary = ({ expenses, onDeleteExpense }: ExpenseSummaryProps) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suas Despesas</CardTitle>
        <CardDescription>
          Total: R$ {totalExpenses.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ExpenseTable 
          expenses={expenses} 
          totalExpenses={totalExpenses}
          onDeleteExpense={onDeleteExpense}
        />
      </CardContent>
    </Card>
  );
};

export default ExpenseSummary;


import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { Expense, EXPENSE_CATEGORIES } from "../types/expense";

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, "id">) => void;
}

const ExpenseForm = ({ onAddExpense }: ExpenseFormProps) => {
  const [newExpense, setNewExpense] = useState<Omit<Expense, "id">>({
    description: "",
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: ""
  });

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.category || newExpense.amount <= 0) {
      return;
    }
    
    onAddExpense(newExpense);
    
    setNewExpense({
      description: "",
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: ""
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Despesa</CardTitle>
        <CardDescription>Registre suas despesas para acompanhar seus gastos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input 
            placeholder="Descrição"
            value={newExpense.description}
            onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
            className="md:col-span-2"
          />
          <Input 
            type="number" 
            placeholder="Valor"
            value={newExpense.amount || ""}
            onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value)})}
          />
          <Input 
            type="date" 
            value={newExpense.date}
            onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
          />
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={newExpense.category}
            onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
          >
            <option value="">Selecione a categoria</option>
            {EXPENSE_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <Button onClick={handleAddExpense} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;

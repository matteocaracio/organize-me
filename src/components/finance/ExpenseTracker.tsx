
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
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { PlusCircle, Trash2 } from "lucide-react";

type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
};

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
    }
  ]);
  
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
    
    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString()
    };
    
    setExpenses([...expenses, expense]);
    setNewExpense({
      description: "",
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: ""
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-4">
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
            <Input 
              placeholder="Categoria"
              value={newExpense.category}
              onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
            />
            <Button onClick={handleAddExpense} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Suas Despesas</CardTitle>
          <CardDescription>
            Total: R$ {totalExpenses.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor (R$)</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Nenhuma despesa registrada
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.description}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">{expense.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseTracker;

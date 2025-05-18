
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
import { PlusCircle, Trash2, Lightbulb } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
};

const getSavingTips = (category: string, description: string): string => {
  // First check if there are specific tips for common expense descriptions
  const descriptionLower = description.toLowerCase();
  
  if (descriptionLower.includes("wifi") || descriptionLower.includes("internet")) {
    return "Compare planos de diferentes provedores, negocie o valor da mensalidade, ou compartilhe a conexão com vizinhos para dividir custos.";
  }
  
  if (descriptionLower.includes("celular") || descriptionLower.includes("telefone")) {
    return "Avalie se seu plano atual atende suas necessidades ou se há opções mais econômicas. Considere planos familiares se possível.";
  }
  
  if (descriptionLower.includes("streaming") || descriptionLower.includes("netflix") || descriptionLower.includes("spotify")) {
    return "Considere planos compartilhados com família ou amigos, ou alterne entre serviços diferentes a cada mês em vez de assinar vários simultaneamente.";
  }
  
  // If no specific description matches, fall back to category-based tips
  const tips = {
    "Alimentação": "Compare preços em diferentes supermercados, compre itens da estação e planeje as refeições com antecedência.",
    "Entretenimento": "Busque alternativas gratuitas como eventos comunitários ou utilize plataformas de streaming compartilhadas.",
    "Moradia": "Verifique vazamentos, use lâmpadas LED e mantenha os aparelhos desligados quando não estiver usando.",
    "Transporte": "Utilize transporte público, compartilhe caronas ou considere andar a pé/bicicleta para trajetos curtos.",
    "Saúde": "Prefira medicamentos genéricos e faça check-ups regulares para prevenir problemas maiores.",
    "Educação": "Procure por bolsas de estudo, cursos gratuitos online ou desconto para pagamento antecipado.",
    "Roupas": "Espere por promoções sazonais e compre peças versáteis e de qualidade que durem mais.",
    "Lazer": "Procure atividades gratuitas ou com desconto nos dias de semana.",
    "Restaurantes": "Limitar refeições fora de casa a ocasiões especiais e preparar marmitas para o trabalho/escola.",
    "Assinaturas": "Avalie todas as assinaturas mensais e cancele as que você não usa com frequência.",
    "Utilidades": "Compare provedores de serviços, negocie tarifas, e considere alternativas mais econômicas ou planos que melhor se adequam ao seu consumo.",
    "Tecnologia": "Pesquise preços antes de comprar, considere equipamentos recondicionados e avalie se a atualização é realmente necessária."
  };
  
  return tips[category as keyof typeof tips] || "Analise se este gasto é realmente necessário e procure alternativas mais econômicas.";
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

  // Common expense categories for the dropdown
  const categories = [
    "Alimentação", "Entretenimento", "Moradia", "Transporte", "Saúde", 
    "Educação", "Roupas", "Lazer", "Restaurantes", "Assinaturas", 
    "Utilidades", "Tecnologia", "Outros"
  ];

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
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={newExpense.category}
              onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
            >
              <option value="">Selecione a categoria</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
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
                  <TableHead className="text-center">Dicas</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
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
                      <TableCell className="text-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Lightbulb className="h-4 w-4 text-yellow-500" />
                            </TooltipTrigger>
                            <TooltipContent side="left" className="max-w-sm">
                              <p>{getSavingTips(expense.category, expense.description)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
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

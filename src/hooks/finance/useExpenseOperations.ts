
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Expense } from "@/components/finance/types/expense";

export const useExpenseOperations = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para visualizar suas despesas.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.user.id)
        .order("date", { ascending: false });

      if (error) throw error;

      const formattedExpenses: Expense[] = data.map((expense) => ({
        id: expense.id,
        description: expense.description,
        amount: parseFloat(expense.amount),
        date: expense.date,
        category: expense.category,
      }));

      setExpenses(formattedExpenses);
    } catch (error) {
      console.error("Erro ao buscar despesas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas despesas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (newExpense: Omit<Expense, "id">) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para adicionar despesas.",
          variant: "destructive",
        });
        return null;
      }

      // Insert expense with the correct types, converting number to string
      const { data, error } = await supabase
        .from("expenses")
        .insert({
          description: newExpense.description,
          amount: newExpense.amount.toString(), // Convert to string here
          date: newExpense.date,
          category: newExpense.category,
          user_id: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const expense: Expense = {
        id: data.id,
        description: data.description,
        amount: parseFloat(data.amount),
        date: data.date,
        category: data.category,
      };

      setExpenses((prevExpenses) => [expense, ...prevExpenses]);
      toast({
        title: "Sucesso",
        description: "Despesa adicionada com sucesso!",
      });
      
      return expense;
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a despesa.",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
      toast({
        title: "Sucesso",
        description: "Despesa excluída com sucesso!",
      });
      return true;
    } catch (error) {
      console.error("Erro ao excluir despesa:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a despesa.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    expenses,
    loading,
    fetchExpenses,
    addExpense,
    deleteExpense,
    setExpenses
  };
};

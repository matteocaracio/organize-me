
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ExpenseTracker from "@/components/finance/ExpenseTracker";
import InvestmentSimulator from "@/components/finance/InvestmentSimulator";
import MarketData from "@/components/finance/MarketData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Finance = () => {
  const [activeTab, setActiveTab] = useState("expenses");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        toast({
          title: "Acesso restrito",
          description: "Você precisa estar logado para acessar esta página.",
          variant: "destructive",
        });
        navigate("/auth");
      }
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Gestão Financeira</h1>
        <p className="text-muted-foreground">
          Acompanhe suas despesas, simule investimentos e monitore o mercado.
        </p>
      </div>

      <Tabs defaultValue="expenses" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="expenses">Planilha de Gastos</TabsTrigger>
          <TabsTrigger value="investments">Simulador de Investimentos</TabsTrigger>
          <TabsTrigger value="market">Dados do Mercado</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses" className="mt-4">
          <ExpenseTracker />
        </TabsContent>
        
        <TabsContent value="investments" className="mt-4">
          <InvestmentSimulator />
        </TabsContent>
        
        <TabsContent value="market" className="mt-4">
          <MarketData />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;

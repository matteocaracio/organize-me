
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LiveMarketDataProps {
  usdBrlPrice: any;
  stockPrices: any;
  loading: boolean;
  error: string | null;
  lastUpdateTime: Date;
  handleRefresh: () => void;
}

const LiveMarketData = ({ 
  usdBrlPrice, 
  stockPrices, 
  loading, 
  error, 
  lastUpdateTime, 
  handleRefresh 
}: LiveMarketDataProps) => {
  
  const refreshPageAndData = () => {
    // Show loading toast
    toast.loading("Atualizando dados do mercado...");
    
    // First refresh the data
    handleRefresh();
    
    // Then after a small delay to allow data fetch to start, refresh the page
    setTimeout(() => {
      // This will preserve the current URL and maintain authentication state
      window.location.reload();
    }, 500);
  };
  
  return (
    <Card className="bg-muted/40">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Dados de Mercado em Tempo Real</CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={refreshPageAndData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <CardDescription>
          Última atualização: {lastUpdateTime.toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-muted-foreground">USD/BRL</div>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold mr-2">
                {usdBrlPrice ? parseFloat(usdBrlPrice.price).toFixed(2) : "..."}
              </span>
              <div className="flex items-center text-green-500">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+0.35%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-muted-foreground">PETR4.SA</div>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold mr-2">
                {stockPrices && stockPrices["PETR4.SA"] 
                  ? parseFloat(stockPrices["PETR4.SA"].price).toFixed(2) 
                  : "..."}
              </span>
              <div className="flex items-center text-green-500">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+1.27%</span>
              </div>
            </div>
          </div>
        </div>
        
        {error && <div className="text-red-500 text-sm mt-3">{error}</div>}
      </CardContent>
    </Card>
  );
};

export default LiveMarketData;

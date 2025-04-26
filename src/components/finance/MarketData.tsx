
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, RotateCw } from "lucide-react";

type CurrencyData = {
  name: string;
  code: string;
  value: number;
  change: number;
};

const MarketData = () => {
  const [currencies, setCurrencies] = useState<CurrencyData[]>([
    { name: "Dólar", code: "USD", value: 5.25, change: 0.02 },
    { name: "Euro", code: "EUR", value: 5.65, change: -0.015 },
    { name: "Bitcoin", code: "BTC", value: 340000, change: 1.2 }
  ]);
  
  const [stocks, setStocks] = useState<CurrencyData[]>([
    { name: "PETR4", code: "PETR4", value: 36.75, change: 0.5 },
    { name: "VALE3", code: "VALE3", value: 68.42, change: -0.3 },
    { name: "ITUB4", code: "ITUB4", value: 29.84, change: 0.1 },
    { name: "MGLU3", code: "MGLU3", value: 1.95, change: -1.2 },
    { name: "WEGE3", code: "WEGE3", value: 42.56, change: 0.7 }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Simulate data refresh
  const refreshData = () => {
    setLoading(true);
    
    setTimeout(() => {
      // Update with random changes
      const newCurrencies = currencies.map(currency => ({
        ...currency,
        value: parseFloat((currency.value * (1 + (Math.random() * 0.04 - 0.02))).toFixed(2)),
        change: parseFloat((Math.random() * 0.06 - 0.03).toFixed(3))
      }));
      
      const newStocks = stocks.map(stock => ({
        ...stock,
        value: parseFloat((stock.value * (1 + (Math.random() * 0.04 - 0.02))).toFixed(2)),
        change: parseFloat((Math.random() * 0.06 - 0.03).toFixed(3))
      }));
      
      setCurrencies(newCurrencies);
      setStocks(newStocks);
      setLastUpdate(new Date());
      setLoading(false);
    }, 1000);
  };

  // Format as currency
  const formatCurrency = (value: number, code: string) => {
    if (code === "BTC") {
      return `R$ ${value.toLocaleString('pt-BR')}`;
    }
    return `R$ ${value.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Dados do Mercado</h3>
          <p className="text-sm text-muted-foreground">
            Última atualização: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <Button onClick={refreshData} disabled={loading}>
          <RotateCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currencies.map((currency) => (
          <Card key={currency.code} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{currency.name}</CardTitle>
              <CardDescription>{currency.code}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">
                  {formatCurrency(currency.value, currency.code)}
                </span>
                <div className={`flex items-center ${currency.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {currency.change >= 0 ? (
                    <TrendingUp className="mr-1 h-4 w-4" />
                  ) : (
                    <TrendingDown className="mr-1 h-4 w-4" />
                  )}
                  <span>
                    {currency.change >= 0 ? "+" : ""}
                    {(currency.change * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ações Principais</CardTitle>
          <CardDescription>Informações das principais ações da B3</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {stocks.map((stock) => (
              <div 
                key={stock.code}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <div>
                  <div className="font-medium">{stock.name}</div>
                  <div className="text-sm text-muted-foreground">{stock.code}</div>
                </div>
                <div>
                  <div className="text-right font-medium">
                    {formatCurrency(stock.value, "BRL")}
                  </div>
                  <div className={`text-sm text-right flex justify-end items-center ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {stock.change >= 0 ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    <span>
                      {stock.change >= 0 ? "+" : ""}
                      {(stock.change * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketData;

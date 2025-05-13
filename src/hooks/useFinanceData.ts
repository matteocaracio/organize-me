
import { useState, useEffect } from "react";

interface Price {
  price: string;
  symbol: string;
}

export const useFinanceData = () => {
  const [usdBrlPrice, setUsdBrlPrice] = useState<Price | null>(null);
  const [stockPrices, setStockPrices] = useState<Record<string, Price>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = async (symbol: string): Promise<Price> => {
    try {
      const response = await fetch(`https://api.twelvedata.com/price?symbol=${symbol}&apikey=8351c8a8ba8749c2bb16d1dcae0b98cb`);
      if (!response.ok) {
        throw new Error(`Error fetching ${symbol} data`);
      }
      const data = await response.json();
      return { ...data, symbol };
    } catch (err) {
      console.error(`Failed to fetch ${symbol}:`, err);
      throw err;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch USD/BRL exchange rate
      const usdBrl = await fetchPrice("USD/BRL");
      setUsdBrlPrice(usdBrl);

      // Fetch stock prices for common Brazilian stocks
      const stockSymbols = ["PETR4.SA", "VALE3.SA", "ITUB4.SA", "BBDC4.SA", "ABEV3.SA"];
      const stockData: Record<string, Price> = {};

      await Promise.all(
        stockSymbols.map(async (symbol) => {
          try {
            const price = await fetchPrice(symbol);
            stockData[symbol] = price;
          } catch (err) {
            console.error(`Error fetching ${symbol}:`, err);
          }
        })
      );

      setStockPrices(stockData);
    } catch (err) {
      setError("Falha ao carregar dados financeiros");
      console.error("Finance data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    usdBrlPrice,
    stockPrices,
    loading,
    error,
    refreshData: fetchData,
  };
};

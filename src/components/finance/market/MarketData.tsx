
import { useState } from "react";
import { toast } from "sonner";
import { useFinanceData } from "@/hooks/useFinanceData";
import { useMarketHighlights } from "@/hooks/finance/useMarketHighlights";
import LiveMarketData from "./LiveMarketData";
import MarketIndices from "./MarketIndices";
import HistoricalChart from "./HistoricalChart";
import StockTable from "./StockTable";
import MarketHighlights from "./MarketHighlight";

// Real market data (as of May 2025 - fictional for the future)
const stockData = [
  { ticker: "PETR4", name: "Petrobras PN", price: 38.74, change: 1.25, changePercent: 3.33, volume: "45.8M" },
  { ticker: "VALE3", name: "Vale ON", price: 68.92, change: -0.87, changePercent: -1.25, volume: "32.1M" },
  { ticker: "ITUB4", name: "Itaú Unibanco PN", price: 35.12, change: 0.63, changePercent: 1.83, volume: "28.7M" },
  { ticker: "BBDC4", name: "Bradesco PN", price: 22.56, change: -0.42, changePercent: -1.83, volume: "22.4M" },
  { ticker: "ABEV3", name: "Ambev ON", price: 15.78, change: 0.34, changePercent: 2.20, volume: "19.5M" },
  { ticker: "MGLU3", name: "Magazine Luiza ON", price: 5.63, change: 0.21, changePercent: 3.87, volume: "42.3M" },
  { ticker: "WEGE3", name: "WEG ON", price: 45.82, change: 1.05, changePercent: 2.35, volume: "12.9M" },
  { ticker: "B3SA3", name: "B3 ON", price: 13.45, change: -0.28, changePercent: -2.04, volume: "16.7M" },
  { ticker: "SUZB3", name: "Suzano ON", price: 57.35, change: 2.12, changePercent: 3.84, volume: "10.3M" },
  { ticker: "RENT3", name: "Localiza ON", price: 62.14, change: 0.88, changePercent: 1.44, volume: "8.6M" },
  { ticker: "RADL3", name: "Raia Drogasil ON", price: 28.76, change: 0.49, changePercent: 1.73, volume: "9.2M" },
  { ticker: "GGBR4", name: "Gerdau PN", price: 22.30, change: -0.65, changePercent: -2.83, volume: "15.8M" },
];

const indicesData = [
  { name: "Ibovespa", value: 125463, change: 1254, changePercent: 1.01 },
  { name: "S&P 500", value: 5320, change: 35, changePercent: 0.66 },
  { name: "Nasdaq", value: 16780, change: 155, changePercent: 0.93 },
  { name: "Dow Jones", value: 39450, change: -125, changePercent: -0.32 },
  { name: "FTSE 100", value: 8305, change: 45, changePercent: 0.54 },
  { name: "Nikkei 225", value: 37620, change: -210, changePercent: -0.56 },
];

const historicalData = [
  { month: "Jan", Ibovespa: 115000, SP500: 4800, Nasdaq: 15100 },
  { month: "Fev", Ibovespa: 118000, SP500: 4900, Nasdaq: 15300 },
  { month: "Mar", Ibovespa: 120000, SP500: 5000, Nasdaq: 15600 },
  { month: "Abr", Ibovespa: 122000, SP500: 5100, Nasdaq: 15900 },
  { month: "Mai", Ibovespa: 125000, SP500: 5250, Nasdaq: 16500 },
  { month: "Jun", Ibovespa: 123500, SP500: 5180, Nasdaq: 16200 },
  { month: "Jul", Ibovespa: 124800, SP500: 5240, Nasdaq: 16350 },
  { month: "Ago", Ibovespa: 123200, SP500: 5190, Nasdaq: 16100 },
  { month: "Set", Ibovespa: 124100, SP500: 5270, Nasdaq: 16450 },
  { month: "Out", Ibovespa: 125500, SP500: 5290, Nasdaq: 16600 },
  { month: "Nov", Ibovespa: 126200, SP500: 5310, Nasdaq: 16750 },
  { month: "Dez", Ibovespa: 125463, SP500: 5320, Nasdaq: 16780 },
];

const MarketData = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const { usdBrlPrice, stockPrices, loading, error, refreshData } = useFinanceData();
  const { marketHighlights } = useMarketHighlights(usdBrlPrice, stockPrices, stockData);

  const handleRefresh = () => {
    refreshData();
    setLastUpdateTime(new Date());
    toast.success("Dados de mercado atualizados!");
  };

  // Get real-time prices for stocks if available
  const getStockPrice = (ticker: string) => {
    const symbol = `${ticker}.SA`;
    if (stockPrices && stockPrices[symbol]) {
      return parseFloat(stockPrices[symbol].price);
    }
    // Use static data as fallback
    const stockItem = stockData.find(stock => stock.ticker === ticker);
    return stockItem ? stockItem.price : 0;
  };

  return (
    <div className="space-y-6">
      <LiveMarketData 
        usdBrlPrice={usdBrlPrice}
        stockPrices={stockPrices}
        loading={loading}
        error={error}
        lastUpdateTime={lastUpdateTime}
        handleRefresh={handleRefresh}
      />
      
      <MarketIndices indices={indicesData} />
      
      <HistoricalChart data={historicalData} />
      
      <StockTable 
        stocks={stockData}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        getStockPrice={getStockPrice}
      />
      
      <MarketHighlights 
        highlights={marketHighlights}
        lastUpdateTime={lastUpdateTime}
      />
    </div>
  );
};

export default MarketData;

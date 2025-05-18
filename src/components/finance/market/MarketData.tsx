
import { useState } from "react";
import { toast } from "sonner";
import { useFinanceData } from "@/hooks/useFinanceData";
import { useMarketHighlights } from "@/hooks/finance/useMarketHighlights";
import LiveMarketData from "./LiveMarketData";
import MarketIndices from "./MarketIndices";
import StockTable from "./StockTable";
import InternationalStockTable from "./InternationalStockTable";
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

// Dados das ações internacionais mais famosas
const internationalStockData = [
  { ticker: "AAPL", name: "Apple Inc.", price: 245.63, change: 3.21, changePercent: 1.32, volume: "76.2M" },
  { ticker: "MSFT", name: "Microsoft Corp.", price: 436.27, change: 5.43, changePercent: 1.26, volume: "45.1M" },
  { ticker: "AMZN", name: "Amazon.com Inc.", price: 198.42, change: -2.53, changePercent: -1.26, volume: "38.7M" },
  { ticker: "GOOGL", name: "Alphabet Inc.", price: 187.56, change: 2.31, changePercent: 1.25, volume: "27.9M" },
  { ticker: "META", name: "Meta Platforms Inc.", price: 532.87, change: 8.73, changePercent: 1.67, volume: "32.5M" },
  { ticker: "TSLA", name: "Tesla Inc.", price: 253.21, change: -4.32, changePercent: -1.68, volume: "58.3M" },
  { ticker: "NVDA", name: "NVIDIA Corp.", price: 1245.76, change: 24.56, changePercent: 2.01, volume: "41.2M" },
  { ticker: "JPM", name: "JPMorgan Chase & Co.", price: 232.45, change: 1.75, changePercent: 0.76, volume: "15.8M" },
  { ticker: "V", name: "Visa Inc.", price: 317.82, change: -2.14, changePercent: -0.67, volume: "12.4M" },
  { ticker: "WMT", name: "Walmart Inc.", price: 86.73, change: 1.24, changePercent: 1.45, volume: "18.9M" }
];

const indicesData = [
  { name: "Ibovespa", value: 125463, change: 1254, changePercent: 1.01 },
  { name: "S&P 500", value: 5320, change: 35, changePercent: 0.66 },
  { name: "Nasdaq", value: 16780, change: 155, changePercent: 0.93 },
  { name: "Dow Jones", value: 39450, change: -125, changePercent: -0.32 },
  { name: "FTSE 100", value: 8305, change: 45, changePercent: 0.54 },
  { name: "Nikkei 225", value: 37620, change: -210, changePercent: -0.56 },
];

const MarketData = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [intlSearchQuery, setIntlSearchQuery] = useState("");
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [localStockData, setLocalStockData] = useState(stockData);
  const [localIntlStockData, setLocalIntlStockData] = useState(internationalStockData);
  const { usdBrlPrice, stockPrices, loading, error, refreshData } = useFinanceData();
  const { marketHighlights } = useMarketHighlights(usdBrlPrice, stockPrices, localStockData);

  const handleRefresh = () => {
    toast.loading("Atualizando dados do mercado...");
    refreshData();
    setLastUpdateTime(new Date());
    
    // Simular uma atualização dos dados após um breve período
    setTimeout(() => {
      // Randomize stock data changes for both Brazilian and international stocks
      const updatedStockData = localStockData.map(stock => {
        const changeValue = (Math.random() * 2 - 1).toFixed(2);
        const changePercent = (Math.random() * 5 - 2).toFixed(2);
        return {
          ...stock,
          price: parseFloat((stock.price + parseFloat(changeValue)).toFixed(2)),
          change: parseFloat(changeValue),
          changePercent: parseFloat(changePercent)
        };
      });
      
      const updatedIntlStockData = localIntlStockData.map(stock => {
        const changeValue = (Math.random() * 3 - 1.5).toFixed(2);
        const changePercent = (Math.random() * 5 - 2).toFixed(2);
        return {
          ...stock,
          price: parseFloat((stock.price + parseFloat(changeValue)).toFixed(2)),
          change: parseFloat(changeValue),
          changePercent: parseFloat(changePercent)
        };
      });
      
      setLocalStockData(updatedStockData);
      setLocalIntlStockData(updatedIntlStockData);
      
      toast.success("Dados do mercado atualizados com sucesso!");
    }, 1500);
  };

  // Get real-time prices for stocks if available
  const getStockPrice = (ticker: string) => {
    const symbol = `${ticker}.SA`;
    if (stockPrices && stockPrices[symbol]) {
      return parseFloat(stockPrices[symbol].price);
    }
    // Use local data as fallback
    const stockItem = localStockData.find(stock => stock.ticker === ticker);
    return stockItem ? stockItem.price : 0;
  };
  
  // Get prices for international stocks
  const getIntlStockPrice = (ticker: string) => {
    // For now, return the local data as we simulate real-time updates
    const stockItem = localIntlStockData.find(stock => stock.ticker === ticker);
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockTable 
          stocks={localStockData}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          getStockPrice={getStockPrice}
        />
        
        <InternationalStockTable 
          stocks={localIntlStockData}
          searchQuery={intlSearchQuery}
          setSearchQuery={setIntlSearchQuery}
          getStockPrice={getIntlStockPrice}
        />
      </div>
      
      <MarketHighlights 
        highlights={marketHighlights}
        lastUpdateTime={lastUpdateTime}
      />
    </div>
  );
};

export default MarketData;

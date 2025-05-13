
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight, TrendingDown, TrendingUp, RefreshCw } from "lucide-react";
import { useFinanceData } from "@/hooks/useFinanceData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Tipos para os destaques do mercado
interface MarketHighlight {
  title: string;
  description: string;
  timestamp: Date;
}

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

// Base de destaques do mercado
const baseMarketHighlights: MarketHighlight[] = [
  {
    title: "Alta do Petróleo",
    description: "O preço do petróleo subiu 2,5% hoje, impulsionando as ações da Petrobras. Analistas acreditam que a tendência de alta deve se manter nas próximas semanas.",
    timestamp: new Date()
  },
  {
    title: "Exportações em Alta",
    description: "Empresas exportadoras como Vale e Suzano se beneficiam da alta do dólar e do aumento da demanda internacional por commodities.",
    timestamp: new Date()
  },
  {
    title: "Mercado Imobiliário",
    description: "A taxa de juros menor tem impulsionado as ações de construtoras. MRV e Cyrela registram alta de mais de 5% na semana.",
    timestamp: new Date()
  }
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

// Função para gerar destaques aleatórios com base em dados atuais
const generateMarketHighlights = (usdBrlPrice: any, stockPrices: any): MarketHighlight[] => {
  const now = new Date();
  const highlights: MarketHighlight[] = [];
  
  // Destacar dólar
  if (usdBrlPrice) {
    const usdPrice = parseFloat(usdBrlPrice.price);
    highlights.push({
      title: usdPrice > 5.2 ? "Dólar em Alta" : "Dólar Estável",
      description: `Cotação atual do dólar é R$ ${usdPrice.toFixed(2)}. ${
        usdPrice > 5.2 
          ? "Exportadores se beneficiam, mas importações podem ficar mais caras."
          : "Momento favorável para importações e viagens internacionais."
      }`,
      timestamp: now
    });
  }
  
  // Destacar alguma ação relevante
  if (stockPrices && Object.keys(stockPrices).length > 0) {
    const randomStock = Object.keys(stockPrices)[Math.floor(Math.random() * Object.keys(stockPrices).length)];
    const stockInfo = stockData.find(stock => `${stock.ticker}.SA` === randomStock);
    
    if (stockInfo) {
      highlights.push({
        title: `Movimento em ${stockInfo.ticker}`,
        description: `${stockInfo.name} ${stockInfo.changePercent > 0 ? "sobe" : "cai"} ${Math.abs(stockInfo.changePercent).toFixed(2)}%. ${
          stockInfo.changePercent > 0 
            ? "Analistas recomendam atenção à continuidade do movimento."
            : "Investidores avaliam se é momento de entrada na ação."
        }`,
        timestamp: now
      });
    }
  }
  
  // Adicionar um destaque genérico sobre o mercado
  highlights.push({
    title: "Perspectivas de Mercado",
    description: "Analistas projetam um mercado volátil nas próximas semanas devido às expectativas de mudanças nas taxas de juros e indicadores econômicos.",
    timestamp: now
  });
  
  return highlights.length > 0 ? highlights : baseMarketHighlights;
};

const MarketData = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [marketHighlights, setMarketHighlights] = useState<MarketHighlight[]>(baseMarketHighlights);
  const { usdBrlPrice, stockPrices, loading, error, refreshData } = useFinanceData();

  // Filter stocks based on search query
  const filteredStocks = stockData.filter(stock =>
    stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Efeito para atualizar os destaques do mercado
  useEffect(() => {
    if (usdBrlPrice || (stockPrices && Object.keys(stockPrices).length > 0)) {
      const newHighlights = generateMarketHighlights(usdBrlPrice, stockPrices);
      setMarketHighlights(newHighlights);
      setLastUpdateTime(new Date());
    }
  }, [usdBrlPrice, stockPrices]);
  
  // Atualiza os dados a cada 15 minutos
  useEffect(() => {
    // Atualiza inicialmente
    refreshData();
    
    // Configura intervalo de 15 minutos (900000 ms)
    const interval = setInterval(() => {
      refreshData();
      toast.info("Dados de mercado atualizados automaticamente");
    }, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [refreshData]);
  
  const handleRefresh = () => {
    refreshData();
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
      {/* Live Market Data Section */}
      <Card className="bg-muted/40">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Dados de Mercado em Tempo Real</CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleRefresh}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indicesData.map((index, idx) => (
          <Card key={index.name} className={idx === 0 ? "col-span-full md:col-span-1" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">{index.name}</CardTitle>
              <CardDescription>
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-2">{index.value.toLocaleString()}</span>
                  <div className={`flex items-center ${index.changePercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {index.changePercent >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                    <span>
                      {index.change > 0 && '+'}{index.change.toLocaleString()} ({index.changePercent > 0 && '+'}{index.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Histórico de índices (2025)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={historicalData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Ibovespa" fill="#8884d8" name="Ibovespa" />
                <Bar dataKey="SP500" fill="#82ca9d" name="S&P 500" />
                <Bar dataKey="Nasdaq" fill="#ffc658" name="Nasdaq" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ações Brasileiras</CardTitle>
          <CardDescription>
            <input
              type="text"
              placeholder="Buscar ação por código ou nome..."
              className="w-full md:w-64 px-3 py-2 border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead className="text-right">Cotação (R$)</TableHead>
                  <TableHead className="text-right">Variação</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.map((stock) => (
                  <TableRow key={stock.ticker}>
                    <TableCell className="font-medium">{stock.ticker}</TableCell>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell className="text-right">
                      {getStockPrice(stock.ticker).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`flex items-center justify-end ${stock.changePercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {stock.changePercent >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                        <span>
                          {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{stock.volume}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Destaques do Mercado</CardTitle>
            <div className="text-sm text-muted-foreground">
              Atualizado: {lastUpdateTime.toLocaleTimeString()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketHighlights.map((highlight, index) => (
              <div key={index} className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">{highlight.title}</h3>
                <p className="text-sm text-muted-foreground">{highlight.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketData;

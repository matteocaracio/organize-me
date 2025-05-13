
import { useState, useEffect } from "react";
import { MarketHighlight } from "@/components/finance/market/MarketHighlight";

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

// Função para gerar destaques aleatórios com base em dados atuais
export const generateMarketHighlights = (usdBrlPrice: any, stockPrices: any, stockData: any[]): MarketHighlight[] => {
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

export const useMarketHighlights = (usdBrlPrice: any, stockPrices: any, stockData: any[]) => {
  const [marketHighlights, setMarketHighlights] = useState<MarketHighlight[]>(baseMarketHighlights);
  
  useEffect(() => {
    if (usdBrlPrice || (stockPrices && Object.keys(stockPrices).length > 0)) {
      const newHighlights = generateMarketHighlights(usdBrlPrice, stockPrices, stockData);
      setMarketHighlights(newHighlights);
    }
  }, [usdBrlPrice, stockPrices, stockData]);
  
  return { marketHighlights };
};


import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface InternationalStock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
}

interface InternationalStockTableProps {
  stocks: InternationalStock[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  getStockPrice: (ticker: string) => number;
}

const InternationalStockTable = ({ 
  stocks, 
  searchQuery, 
  setSearchQuery, 
  getStockPrice 
}: InternationalStockTableProps) => {
  // Filter stocks based on search query
  const filteredStocks = stocks.filter(stock =>
    stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Internacionais</CardTitle>
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
                <TableHead>Ticker</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead className="text-right">Cotação (USD)</TableHead>
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
  );
};

export default InternationalStockTable;

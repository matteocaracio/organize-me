
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

interface MarketIndicesProps {
  indices: MarketIndex[];
}

const MarketIndices = ({ indices }: MarketIndicesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {indices.map((index, idx) => (
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
  );
};

export default MarketIndices;

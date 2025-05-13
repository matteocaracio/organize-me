
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface MarketHighlight {
  title: string;
  description: string;
  timestamp: Date;
}

interface MarketHighlightsProps {
  highlights: MarketHighlight[];
  lastUpdateTime: Date;
}

const MarketHighlights = ({ highlights, lastUpdateTime }: MarketHighlightsProps) => {
  return (
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
          {highlights.map((highlight, index) => (
            <div key={index} className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">{highlight.title}</h3>
              <p className="text-sm text-muted-foreground">{highlight.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketHighlights;

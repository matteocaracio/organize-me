
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface HistoricalChartProps {
  data: any[];
}

const HistoricalChart = ({ data }: HistoricalChartProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Histórico de índices (2025)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
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
  );
};

export default HistoricalChart;

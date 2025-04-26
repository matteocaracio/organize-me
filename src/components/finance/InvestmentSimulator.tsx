
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

const InvestmentSimulator = () => {
  const [initialAmount, setInitialAmount] = useState<number>(5000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [interestRate, setInterestRate] = useState<number>(0.8); // 0.8% monthly
  const [period, setPeriod] = useState<number>(36); // 36 months
  const [chartData, setChartData] = useState<any[]>([]);

  const calculateInvestment = () => {
    const data = [];
    let accumulated = initialAmount;
    
    for (let month = 0; month <= period; month++) {
      data.push({
        month: month,
        value: accumulated.toFixed(2)
      });
      
      // Calculate interest and add monthly contribution
      accumulated = accumulated * (1 + interestRate / 100) + monthlyContribution;
    }
    
    return data;
  };

  useEffect(() => {
    const data = calculateInvestment();
    setChartData(data);
  }, [initialAmount, monthlyContribution, interestRate, period]);

  const finalValue = chartData.length > 0 ? 
    parseFloat(chartData[chartData.length - 1].value) : 0;
  
  const totalInvested = initialAmount + (monthlyContribution * period);
  const profit = finalValue - totalInvested;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Simulador de Investimentos</CardTitle>
          <CardDescription>
            Calcule o rendimento dos seus investimentos ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Valor Inicial (R$)</label>
              <Input
                type="number"
                value={initialAmount}
                onChange={(e) => setInitialAmount(Number(e.target.value))}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Aporte Mensal (R$)</label>
              <Input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Taxa de Juros Mensal (%)</label>
              <Input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                min="0"
                step="0.1"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Período (meses)</label>
              <Input
                type="number"
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                min="1"
                max="480"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-lg font-semibold">Total Investido</div>
                <div className="text-2xl font-bold text-primary">
                  R$ {totalInvested.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-lg font-semibold">Valor Final</div>
                <div className="text-2xl font-bold text-primary">
                  R$ {finalValue.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-lg font-semibold">Lucro</div>
                <div className="text-2xl font-bold text-primary">
                  R$ {profit.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="h-[300px]">
            <ChartContainer 
              config={{ 
                investment: { label: "Investimento", color: "#8B5CF6" } 
              }}
            >
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month"
                  label={{ value: 'Meses', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis 
                  label={{ value: 'Valor (R$)', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8B5CF6"
                  name="investment"
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentSimulator;

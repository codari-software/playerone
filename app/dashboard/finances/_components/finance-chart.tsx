'use client';

import { BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

interface FinanceChartProps {
  transactions: any[];
}

export function FinanceChart({ transactions }: FinanceChartProps) {
  // Agrupar por mês
  const monthlyData = transactions?.reduce?.((acc: any, transaction: any) => {
    const date = new Date(transaction?.date ?? new Date());
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, ganho: 0, gasto: 0 };
    }
    
    if (transaction?.type === 'INCOME') {
      acc[monthKey].ganho += transaction?.amount ?? 0;
    } else {
      acc[monthKey].gasto += transaction?.amount ?? 0;
    }
    
    return acc;
  }, {}) ?? {};

  const chartData = Object.values(monthlyData)
    .sort((a: any, b: any) => a?.month?.localeCompare?.(b?.month ?? '') ?? 0)
    .slice(-6); // Últimos 6 meses

  if (chartData.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="font-press-start text-[10px] text-gray-700 uppercase">Sem dados históricos de ouro.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-5 h-5 text-blue-400" />
        <h3 className="font-press-start text-[10px] text-white uppercase tracking-wider">Histórico de Loot</h3>
      </div>
      
      <div className="h-[250px] sm:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#555"
              tick={{ fontSize: 10, fontFamily: 'var(--font-vt323)' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#555"
              tick={{ fontSize: 10, fontFamily: 'var(--font-vt323)' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: '#ffffff05' }}
              contentStyle={{
                backgroundColor: '#111',
                border: '2px solid #222',
                borderRadius: '0px',
                fontSize: '12px',
                fontFamily: 'var(--font-vt323)',
                color: '#fff'
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend 
              wrapperStyle={{ 
                fontSize: '10px', 
                fontFamily: 'var(--font-press-start)',
                paddingTop: '20px',
                textTransform: 'uppercase'
              }}
            />
            <Bar dataKey="ganho" fill="#4dbdff" radius={[2, 2, 0, 0]} />
            <Bar dataKey="gasto" fill="#ff6b6b" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

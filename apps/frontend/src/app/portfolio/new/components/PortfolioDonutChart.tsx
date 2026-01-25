'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';

interface PortfolioItem {
  symbol: string;
  quantity: number;
}

interface PortfolioDonutChartProps {
  items: PortfolioItem[];
  colors: string[];
}

export function PortfolioDonutChart({ items, colors }: PortfolioDonutChartProps) {
  const data = useMemo(() => {
    if (items.length === 0) return [{ name: 'Empty', value: 1 }];
    return items.map((item) => ({
      name: item.symbol,
      value: item.quantity,
    }));
  }, [items]);

  const isEmpty = items.length === 0;

  return (
    <div className="h-[250px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={isEmpty ? 0 : 5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={isEmpty ? '#334155' : colors[index % colors.length]} 
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length && !isEmpty) {
                return (
                  <div className="glass-panel px-3 py-2 text-xs font-bold shadow-xl">
                    <p className="text-black dark:text-white">{payload[0].name}</p>
                    <p className="text-cyan-600 dark:text-cyan-400">Qty: {payload[0].value}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-3xl font-bold text-black dark:text-white">
            {items.length}
          </p>
          <p className="text-xs text-black/50 dark:text-white/50 uppercase tracking-wider font-semibold">
            Assets
          </p>
        </div>
      </div>
    </div>
  );
}

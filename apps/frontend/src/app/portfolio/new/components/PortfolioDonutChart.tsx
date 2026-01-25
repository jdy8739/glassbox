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
    <div className="h-[280px] w-full relative group">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/5 to-purple-400/5 rounded-full blur-3xl scale-75 animate-pulse"></div>

      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={100}
            paddingAngle={isEmpty ? 0 : 4}
            dataKey="value"
            stroke="none"
            cornerRadius={6}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={isEmpty ? '#334155' : colors[index % colors.length]}
                className="transition-all duration-300 hover:opacity-90 hover:scale-105 stroke-2 stroke-white/10"
              />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length && !isEmpty) {
                const data = payload[0];
                return (
                  <div className="glass-panel px-4 py-3 shadow-xl border-white/20 dark:border-white/10 backdrop-blur-xl">
                    <p className="text-sm font-bold text-black dark:text-white mb-0.5">{data.name}</p>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.payload.fill }}></span>
                       <p className="text-xs font-semibold text-black/60 dark:text-white/60">
                         Qty: <span className="text-black dark:text-white">{data.value}</span>
                       </p>
                    </div>
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
        <div className="text-center transform transition-transform duration-300 group-hover:scale-110">
          <p className="text-4xl font-black bg-gradient-to-br from-black to-black/60 dark:from-white dark:to-white/60 bg-clip-text text-transparent tracking-tight">
            {items.length}
          </p>
          <p className="text-[10px] text-black/40 dark:text-white/40 uppercase tracking-widest font-bold mt-1">
            Assets
          </p>
        </div>
      </div>
    </div>
  );
}
'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { memo } from 'react';

interface MarketScenarioProps {
  beta: number;
  portfolioValue?: number; // Optional, defaults to $100k for visualization
}

function MarketScenarioSimulatorBase({ beta, portfolioValue = 100000 }: MarketScenarioProps) {
  // Scenarios: Market moves -5%, 0%, +5%
  const marketMoves = [-0.05, 0, 0.05];

  const data = marketMoves.map((marketMove) => {
    const marketChange = marketMove * 100;
    const unhedgedChange = marketMove * beta * 100;
    const hedgedChange = 0; // Ideally 0

    return {
      scenario: marketMove === 0 ? 'Flat Market' : marketMove > 0 ? 'Market +5%' : 'Market -5%',
      Market: marketChange,
      Unhedged: unhedgedChange,
      Hedged: hedgedChange,
      
      // For Tooltip Value display
      unhedgedValue: portfolioValue * (1 + (marketMove * beta)),
      hedgedValue: portfolioValue,
    };
  });

  return (
    <div className="glass-panel p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-black dark:text-white">Stress Test Simulator</h3>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">
            Projected P&L impact based on your Beta of <strong>{beta.toFixed(2)}</strong>
          </p>
        </div>
      </div>

      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis 
              dataKey="scenario" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value}%`} 
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass-panel p-3 border-none shadow-xl bg-white/90 dark:bg-black/90 text-xs">
                      <p className="font-bold mb-2 text-black dark:text-white">{label}</p>
                      {payload.map((entry: any) => (
                        <div key={entry.name} className="flex justify-between gap-4 mb-1">
                          <span style={{ color: entry.color }}>{entry.name}:</span>
                          <span className="font-mono">
                            {entry.value > 0 ? '+' : ''}{Number(entry.value).toFixed(2)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
            <Bar 
              dataKey="Unhedged" 
              name="Unhedged Portfolio" 
              fill="#8b5cf6" 
              radius={[4, 4, 0, 0]} 
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.Unhedged >= 0 ? '#34d399' : '#f472b6'} />
              ))}
            </Bar>
            <Bar 
              dataKey="Hedged" 
              name="Hedged Portfolio" 
              fill="#22d3ee" 
              radius={[4, 4, 0, 0]} 
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend / Key */}
      <div className="flex gap-6 justify-center text-xs text-black/70 dark:text-white/70">
         <div className="flex items-center gap-2">
           <span className="w-3 h-3 rounded bg-emerald-400"></span>
           <span>Profit (Unhedged)</span>
         </div>
         <div className="flex items-center gap-2">
           <span className="w-3 h-3 rounded bg-pink-400"></span>
           <span>Loss (Unhedged)</span>
         </div>
         <div className="flex items-center gap-2">
           <span className="w-3 h-3 rounded bg-cyan-400"></span>
           <span>Hedged (Neutral)</span>
         </div>
      </div>
    </div>
  );
}

export const MarketScenarioSimulator = memo(MarketScenarioSimulatorBase);

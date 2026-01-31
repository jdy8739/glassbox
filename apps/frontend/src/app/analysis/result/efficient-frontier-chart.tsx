'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Cell,
  Label
} from 'recharts';
import { memo } from 'react';
import type { AnalysisSnapshot } from '@glassbox/types';

interface EfficientFrontierChartProps {
  data: AnalysisSnapshot;
}

function EfficientFrontierChartBase({ data }: EfficientFrontierChartProps) {
  const { efficientFrontier, gmv, maxSharpe, randomPortfolios } = data;

  // Format data for chart
  const frontierData = efficientFrontier.map((point) => ({
    x: point.volatility,
    y: point.return,
    sharpe: point.sharpeRatio,
    name: 'Efficient Frontier',
  }));

  // Add random portfolios if available (Monte Carlo simulation points)
  const randomData = randomPortfolios?.map((point) => ({
    x: point.volatility,
    y: point.return,
    sharpe: point.sharpeRatio,
    name: 'Random Portfolio',
  })) || [];

  const gmvData = {
    x: gmv.stats.volatility,
    y: gmv.stats.return,
    name: 'Global Min Variance',
  };

  const maxSharpeData = {
    x: maxSharpe.stats.volatility,
    y: maxSharpe.stats.return,
    name: 'Max Sharpe Ratio',
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl p-3 shadow-xl text-xs border bg-white/95 dark:bg-slate-900/95 border-cyan-400/30 dark:border-cyan-400/40" style={{ backdropFilter: 'blur(12px)' }}>
          <p className="font-bold text-black dark:text-white mb-2">{data.name}</p>
          <div className="space-y-1 text-sm">
            <p className="text-black/70 dark:text-white/70">
              Return: <span className="font-mono text-black dark:text-white">{(data.y * 100).toFixed(2)}%</span>
            </p>
            <p className="text-black/70 dark:text-white/70">
              Risk (Vol): <span className="font-mono text-black dark:text-white">{(data.x * 100).toFixed(2)}%</span>
            </p>
            {data.sharpe && (
              <p className="text-black/70 dark:text-white/70">
                Sharpe: <span className="font-mono text-black dark:text-white">{data.sharpe.toFixed(2)}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] w-full [&_*]:outline-none [&_*]:focus:outline-none">
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
          <XAxis
            type="number"
            dataKey="x"
            name="Volatility"
            unit=""
            tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
            stroke="rgba(128,128,128,0.5)"
            fontSize={12}
            domain={['auto', 'auto']}
          >
            <Label value="Risk (Volatility)" offset={-10} position="insideBottom" style={{ fill: 'rgba(128,128,128,0.7)' }} />
          </XAxis>
          <YAxis
            type="number"
            dataKey="y"
            name="Return"
            unit=""
            tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
            stroke="rgba(128,128,128,0.5)"
            fontSize={12}
            domain={['auto', 'auto']}
          >
            <Label value="Expected Return" angle={-90} position="insideLeft" style={{ fill: 'rgba(128,128,128,0.7)' }} />
          </YAxis>
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#06b6d4', strokeWidth: 1.5 }} />
          
          {/* Random Portfolios (Background) */}
          {randomData.length > 0 && (
            <Scatter
              name="Random Portfolios"
              data={randomData}
              fill="#8884d8"
              opacity={0.3}
              radius={2}
              isAnimationActive={false}
              activeShape={false}
            >
               {randomData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill="rgba(100, 100, 100, 0.3)" />
               ))}
            </Scatter>
          )}

          {/* Efficient Frontier Line (approximated by scatter points for now) */}
          <Scatter
            name="Efficient Frontier"
            data={frontierData}
            line={{ stroke: '#4ade80', strokeWidth: 2 }}
            shape="circle"
            isAnimationActive={false}
            activeShape={false}
          >
            {frontierData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="transparent" stroke="transparent" />
            ))}
          </Scatter>

          {/* Highlights */}
          <ReferenceDot x={gmvData.x} y={gmvData.y} r={6} fill="#FCD34D" stroke="none" />
          <ReferenceDot x={maxSharpeData.x} y={maxSharpeData.y} r={6} fill="#F87171" stroke="none" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export const EfficientFrontierChart = memo(EfficientFrontierChartBase);

'use client';

import { BarChart3, PieChart, TrendingUp, Activity } from 'lucide-react';

export function HeroVisual() {
  return (
    <div className="relative w-full max-w-[600px] mx-auto perspective-1000 group">
      {/* Floating Elements Background */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* Main Glass Dashboard Card - Tilted */}
      <div 
        className="relative glass-panel p-6 transform rotate-y-12 rotate-x-6 transition-transform duration-700 group-hover:rotate-y-6 group-hover:rotate-x-3 shadow-2xl border-white/40 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Header Mockup */}
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
          </div>
          <div className="h-2 w-24 bg-white/20 rounded-full"></div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Stat Card 1 */}
          <div className="glass-card bg-white/10 p-3 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="h-2 w-16 bg-white/20 rounded-full"></div>
            <div className="h-4 w-12 bg-white/40 rounded-full"></div>
          </div>
          {/* Stat Card 2 */}
          <div className="glass-card bg-white/10 p-3 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-400/20 flex items-center justify-center">
              <PieChart className="w-4 h-4 text-purple-400" />
            </div>
            <div className="h-2 w-16 bg-white/20 rounded-full"></div>
            <div className="h-4 w-12 bg-white/40 rounded-full"></div>
          </div>
          {/* Stat Card 3 */}
          <div className="glass-card bg-white/10 p-3 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-pink-400/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-pink-400" />
            </div>
            <div className="h-2 w-16 bg-white/20 rounded-full"></div>
            <div className="h-4 w-12 bg-white/40 rounded-full"></div>
          </div>
        </div>

        {/* Chart Mockup */}
        <div className="glass-card bg-gradient-to-br from-white/5 to-white/0 p-5 rounded-xl h-48 relative overflow-hidden flex items-end gap-2">
          {/* Mock Bars */}
          {[40, 70, 45, 90, 60, 80, 50, 75, 60, 95].map((height, i) => (
             <div 
               key={i} 
               className="flex-1 bg-gradient-to-t from-cyan-400/50 to-purple-400/50 rounded-t-sm hover:from-cyan-400 hover:to-purple-400 transition-all duration-300"
               style={{ height: `${height}%` }}
             ></div>
          ))}
          
          {/* Efficient Frontier Curve Overlay (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
             <path 
               d="M0,150 Q50,140 100,80 T300,20" 
               fill="none" 
               stroke="url(#gradient)" 
               strokeWidth="3" 
               className="drop-shadow-lg"
             />
             <defs>
               <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#22d3ee" />
                 <stop offset="100%" stopColor="#c084fc" />
               </linearGradient>
             </defs>
          </svg>
        </div>

        {/* Floating Badge */}
        <div className="absolute -right-8 top-1/2 glass-panel px-4 py-3 rounded-xl transform translate-z-10 animate-bounce shadow-xl border-cyan-400/30">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs font-bold text-black dark:text-white">Optimized</span>
          </div>
        </div>
      </div>
    </div>
  );
}

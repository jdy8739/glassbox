'use client';

import { useTranslation } from 'react-i18next';
import { Layers, Shield, Zap, TrendingUp, Bitcoin } from 'lucide-react';

interface Template {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: any;
  items: { symbol: string; quantity: number }[];
  color: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'classic-60-40',
    nameKey: 'portfolio.template.classic-60-40.name',
    descriptionKey: 'portfolio.template.classic-60-40.description',
    icon: Shield,
    items: [
      { symbol: 'SPY', quantity: 60 },
      { symbol: 'TLT', quantity: 40 },
    ],
    color: 'slate-glow',
  },
  {
    id: 'big-tech',
    nameKey: 'portfolio.template.big-tech.name',
    descriptionKey: 'portfolio.template.big-tech.description',
    icon: Zap,
    items: [
      { symbol: 'AAPL', quantity: 20 },
      { symbol: 'MSFT', quantity: 20 },
      { symbol: 'GOOGL', quantity: 15 },
      { symbol: 'AMZN', quantity: 15 },
      { symbol: 'NVDA', quantity: 15 },
      { symbol: 'META', quantity: 15 },
    ],
    color: 'cyan-blue',
  },
  {
    id: 'all-weather',
    nameKey: 'portfolio.template.all-weather.name',
    descriptionKey: 'portfolio.template.all-weather.description',
    icon: Layers,
    items: [
      { symbol: 'SPY', quantity: 30 },
      { symbol: 'TLT', quantity: 40 },
      { symbol: 'IEF', quantity: 15 },
      { symbol: 'GLD', quantity: 7.5 },
      { symbol: 'DBC', quantity: 7.5 },
    ],
    color: 'coral-pink',
  },
  {
    id: 'crypto-heavy',
    nameKey: 'portfolio.template.crypto-heavy.name',
    descriptionKey: 'portfolio.template.crypto-heavy.description',
    icon: Bitcoin,
    items: [
      { symbol: 'BTC', quantity: 50 },
      { symbol: 'ETH', quantity: 30 },
      { symbol: 'COIN', quantity: 20 },
    ],
    color: 'cyan-purple',
  }
];

interface StarterTemplatesProps {
  onSelect: (items: { symbol: string; quantity: number }[]) => void;
}

export function StarterTemplates({ onSelect }: StarterTemplatesProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {TEMPLATES.map((template) => {
        const Icon = template.icon;
        return (
          <button
            key={template.id}
            onClick={() => onSelect(template.items)}
            className={`glass-card-gradient ${template.color} text-left p-5 group hover:scale-[1.02] transition-all`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 rounded-xl bg-white/20 dark:bg-black/20 backdrop-blur-md">
                <Icon className="w-6 h-6 text-black dark:text-white" />
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/20 dark:bg-black/20 text-black dark:text-white">
                {template.items.length} {t('portfolio.template.assets')}
              </span>
            </div>
            <h3 className="font-bold text-lg text-black dark:text-white mb-1 group-hover:translate-x-1 transition-transform">
              {t(template.nameKey)}
            </h3>
            <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed">
              {t(template.descriptionKey)}
            </p>
          </button>
        );
      })}
    </div>
  );
}

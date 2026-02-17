'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, BarChart3, FileText } from 'lucide-react';
import { exportAsCSV, exportAsPDF } from '@/lib/export-utils';
import type { AnalysisSnapshot, PortfolioItem } from '@glassbox/types';

interface ExportDropdownProps {
  portfolioName?: string;
  items: PortfolioItem[];
  analysis: AnalysisSnapshot | null;
  align?: 'left' | 'right';
  className?: string;
  showLabel?: boolean;
}

export function ExportDropdown({
  portfolioName,
  items,
  analysis,
  align = 'right',
  className = '',
  showLabel = true
}: ExportDropdownProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  if (!analysis) return null;

  const handleExport = (type: 'csv' | 'pdf') => {
    try {
      const exportData = {
        portfolioName,
        items,
        analysis,
        timestamp: new Date(),
      };

      if (type === 'csv') exportAsCSV(exportData);
      else exportAsPDF(exportData);
    } catch (error) {
      // Failed silently as per console cleanup request
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="h-9 w-9 lg:w-auto lg:px-3 flex-shrink-0 flex items-center justify-center lg:justify-start gap-2 rounded-lg text-xs font-medium text-slate-700 dark:text-white/80 bg-white/10 dark:bg-slate-800/50 border border-black/5 dark:border-white/10 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
        title={t('analysis.button.export')}
      >
        <Download className="w-4 h-4" />
        {showLabel && <span className="hidden lg:inline">{t('analysis.button.export')}</span>}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(false);
            }} 
          />
          <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-1 w-40 rounded-lg bg-white dark:bg-gray-900 border border-white/20 shadow-xl z-50 overflow-hidden`}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleExport('csv');
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm text-black dark:text-white border-b border-white/10 flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-cyan-500" />
              <span>{t('analysis.button.export-csv')}</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleExport('pdf');
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm text-black dark:text-white flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-purple-500" />
              <span>{t('analysis.button.export-pdf')}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
